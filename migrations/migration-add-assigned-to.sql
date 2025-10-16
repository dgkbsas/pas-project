-- =====================================================
-- MIGRACIÓN: Agregar campo assigned_to a clientes
-- =====================================================
-- Ejecutar este SQL en Supabase SQL Editor DESPUÉS del schema inicial
-- Permite asignar clientes a PAS específicos y reasignarlos cuando sea necesario

BEGIN;

-- 1. Agregar columna assigned_to a clients
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id) ON DELETE SET NULL;

-- 2. Actualizar clientes existentes para asignarlos a quien los creó
UPDATE clients
SET assigned_to = created_by
WHERE assigned_to IS NULL;

-- 3. Hacer el campo obligatorio (después de actualizar)
ALTER TABLE clients
ALTER COLUMN assigned_to SET NOT NULL;

-- 4. Agregar índice para performance
CREATE INDEX IF NOT EXISTS idx_clients_assigned_to ON clients(assigned_to);

-- 5. Actualizar el trigger para updated_at cuando cambia assigned_to
-- (Ya existe el trigger, no necesita cambios)

-- =====================================================
-- ACTUALIZAR POLÍTICAS RLS
-- =====================================================

-- 6. Eliminar políticas antiguas de clients
DROP POLICY IF EXISTS "Users can view clients from their company" ON clients;
DROP POLICY IF EXISTS "Agents and admins can create clients" ON clients;
DROP POLICY IF EXISTS "Agents and admins can update clients" ON clients;

-- 7. Nueva política SELECT: Agentes ven solo sus clientes asignados, admins ven todos
CREATE POLICY "Users view assigned clients, admins view all"
  ON clients FOR SELECT
  USING (
    -- El usuario es el PAS asignado
    assigned_to = auth.uid()
    OR
    -- O el usuario es admin de la misma empresa
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.company_id = clients.company_id
    )
  );

-- 8. Nueva política INSERT: Agentes pueden crear clientes y asignarlos
CREATE POLICY "Agents and admins create and assign clients"
  ON clients FOR INSERT
  WITH CHECK (
    -- El usuario pertenece a una empresa y es agent o admin
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
    AND (
      -- Pueden asignarse clientes a sí mismos
      assigned_to = auth.uid()
      OR
      -- Los admins pueden asignar a cualquier usuario de su empresa
      EXISTS (
        SELECT 1 FROM users AS assigner
        WHERE assigner.id = auth.uid()
        AND assigner.role = 'admin'
        AND assigner.company_id = company_id
        AND EXISTS (
          SELECT 1 FROM users AS assignee
          WHERE assignee.id = assigned_to
          AND assignee.company_id = company_id
        )
      )
    )
  );

-- 9. Nueva política UPDATE: Agentes actualizan sus clientes, admins todos
CREATE POLICY "Users update assigned clients, admins update all"
  ON clients FOR UPDATE
  USING (
    -- El usuario es el PAS asignado
    assigned_to = auth.uid()
    OR
    -- O el usuario es admin de la misma empresa
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.company_id = clients.company_id
    )
  )
  WITH CHECK (
    -- Mismas reglas que INSERT para el campo assigned_to
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
    AND (
      assigned_to = auth.uid()
      OR EXISTS (
        SELECT 1 FROM users AS admin_user
        WHERE admin_user.id = auth.uid()
        AND admin_user.role = 'admin'
        AND admin_user.company_id = company_id
      )
    )
  );

-- =====================================================
-- ACTUALIZAR POLÍTICAS DE PÓLIZAS
-- =====================================================

-- 10. Eliminar política antigua de policies SELECT
DROP POLICY IF EXISTS "Users can view policies from their company" ON policies;

-- 11. Nueva política: Las pólizas siguen a sus clientes
CREATE POLICY "Users view policies of assigned clients"
  ON policies FOR SELECT
  USING (
    -- El cliente de la póliza está asignado al usuario
    client_id IN (
      SELECT id FROM clients
      WHERE assigned_to = auth.uid()
    )
    OR
    -- O el usuario es admin de la misma empresa
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.company_id = policies.company_id
    )
  );

-- 12. Actualizar política UPDATE de policies
DROP POLICY IF EXISTS "Agents and admins can update policies" ON policies;

CREATE POLICY "Users update policies of assigned clients"
  ON policies FOR UPDATE
  USING (
    client_id IN (
      SELECT id FROM clients
      WHERE assigned_to = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.company_id = policies.company_id
    )
  );

-- 13. Actualizar política INSERT de policies  
DROP POLICY IF EXISTS "Agents and admins can create policies" ON policies;

CREATE POLICY "Users create policies for assigned clients"
  ON policies FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients
      WHERE assigned_to = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
      AND users.company_id = company_id
    )
  );

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON COLUMN clients.assigned_to IS 'PAS (Productor Asesor de Seguros) responsable de este cliente. Los admins pueden reasignar clientes a otros PAS.';

COMMIT;

-- =====================================================
-- RESUMEN DE CAMBIOS
-- =====================================================
-- ✅ Campo assigned_to agregado a clients
-- ✅ Clientes existentes asignados a su creador
-- ✅ Índice agregado para performance
-- ✅ Agentes solo ven sus clientes asignados
-- ✅ Admins ven todos los clientes de su empresa
-- ✅ Admins pueden reasignar clientes a otros PAS
-- ✅ Pólizas siguen la asignación de sus clientes
-- ✅ RLS actualizado en clients y policies

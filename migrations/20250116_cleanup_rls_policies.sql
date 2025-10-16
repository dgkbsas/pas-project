-- =====================================================
-- MIGRACIÓN: Limpieza y Corrección de Políticas RLS
-- Fecha: 2025-01-16
-- Descripción:
--   - Elimina todas las políticas duplicadas y conflictivas
--   - Re-habilita RLS en todas las tablas
--   - Crea políticas limpias y optimizadas
--   - Asegura que la función helper existe
-- =====================================================

-- =====================================================
-- FASE 1: Eliminar TODAS las políticas existentes
-- =====================================================

DO $$
DECLARE
  pol RECORD;
BEGIN
  -- Eliminar todas las políticas en el esquema public
  FOR pol IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
      pol.policyname, pol.schemaname, pol.tablename);
    RAISE NOTICE 'Eliminada política: % en tabla %', pol.policyname, pol.tablename;
  END LOOP;
END $$;

-- =====================================================
-- FASE 2: Re-habilitar RLS en todas las tablas
-- =====================================================

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- FASE 3: Crear función helper para company_id
-- =====================================================

-- Eliminar función existente si hay alguna
DROP FUNCTION IF EXISTS auth.user_company_id();

-- Crear función helper en el esquema auth
CREATE OR REPLACE FUNCTION auth.user_company_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Obtener company_id del usuario autenticado
  SELECT company_id INTO v_company_id
  FROM public.users
  WHERE id = auth.uid();

  RETURN v_company_id;
END;
$$;

-- Dar permisos de ejecución
GRANT EXECUTE ON FUNCTION auth.user_company_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_company_id() TO anon;

COMMENT ON FUNCTION auth.user_company_id() IS
  'Devuelve el company_id del usuario autenticado actual';

-- =====================================================
-- FASE 4: COMPANIES - Políticas
-- =====================================================

-- SELECT: Los usuarios pueden ver su propia compañía
CREATE POLICY "companies_select_own"
ON public.companies FOR SELECT
TO authenticated
USING (id = auth.user_company_id());

-- UPDATE: Solo admins pueden actualizar su compañía
CREATE POLICY "companies_update_admin"
ON public.companies FOR UPDATE
TO authenticated
USING (
  id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- INSERT: Permitir a usuarios autenticados crear compañías (para onboarding)
CREATE POLICY "companies_insert_authenticated"
ON public.companies FOR INSERT
TO authenticated
WITH CHECK (true);

-- =====================================================
-- FASE 5: USERS - Políticas
-- =====================================================

-- SELECT: Los usuarios pueden ver otros usuarios de su compañía
CREATE POLICY "users_select_company"
ON public.users FOR SELECT
TO authenticated
USING (company_id = auth.user_company_id());

-- UPDATE: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "users_update_self"
ON public.users FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- UPDATE: Los admins pueden actualizar usuarios de su compañía
CREATE POLICY "users_update_admin"
ON public.users FOR UPDATE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
)
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- INSERT: Los admins pueden crear nuevos usuarios en su compañía
CREATE POLICY "users_insert_admin"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- INSERT: Permitir inserción inicial durante onboarding
CREATE POLICY "users_insert_onboarding"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- =====================================================
-- FASE 6: CLIENTS - Políticas
-- =====================================================

-- SELECT: Los usuarios pueden ver clientes de su compañía
CREATE POLICY "clients_select_company"
ON public.clients FOR SELECT
TO authenticated
USING (company_id = auth.user_company_id());

-- INSERT: Agentes y admins pueden crear clientes
CREATE POLICY "clients_insert_agent_admin"
ON public.clients FOR INSERT
TO authenticated
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- UPDATE: Agentes y admins pueden actualizar clientes
CREATE POLICY "clients_update_agent_admin"
ON public.clients FOR UPDATE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
)
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- DELETE: Agentes y admins pueden eliminar clientes
CREATE POLICY "clients_delete_agent_admin"
ON public.clients FOR DELETE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- =====================================================
-- FASE 7: POLICIES - Políticas
-- =====================================================

-- SELECT: Los usuarios pueden ver pólizas de su compañía
CREATE POLICY "policies_select_company"
ON public.policies FOR SELECT
TO authenticated
USING (company_id = auth.user_company_id());

-- INSERT: Agentes y admins pueden crear pólizas
CREATE POLICY "policies_insert_agent_admin"
ON public.policies FOR INSERT
TO authenticated
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- UPDATE: Agentes y admins pueden actualizar pólizas
CREATE POLICY "policies_update_agent_admin"
ON public.policies FOR UPDATE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
)
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- DELETE: Agentes y admins pueden eliminar pólizas
CREATE POLICY "policies_delete_agent_admin"
ON public.policies FOR DELETE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- =====================================================
-- FASE 8: POLICY_ALERTS - Políticas
-- =====================================================

-- SELECT: Los usuarios pueden ver sus propias alertas
CREATE POLICY "policy_alerts_select_own"
ON public.policy_alerts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- INSERT: Los usuarios pueden crear alertas para pólizas de su compañía
CREATE POLICY "policy_alerts_insert_own"
ON public.policy_alerts FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_alerts.policy_id
    AND p.company_id = auth.user_company_id()
  )
);

-- UPDATE: Los usuarios pueden actualizar sus propias alertas
CREATE POLICY "policy_alerts_update_own"
ON public.policy_alerts FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE: Los usuarios pueden eliminar sus propias alertas
CREATE POLICY "policy_alerts_delete_own"
ON public.policy_alerts FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- =====================================================
-- FASE 9: POLICY_FOLLOWUPS - Políticas
-- =====================================================

-- SELECT: Los usuarios pueden ver followups de pólizas de su compañía
CREATE POLICY "policy_followups_select_company"
ON public.policy_followups FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_followups.policy_id
    AND p.company_id = auth.user_company_id()
  )
);

-- INSERT: Los usuarios pueden crear followups para pólizas de su compañía
CREATE POLICY "policy_followups_insert_company"
ON public.policy_followups FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_followups.policy_id
    AND p.company_id = auth.user_company_id()
  )
);

-- UPDATE: Los usuarios pueden actualizar sus propios followups
CREATE POLICY "policy_followups_update_own"
ON public.policy_followups FOR UPDATE
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- DELETE: Los usuarios pueden eliminar sus propios followups
CREATE POLICY "policy_followups_delete_own"
ON public.policy_followups FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- =====================================================
-- FASE 10: INSURANCE_COMPANIES - Políticas
-- =====================================================

-- SELECT: Los usuarios pueden ver aseguradoras de su compañía
CREATE POLICY "insurance_companies_select_company"
ON public.insurance_companies FOR SELECT
TO authenticated
USING (company_id = auth.user_company_id());

-- INSERT: Agentes y admins pueden crear aseguradoras
CREATE POLICY "insurance_companies_insert_agent_admin"
ON public.insurance_companies FOR INSERT
TO authenticated
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- UPDATE: Agentes y admins pueden actualizar aseguradoras
CREATE POLICY "insurance_companies_update_agent_admin"
ON public.insurance_companies FOR UPDATE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
)
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- DELETE: Solo admins pueden eliminar aseguradoras
CREATE POLICY "insurance_companies_delete_admin"
ON public.insurance_companies FOR DELETE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- =====================================================
-- FASE 11: CONFIGURATION - Políticas
-- =====================================================

-- SELECT: Los usuarios pueden ver la configuración de su compañía
CREATE POLICY "configuration_select_company"
ON public.configuration FOR SELECT
TO authenticated
USING (company_id = auth.user_company_id());

-- INSERT: Solo admins pueden crear configuraciones
CREATE POLICY "configuration_insert_admin"
ON public.configuration FOR INSERT
TO authenticated
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- UPDATE: Solo admins pueden actualizar configuraciones
CREATE POLICY "configuration_update_admin"
ON public.configuration FOR UPDATE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- DELETE: Solo admins pueden eliminar configuraciones
CREATE POLICY "configuration_delete_admin"
ON public.configuration FOR DELETE
TO authenticated
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- =====================================================
-- FASE 12: Verificación
-- =====================================================

-- Mostrar estado de RLS
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✓ HABILITADO' ELSE '✗ DESHABILITADO' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Contar políticas por tabla
SELECT
  tablename,
  COUNT(*) as num_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- =====================================================
-- NOTAS FINALES
-- =====================================================

-- ✅ RLS habilitado en todas las tablas
-- ✅ Función auth.user_company_id() creada y optimizada
-- ✅ Políticas limpias sin duplicados
-- ✅ Permisos consistentes:
--    - admin: Control total sobre su compañía
--    - agent: Puede gestionar clientes, pólizas, aseguradoras
--    - guest: Solo lectura (si implementas este rol)
-- ✅ Los usuarios solo ven datos de su compañía
-- ✅ Políticas optimizadas usando la función helper

-- IMPORTANTE: Esta migración elimina TODAS las políticas anteriores
-- y las reemplaza con políticas limpias y optimizadas.
-- Después de ejecutar esta migración, el sistema debería funcionar
-- correctamente sin errores 404 de acceso.

-- =====================================================

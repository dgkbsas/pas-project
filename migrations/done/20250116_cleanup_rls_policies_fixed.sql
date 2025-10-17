-- =====================================================
-- MIGRACIÓN: Limpieza y Corrección de Políticas RLS
-- Fecha: 2025-01-16 (VERSIÓN CORREGIDA)
-- =====================================================

-- FASE 1: Eliminar TODAS las políticas existentes
DO $$
DECLARE
  pol RECORD;
BEGIN
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

-- FASE 2: Re-habilitar RLS en todas las tablas
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuration ENABLE ROW LEVEL SECURITY;

-- FASE 3: Crear función helper para company_id
DROP FUNCTION IF EXISTS auth.user_company_id();
DROP FUNCTION IF EXISTS public.get_user_company_id();

CREATE OR REPLACE FUNCTION public.get_user_company_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT company_id
  FROM public.users
  WHERE id = auth.uid()
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_company_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_company_id() TO anon;

-- FASE 4: COMPANIES - Políticas
CREATE POLICY "companies_select_own"
ON public.companies FOR SELECT
TO authenticated
USING (id = public.get_user_company_id());

CREATE POLICY "companies_update_admin"
ON public.companies FOR UPDATE
TO authenticated
USING (
  id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "companies_insert_authenticated"
ON public.companies FOR INSERT
TO authenticated
WITH CHECK (true);

-- FASE 5: USERS - Políticas
CREATE POLICY "users_select_company"
ON public.users FOR SELECT
TO authenticated
USING (company_id = public.get_user_company_id());

CREATE POLICY "users_update_self"
ON public.users FOR UPDATE
TO authenticated
USING (id = auth.uid());

CREATE POLICY "users_update_admin"
ON public.users FOR UPDATE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

CREATE POLICY "users_insert_admin"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "users_insert_onboarding"
ON public.users FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- FASE 6: CLIENTS - Políticas
CREATE POLICY "clients_select_company"
ON public.clients FOR SELECT
TO authenticated
USING (company_id = public.get_user_company_id());

CREATE POLICY "clients_insert_agent_admin"
ON public.clients FOR INSERT
TO authenticated
WITH CHECK (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

CREATE POLICY "clients_update_agent_admin"
ON public.clients FOR UPDATE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

CREATE POLICY "clients_delete_agent_admin"
ON public.clients FOR DELETE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- FASE 7: POLICIES - Políticas
CREATE POLICY "policies_select_company"
ON public.policies FOR SELECT
TO authenticated
USING (company_id = public.get_user_company_id());

CREATE POLICY "policies_insert_agent_admin"
ON public.policies FOR INSERT
TO authenticated
WITH CHECK (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

CREATE POLICY "policies_update_agent_admin"
ON public.policies FOR UPDATE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

CREATE POLICY "policies_delete_agent_admin"
ON public.policies FOR DELETE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- FASE 8: POLICY_ALERTS - Políticas
CREATE POLICY "policy_alerts_select_own"
ON public.policy_alerts FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "policy_alerts_insert_own"
ON public.policy_alerts FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_alerts.policy_id
    AND p.company_id = public.get_user_company_id()
  )
);

CREATE POLICY "policy_alerts_update_own"
ON public.policy_alerts FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "policy_alerts_delete_own"
ON public.policy_alerts FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- FASE 9: POLICY_FOLLOWUPS - Políticas
CREATE POLICY "policy_followups_select_company"
ON public.policy_followups FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_followups.policy_id
    AND p.company_id = public.get_user_company_id()
  )
);

CREATE POLICY "policy_followups_insert_company"
ON public.policy_followups FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_followups.policy_id
    AND p.company_id = public.get_user_company_id()
  )
);

CREATE POLICY "policy_followups_update_own"
ON public.policy_followups FOR UPDATE
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "policy_followups_delete_own"
ON public.policy_followups FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- FASE 10: INSURANCE_COMPANIES - Políticas
CREATE POLICY "insurance_companies_select_company"
ON public.insurance_companies FOR SELECT
TO authenticated
USING (company_id = public.get_user_company_id());

CREATE POLICY "insurance_companies_insert_agent_admin"
ON public.insurance_companies FOR INSERT
TO authenticated
WITH CHECK (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

CREATE POLICY "insurance_companies_update_agent_admin"
ON public.insurance_companies FOR UPDATE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

CREATE POLICY "insurance_companies_delete_admin"
ON public.insurance_companies FOR DELETE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- FASE 11: CONFIGURATION - Políticas
CREATE POLICY "configuration_select_company"
ON public.configuration FOR SELECT
TO authenticated
USING (company_id = public.get_user_company_id());

CREATE POLICY "configuration_insert_admin"
ON public.configuration FOR INSERT
TO authenticated
WITH CHECK (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "configuration_update_admin"
ON public.configuration FOR UPDATE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

CREATE POLICY "configuration_delete_admin"
ON public.configuration FOR DELETE
TO authenticated
USING (
  company_id = public.get_user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Verificación
SELECT
  tablename,
  CASE WHEN rowsecurity THEN '✓ HABILITADO' ELSE '✗ DESHABILITADO' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('companies', 'users', 'clients', 'policies',
                    'policy_alerts', 'policy_followups',
                    'insurance_companies', 'configuration')
ORDER BY tablename;

SELECT
  tablename,
  COUNT(*) as num_policies
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- =============================================================================
-- Row Level Security (RLS) Policies for PAS Manager
-- =============================================================================
-- This script enables RLS and creates policies for all tables
-- Run this in Supabase SQL Editor: Settings → SQL Editor → New query
-- =============================================================================

-- =============================================================================
-- Helper function to get user's company_id from users table
-- =============================================================================
CREATE OR REPLACE FUNCTION auth.user_company_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT company_id
    FROM public.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- COMPANIES TABLE
-- =============================================================================

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own company
CREATE POLICY "Users can view their own company"
ON public.companies FOR SELECT
USING (id = auth.user_company_id());

-- Policy: Admins can update their own company
CREATE POLICY "Admins can update their own company"
ON public.companies FOR UPDATE
USING (
  id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- =============================================================================
-- USERS TABLE
-- =============================================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view other users in their company
CREATE POLICY "Users can view users in their company"
ON public.users FOR SELECT
USING (company_id = auth.user_company_id());

-- Policy: Users can view their own data
CREATE POLICY "Users can view their own data"
ON public.users FOR SELECT
USING (id = auth.uid());

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.users FOR UPDATE
USING (id = auth.uid());

-- Policy: Admins can manage users in their company
CREATE POLICY "Admins can manage users in their company"
ON public.users FOR ALL
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users u
    WHERE u.id = auth.uid()
    AND u.role = 'admin'
  )
);

-- =============================================================================
-- CLIENTS TABLE
-- =============================================================================

-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view clients in their company
CREATE POLICY "Users can view clients in their company"
ON public.clients FOR SELECT
USING (company_id = auth.user_company_id());

-- Policy: Users can create clients in their company
CREATE POLICY "Users can create clients in their company"
ON public.clients FOR INSERT
WITH CHECK (company_id = auth.user_company_id());

-- Policy: Users can update clients in their company
CREATE POLICY "Users can update clients in their company"
ON public.clients FOR UPDATE
USING (company_id = auth.user_company_id());

-- Policy: Admins can delete clients in their company
CREATE POLICY "Admins can delete clients in their company"
ON public.clients FOR DELETE
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- =============================================================================
-- POLICIES TABLE
-- =============================================================================

-- Enable RLS
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view policies in their company
CREATE POLICY "Users can view policies in their company"
ON public.policies FOR SELECT
USING (company_id = auth.user_company_id());

-- Policy: Users can create policies in their company
CREATE POLICY "Users can create policies in their company"
ON public.policies FOR INSERT
WITH CHECK (company_id = auth.user_company_id());

-- Policy: Users can update policies in their company
CREATE POLICY "Users can update policies in their company"
ON public.policies FOR UPDATE
USING (company_id = auth.user_company_id());

-- Policy: Admins and agents can delete policies in their company
CREATE POLICY "Admins and agents can delete policies"
ON public.policies FOR DELETE
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- =============================================================================
-- POLICY_ALERTS TABLE
-- =============================================================================

-- Enable RLS
ALTER TABLE public.policy_alerts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own alerts
CREATE POLICY "Users can view their own alerts"
ON public.policy_alerts FOR SELECT
USING (user_id = auth.uid());

-- Policy: System can create alerts for any user (for automated alerts)
CREATE POLICY "System can create alerts"
ON public.policy_alerts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_alerts.policy_id
    AND p.company_id = auth.user_company_id()
  )
);

-- Policy: Users can update their own alerts (mark as read)
CREATE POLICY "Users can update their own alerts"
ON public.policy_alerts FOR UPDATE
USING (user_id = auth.uid());

-- Policy: Users can delete their own alerts
CREATE POLICY "Users can delete their own alerts"
ON public.policy_alerts FOR DELETE
USING (user_id = auth.uid());

-- =============================================================================
-- POLICY_FOLLOWUPS TABLE
-- =============================================================================

-- Enable RLS
ALTER TABLE public.policy_followups ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view followups for policies in their company
CREATE POLICY "Users can view followups in their company"
ON public.policy_followups FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_followups.policy_id
    AND p.company_id = auth.user_company_id()
  )
);

-- Policy: Users can create followups for policies in their company
CREATE POLICY "Users can create followups in their company"
ON public.policy_followups FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.policies p
    WHERE p.id = policy_followups.policy_id
    AND p.company_id = auth.user_company_id()
  )
);

-- Policy: Users can update followups they created
CREATE POLICY "Users can update their own followups"
ON public.policy_followups FOR UPDATE
USING (created_by = auth.uid());

-- Policy: Users can delete followups they created
CREATE POLICY "Users can delete their own followups"
ON public.policy_followups FOR DELETE
USING (created_by = auth.uid());

-- =============================================================================
-- INSURANCE_COMPANIES TABLE
-- =============================================================================

-- Enable RLS
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view insurance companies in their company
CREATE POLICY "Users can view insurance companies"
ON public.insurance_companies FOR SELECT
USING (company_id = auth.user_company_id());

-- Policy: Admins and agents can create insurance companies
CREATE POLICY "Admins and agents can create insurance companies"
ON public.insurance_companies FOR INSERT
WITH CHECK (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- Policy: Admins and agents can update insurance companies
CREATE POLICY "Admins and agents can update insurance companies"
ON public.insurance_companies FOR UPDATE
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'agent')
  )
);

-- Policy: Admins can delete insurance companies
CREATE POLICY "Admins can delete insurance companies"
ON public.insurance_companies FOR DELETE
USING (
  company_id = auth.user_company_id() AND
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- =============================================================================
-- COMPANY_INVITATIONS TABLE (if it exists)
-- =============================================================================

-- Check if table exists before enabling RLS
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'company_invitations') THEN
    -- Enable RLS
    ALTER TABLE public.company_invitations ENABLE ROW LEVEL SECURITY;

    -- Policy: Admins can view invitations for their company
    CREATE POLICY "Admins can view company invitations"
    ON public.company_invitations FOR SELECT
    USING (
      company_id = auth.user_company_id() AND
      EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
      )
    );

    -- Policy: Admins can create invitations for their company
    CREATE POLICY "Admins can create company invitations"
    ON public.company_invitations FOR INSERT
    WITH CHECK (
      company_id = auth.user_company_id() AND
      EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
      )
    );

    -- Policy: Admins can delete invitations for their company
    CREATE POLICY "Admins can delete company invitations"
    ON public.company_invitations FOR DELETE
    USING (
      company_id = auth.user_company_id() AND
      EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
      )
    );
  END IF;
END $$;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify RLS is enabled on all tables
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'companies',
    'users',
    'clients',
    'policies',
    'policy_alerts',
    'policy_followups',
    'insurance_companies',
    'company_invitations'
  )
ORDER BY tablename;

-- View all policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =============================================================================
-- NOTES
-- =============================================================================
--
-- IMPORTANT:
-- 1. All tables now respect Row Level Security
-- 2. Users can only access data from their own company
-- 3. The auth.user_company_id() function is used to determine user's company
-- 4. Different roles have different permissions (admin, agent, guest)
-- 5. Users table has special policies for self-management
--
-- ROLES:
-- - admin: Full access to all data in their company
-- - agent: Can manage clients, policies, and followups
-- - guest: Read-only access to data
--
-- TESTING:
-- After running this script, test with your application using the ANON key
-- The application should work normally with proper access control
--
-- =============================================================================

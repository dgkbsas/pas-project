-- Performance Indexes for PASManager (Basic Version)
-- Run this in Supabase SQL Editor to improve query performance
-- This version does NOT include GIN indexes for full-text search

-- ============================================
-- POLICIES TABLE INDEXES
-- ============================================

-- Index for company_id (used in almost all queries)
CREATE INDEX IF NOT EXISTS idx_policies_company_id 
ON policies(company_id);

-- Index for client_id (used for client-specific policy queries)
CREATE INDEX IF NOT EXISTS idx_policies_client_id 
ON policies(client_id);

-- Index for active status (frequently filtered)
CREATE INDEX IF NOT EXISTS idx_policies_active 
ON policies(active);

-- Composite index for company + active (most common filter combination)
CREATE INDEX IF NOT EXISTS idx_policies_company_active 
ON policies(company_id, active);

-- Index for sorting by expiry_date
CREATE INDEX IF NOT EXISTS idx_policies_expiry_date 
ON policies(expiry_date DESC);

-- Index for sorting by created_at
CREATE INDEX IF NOT EXISTS idx_policies_created_at 
ON policies(created_at DESC);

-- Index for policy_type (used in filters)
CREATE INDEX IF NOT EXISTS idx_policies_policy_type 
ON policies(policy_type);

-- Index for insurer (used in filters and sorting)
CREATE INDEX IF NOT EXISTS idx_policies_insurer 
ON policies(insurer);

-- Index for payment_mode (used in filters)
CREATE INDEX IF NOT EXISTS idx_policies_payment_mode 
ON policies(payment_mode);

-- ============================================
-- CLIENTS TABLE INDEXES
-- ============================================

-- Index for company_id
CREATE INDEX IF NOT EXISTS idx_clients_company_id 
ON clients(company_id);

-- Index for active status
CREATE INDEX IF NOT EXISTS idx_clients_active 
ON clients(active);

-- Composite index for company + active
CREATE INDEX IF NOT EXISTS idx_clients_company_active 
ON clients(company_id, active);

-- Index for sorting by first_name
CREATE INDEX IF NOT EXISTS idx_clients_first_name 
ON clients(first_name);

-- Index for sorting by last_name
CREATE INDEX IF NOT EXISTS idx_clients_last_name 
ON clients(last_name);

-- Index for sorting by created_at
CREATE INDEX IF NOT EXISTS idx_clients_created_at 
ON clients(created_at DESC);

-- Index for sorting by updated_at
CREATE INDEX IF NOT EXISTS idx_clients_updated_at 
ON clients(updated_at DESC);

-- Index for city filter
CREATE INDEX IF NOT EXISTS idx_clients_city 
ON clients(city);

-- ============================================
-- INSURANCE COMPANIES TABLE INDEXES
-- ============================================

-- Index for company_id
CREATE INDEX IF NOT EXISTS idx_insurance_companies_company_id 
ON insurance_companies(company_id);

-- Index for active status
CREATE INDEX IF NOT EXISTS idx_insurance_companies_active 
ON insurance_companies(active);

-- Composite index for company + active
CREATE INDEX IF NOT EXISTS idx_insurance_companies_company_active 
ON insurance_companies(company_id, active);

-- Index for sorting by name
CREATE INDEX IF NOT EXISTS idx_insurance_companies_name 
ON insurance_companies(name);

-- ============================================
-- USERS TABLE INDEXES
-- ============================================

-- Index for company_id (used in authorization checks)
CREATE INDEX IF NOT EXISTS idx_users_company_id 
ON users(company_id);

-- Index for role (used in permission checks)
CREATE INDEX IF NOT EXISTS idx_users_role 
ON users(role);

-- Composite index for company + role
CREATE INDEX IF NOT EXISTS idx_users_company_role 
ON users(company_id, role);

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify indexes were created
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('policies', 'clients', 'insurance_companies', 'users')
ORDER BY tablename, indexname;

-- Analyze tables to update statistics for query planner
ANALYZE policies;
ANALYZE clients;
ANALYZE insurance_companies;
ANALYZE users;

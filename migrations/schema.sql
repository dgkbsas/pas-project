-- Insurance Management System Database Schema
-- Execute this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- User roles within a company
CREATE TYPE user_role AS ENUM ('admin', 'agent', 'guest');

-- Policy types (insurance types available in Argentina)
CREATE TYPE policy_type AS ENUM (
  'auto',                    -- Vehículos automotores
  'moto',                    -- Motocicletas
  'home',                    -- Hogar
  'fire',                    -- Incendio
  'various_risks',           -- Riesgos varios
  'collective_life',         -- Vida colectivo
  'mandatory_life',          -- Vida obligatorio
  'transport',               -- Transporte
  'technical',               -- Seguro técnico
  'civil_liability',         -- Responsabilidad civil
  'life_options',            -- Opciones de vida
  'pets',                    -- Mascotas
  'malpractice',            -- Mala praxis
  'life_investment',        -- Inversión de vida
  'guarantee',              -- Caución
  'consortium',             -- Consorcio
  'personal_accidents',     -- Accidentes personales
  'art',                    -- ART (Aseguradora de Riesgos del Trabajo)
  'agricultural',           -- Agrícola
  'other'                   -- Otros
);

-- Payment modes
CREATE TYPE payment_mode AS ENUM (
  'monthly',         -- Mensual
  'quarterly',       -- Trimestral
  'biannual',        -- Semestral
  'annual',          -- Anual
  'single_payment'   -- Pago único
);

-- =====================================================
-- TABLES
-- =====================================================

-- Companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role user_role DEFAULT 'agent',
  alert_days_before_expiry INTEGER DEFAULT 30, -- Days before policy expiry to show alerts
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),

  -- Personal information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  document_number TEXT,
  birth_date DATE,

  -- Contact information
  email_primary TEXT,
  email_secondary TEXT,
  phone TEXT,

  -- Address
  address TEXT,
  postal_code TEXT,
  city TEXT,
  province TEXT,

  -- Additional fields
  alias_pas TEXT, -- Internal alias for the client
  referred_by TEXT, -- Who referred this client
  observations TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_edited_by UUID REFERENCES users(id),
  active BOOLEAN DEFAULT TRUE
);

-- Policies table
CREATE TABLE policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES users(id),

  -- Policy information
  policy_number TEXT,
  policy_type policy_type NOT NULL,
  payment_mode payment_mode,

  -- Dates
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,

  -- Vehicle specific (optional)
  vehicle_plate TEXT, -- Dominio del vehículo

  -- Additional information
  observations TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_edited_by UUID REFERENCES users(id),
  active BOOLEAN DEFAULT TRUE
);

-- Policy alerts table (for custom alerts set by users)
CREATE TABLE policy_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  alert_date DATE NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for performance
-- =====================================================

CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_clients_company ON clients(company_id);
CREATE INDEX idx_clients_active ON clients(active);
CREATE INDEX idx_clients_created_by ON clients(created_by);
CREATE INDEX idx_policies_client ON policies(client_id);
CREATE INDEX idx_policies_company ON policies(company_id);
CREATE INDEX idx_policies_active ON policies(active);
CREATE INDEX idx_policies_expiry ON policies(expiry_date);
CREATE INDEX idx_policies_type ON policies(policy_type);
CREATE INDEX idx_policy_alerts_user ON policy_alerts(user_id);
CREATE INDEX idx_policy_alerts_date ON policy_alerts(alert_date);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user entry when auth user is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- This will be called from the application, not automatically
  -- Just a placeholder for future automation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_alerts ENABLE ROW LEVEL SECURITY;

-- Companies: Users can only see their own company
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Users: Can view users from their company only
CREATE POLICY "Users can view users from their company"
  ON users FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Users: Admins can update users in their company
CREATE POLICY "Admins can update users in their company"
  ON users FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Clients: Users can view clients from their company
CREATE POLICY "Users can view clients from their company"
  ON clients FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Clients: Agents and admins can create clients
CREATE POLICY "Agents and admins can create clients"
  ON clients FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Clients: Agents and admins can update clients (guests cannot)
CREATE POLICY "Agents and admins can update clients"
  ON clients FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Policies: Users can view policies from clients in their company
CREATE POLICY "Users can view policies from their company"
  ON policies FOR SELECT
  USING (company_id IN (
    SELECT company_id FROM users WHERE id = auth.uid()
  ));

-- Policies: Agents and admins can create policies
CREATE POLICY "Agents and admins can create policies"
  ON policies FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Policies: Agents and admins can update policies
CREATE POLICY "Agents and admins can update policies"
  ON policies FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM users
      WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
  );

-- Policy Alerts: Users can view their own alerts
CREATE POLICY "Users can view their own alerts"
  ON policy_alerts FOR SELECT
  USING (user_id = auth.uid());

-- Policy Alerts: Users can create their own alerts
CREATE POLICY "Users can create their own alerts"
  ON policy_alerts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Policy Alerts: Users can update their own alerts
CREATE POLICY "Users can update their own alerts"
  ON policy_alerts FOR UPDATE
  USING (user_id = auth.uid());

-- =====================================================
-- INITIAL DATA (Optional - for testing)
-- =====================================================

-- Insert a default company (you can modify or remove this)
INSERT INTO companies (name) VALUES ('Demo Insurance Company');

-- Note: Users must be created through Supabase Auth first,
-- then added to the users table with their company_id

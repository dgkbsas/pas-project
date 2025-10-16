-- Migration: Create insurance_companies and configuration tables
-- Created: 2025-01-12
-- Description: Add tables for managing insurance companies and company configurations

-- =====================================================
-- insurance_companies table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.insurance_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Insurance company information
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50), -- Short code for the insurance company
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  website VARCHAR(255),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  active BOOLEAN DEFAULT true,
  
  -- Constraints
  CONSTRAINT unique_insurance_company_per_company UNIQUE(company_id, name)
);

-- Index for faster queries
CREATE INDEX idx_insurance_companies_company_id ON public.insurance_companies(company_id);
CREATE INDEX idx_insurance_companies_active ON public.insurance_companies(active);

-- RLS Policies
ALTER TABLE public.insurance_companies ENABLE ROW LEVEL SECURITY;

-- Users can view insurance companies from their own company
CREATE POLICY "Users can view own company insurance companies"
  ON public.insurance_companies
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Admins can manage insurance companies
CREATE POLICY "Admins can manage insurance companies"
  ON public.insurance_companies
  FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- configuration table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Configuration key-value
  config_key VARCHAR(100) NOT NULL,
  config_value JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Constraints - one config key per company
  CONSTRAINT unique_config_key_per_company UNIQUE(company_id, config_key)
);

-- Index for faster queries
CREATE INDEX idx_configuration_company_id ON public.configuration(company_id);
CREATE INDEX idx_configuration_key ON public.configuration(config_key);

-- RLS Policies
ALTER TABLE public.configuration ENABLE ROW LEVEL SECURITY;

-- Users can view their company configuration
CREATE POLICY "Users can view own company configuration"
  ON public.configuration
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Only admins can update configuration
CREATE POLICY "Admins can manage configuration"
  ON public.configuration
  FOR ALL
  USING (
    company_id IN (
      SELECT company_id FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- Update trigger for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to insurance_companies
CREATE TRIGGER update_insurance_companies_updated_at
  BEFORE UPDATE ON public.insurance_companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to configuration
CREATE TRIGGER update_configuration_updated_at
  BEFORE UPDATE ON public.configuration
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Insert default configuration for existing companies
-- =====================================================
INSERT INTO public.configuration (company_id, config_key, config_value)
SELECT 
  id as company_id,
  'payment_modes',
  '["monthly", "quarterly", "semi-annual", "annual"]'::jsonb
FROM public.companies
ON CONFLICT (company_id, config_key) DO NOTHING;

INSERT INTO public.configuration (company_id, config_key, config_value)
SELECT 
  id as company_id,
  'policy_types',
  '["auto", "home", "life", "health", "business", "other"]'::jsonb
FROM public.companies
ON CONFLICT (company_id, config_key) DO NOTHING;

INSERT INTO public.configuration (company_id, config_key, config_value)
SELECT 
  id as company_id,
  'alert_settings',
  '{"default_alert_days": 30}'::jsonb
FROM public.companies
ON CONFLICT (company_id, config_key) DO NOTHING;

-- =====================================================
-- Add insurer field to policies table if not exists
-- =====================================================
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'policies' AND column_name = 'insurer'
  ) THEN
    ALTER TABLE public.policies ADD COLUMN insurer VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'policies' AND column_name = 'vehicle_brand'
  ) THEN
    ALTER TABLE public.policies ADD COLUMN vehicle_brand VARCHAR(100);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'policies' AND column_name = 'vehicle_model'
  ) THEN
    ALTER TABLE public.policies ADD COLUMN vehicle_model VARCHAR(100);
  END IF;
END $$;

-- Add comment
COMMENT ON TABLE public.insurance_companies IS 'Stores insurance companies configured by each company';
COMMENT ON TABLE public.configuration IS 'Stores company-specific configuration as JSON';

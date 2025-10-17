-- Migration: Create company_config table
-- Description: Normalized configuration table with one row per company
-- Date: 2025-01-17

-- Drop old configuration table (if exists)
DROP TABLE IF EXISTS public.configuration CASCADE;
DROP TABLE IF EXISTS public.client_config CASCADE;

-- Create company_config table
CREATE TABLE IF NOT EXISTS public.company_config (
  company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,

  -- Simple configuration values
  currency VARCHAR(10) DEFAULT 'ARS',
  date_format VARCHAR(50) DEFAULT 'DD/MM/YYYY',
  timezone VARCHAR(100) DEFAULT 'America/Argentina/Buenos_Aires',
  default_alert_days INTEGER DEFAULT 30,

  -- Complex configuration arrays (JSONB)
  -- Structure: [{"key": "auto", "value": "Auto", "active": true}, ...]
  payment_modes JSONB DEFAULT '[
    {"key": "monthly", "value": "Mensual", "active": true},
    {"key": "quarterly", "value": "Trimestral", "active": true},
    {"key": "semi_annual", "value": "Semestral", "active": true},
    {"key": "annual", "value": "Anual", "active": true}
  ]'::jsonb,

  policy_types JSONB DEFAULT '[
    {"key": "auto", "value": "Auto", "active": true},
    {"key": "home", "value": "Hogar", "active": true},
    {"key": "life", "value": "Vida", "active": true},
    {"key": "health", "value": "Salud", "active": true},
    {"key": "business", "value": "Comercio", "active": true},
    {"key": "other", "value": "Otro", "active": true}
  ]'::jsonb,

  followup_types JSONB DEFAULT '[
    {"key": "call", "value": "Llamada", "active": true},
    {"key": "email", "value": "Email", "active": true},
    {"key": "meeting", "value": "Reuni\u00f3n", "active": true},
    {"key": "renewal", "value": "Renovaci\u00f3n", "active": true},
    {"key": "claim", "value": "Siniestro", "active": true}
  ]'::jsonb,

  -- Additional configuration objects
  alert_settings JSONB DEFAULT '{
    "days_before_expiry": 30,
    "days_critical": 7,
    "notify_on_create": true
  }'::jsonb,

  email_settings JSONB DEFAULT NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES public.users(id)
);

-- Add comment to table
COMMENT ON TABLE public.company_config IS 'Normalized configuration table - one row per company with all settings';

-- Add comments to columns
COMMENT ON COLUMN public.company_config.payment_modes IS 'Array of payment mode options with key (immutable), value (label), and active status';
COMMENT ON COLUMN public.company_config.policy_types IS 'Array of policy type options with key (immutable), value (label), and active status';
COMMENT ON COLUMN public.company_config.followup_types IS 'Array of followup type options with key (immutable), value (label), and active status';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_company_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER company_config_updated_at
  BEFORE UPDATE ON public.company_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_company_config_updated_at();

-- Enable RLS
ALTER TABLE public.company_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their company's configuration
CREATE POLICY "Users can view their company config"
  ON public.company_config
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.users WHERE id = auth.uid()
    )
  );

-- Only admins can update configuration
CREATE POLICY "Admins can update company config"
  ON public.company_config
  FOR UPDATE
  USING (
    company_id IN (
      SELECT company_id FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can insert configuration
CREATE POLICY "Admins can insert company config"
  ON public.company_config
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT company_id FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create default configuration for all existing companies
INSERT INTO public.company_config (company_id)
SELECT id FROM public.companies
WHERE NOT EXISTS (
  SELECT 1 FROM public.company_config WHERE company_id = companies.id
)
ON CONFLICT (company_id) DO NOTHING;

-- Grant permissions
GRANT SELECT ON public.company_config TO authenticated;
GRANT INSERT, UPDATE ON public.company_config TO authenticated;

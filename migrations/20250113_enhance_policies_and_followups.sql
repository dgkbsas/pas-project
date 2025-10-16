-- Migration: Enhance policies table and add policy_followups
-- Created: 2025-01-13
-- Description: Add new fields to policies (insurer_id, review_date, financial fields),
--              create policy_followups table, and seed default configurations

-- =====================================================
-- PHASE 1: Enhance policies table
-- =====================================================

-- Add new columns to policies table
DO $$ 
BEGIN
  -- insurer_id: reference to insurance_companies
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'policies' 
    AND column_name = 'insurer_id'
  ) THEN
    ALTER TABLE public.policies 
    ADD COLUMN insurer_id UUID NULL 
    REFERENCES public.insurance_companies(id) ON DELETE SET NULL;
  END IF;

  -- review_date: for creating review alerts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'policies' 
    AND column_name = 'review_date'
  ) THEN
    ALTER TABLE public.policies ADD COLUMN review_date DATE NULL;
  END IF;

  -- insured_sum: suma asegurada
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'policies' 
    AND column_name = 'insured_sum'
  ) THEN
    ALTER TABLE public.policies ADD COLUMN insured_sum DECIMAL(15,2) NULL;
  END IF;

  -- accessories: accesorios
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'policies' 
    AND column_name = 'accessories'
  ) THEN
    ALTER TABLE public.policies ADD COLUMN accessories TEXT NULL;
  END IF;

  -- premium: premio
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'policies' 
    AND column_name = 'premium'
  ) THEN
    ALTER TABLE public.policies ADD COLUMN premium DECIMAL(15,2) NULL;
  END IF;

  -- endorsement: endoso
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'policies' 
    AND column_name = 'endorsement'
  ) THEN
    ALTER TABLE public.policies ADD COLUMN endorsement TEXT NULL;
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_policies_insurer_id 
  ON public.policies(insurer_id);

CREATE INDEX IF NOT EXISTS idx_policies_review_date 
  ON public.policies(review_date);

-- Add column comments for documentation
COMMENT ON COLUMN public.policies.insurer_id IS 'Reference to insurance company';
COMMENT ON COLUMN public.policies.review_date IS 'Date for review alert, typically before expiry';
COMMENT ON COLUMN public.policies.insured_sum IS 'Insured sum amount (suma asegurada)';
COMMENT ON COLUMN public.policies.accessories IS 'Policy accessories description';
COMMENT ON COLUMN public.policies.premium IS 'Policy premium amount (premio)';
COMMENT ON COLUMN public.policies.endorsement IS 'Policy endorsement details (endoso)';

-- =====================================================
-- PHASE 2: Create policy_followups table
-- =====================================================

CREATE TABLE IF NOT EXISTS public.policy_followups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  
  -- Followup information
  followup_type VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  description TEXT NULL,
  status VARCHAR(50) NULL,
  
  -- Metadata
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_policy_followups_policy_id 
  ON public.policy_followups(policy_id);

CREATE INDEX IF NOT EXISTS idx_policy_followups_date 
  ON public.policy_followups(date);

CREATE INDEX IF NOT EXISTS idx_policy_followups_created_by 
  ON public.policy_followups(created_by);

CREATE INDEX IF NOT EXISTS idx_policy_followups_followup_type 
  ON public.policy_followups(followup_type);

-- Add table comment
COMMENT ON TABLE public.policy_followups IS 'Stores followup records for policies (seguimientos)';

-- =====================================================
-- PHASE 3: Create helper function for updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for policy_followups
DROP TRIGGER IF EXISTS set_policy_followups_updated_at ON public.policy_followups;

CREATE TRIGGER set_policy_followups_updated_at
  BEFORE UPDATE ON public.policy_followups
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- =====================================================
-- PHASE 4: Enable RLS for policy_followups
-- =====================================================

ALTER TABLE public.policy_followups ENABLE ROW LEVEL SECURITY;

-- Users can view followups for policies they have access to
CREATE POLICY "Users can view policy followups"
  ON public.policy_followups
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.policies p
      INNER JOIN public.users u ON u.company_id = p.company_id
      WHERE p.id = policy_followups.policy_id 
      AND u.id = auth.uid()
    )
  );

-- Users can create followups for policies in their company
CREATE POLICY "Users can create policy followups"
  ON public.policy_followups
  FOR INSERT
  WITH CHECK (
    created_by = auth.uid() 
    AND EXISTS (
      SELECT 1 
      FROM public.policies p
      INNER JOIN public.users u ON u.company_id = p.company_id
      WHERE p.id = policy_followups.policy_id 
      AND u.id = auth.uid()
    )
  );

-- Users can update their own followups or any followup in their company (if admin)
CREATE POLICY "Users can update policy followups"
  ON public.policy_followups
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 
      FROM public.policies p
      INNER JOIN public.users u ON u.company_id = p.company_id
      WHERE p.id = policy_followups.policy_id 
      AND u.id = auth.uid()
    )
  );

-- Users can delete their own followups or any followup in their company (if admin)
CREATE POLICY "Users can delete policy followups"
  ON public.policy_followups
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 
      FROM public.policies p
      INNER JOIN public.users u ON u.company_id = p.company_id
      WHERE p.id = policy_followups.policy_id 
      AND u.id = auth.uid()
    )
  );

-- =====================================================
-- PHASE 5: Add followup_types configuration
-- =====================================================

-- Add followup_types configuration for each company
INSERT INTO public.configuration (company_id, config_key, config_value)
SELECT 
  id as company_id,
  'followup_types',
  '["Seguimiento", "Reclamo", "Siniestro", "Renovación", "Otro"]'::jsonb
FROM public.companies
ON CONFLICT (company_id, config_key) DO NOTHING;

-- =====================================================
-- PHASE 6: Add currency configuration (ARS)
-- =====================================================

-- Add default currency configuration as ARS (Pesos Argentinos)
INSERT INTO public.configuration (company_id, config_key, config_value)
SELECT 
  id as company_id,
  'currency',
  '"ARS"'::jsonb
FROM public.companies
ON CONFLICT (company_id, config_key) DO NOTHING;

-- =====================================================
-- Migration complete
-- =====================================================

-- Verify configuration table has unique constraint
-- (should already exist from previous migration, but verify)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_config_key_per_company'
  ) THEN
    ALTER TABLE public.configuration 
    ADD CONSTRAINT unique_config_key_per_company 
    UNIQUE (company_id, config_key);
  END IF;
END $$;

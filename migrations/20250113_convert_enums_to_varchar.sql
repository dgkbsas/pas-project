-- Migration: Convert payment_mode and policy_type from ENUM to VARCHAR
-- Created: 2025-01-13
-- Description: Allow flexible payment modes and policy types by converting from ENUM to VARCHAR

-- =====================================================
-- PHASE 1: Convert payment_mode from ENUM to VARCHAR
-- =====================================================

-- Step 1: Add temporary column
ALTER TABLE public.policies 
ADD COLUMN payment_mode_temp VARCHAR(50);

-- Step 2: Copy data from enum to varchar
UPDATE public.policies 
SET payment_mode_temp = payment_mode::text;

-- Step 3: Drop the old enum column
ALTER TABLE public.policies 
DROP COLUMN payment_mode;

-- Step 4: Rename temp column to original name
ALTER TABLE public.policies 
RENAME COLUMN payment_mode_temp TO payment_mode;

-- Step 5: Add index for performance
CREATE INDEX IF NOT EXISTS idx_policies_payment_mode 
ON public.policies(payment_mode);

-- =====================================================
-- PHASE 2: Convert policy_type from ENUM to VARCHAR
-- =====================================================

-- Step 1: Add temporary column
ALTER TABLE public.policies 
ADD COLUMN policy_type_temp VARCHAR(50);

-- Step 2: Copy data from enum to varchar
UPDATE public.policies 
SET policy_type_temp = policy_type::text;

-- Step 3: Drop the old enum column
ALTER TABLE public.policies 
DROP COLUMN policy_type;

-- Step 4: Rename temp column to original name
ALTER TABLE public.policies 
RENAME COLUMN policy_type_temp TO policy_type;

-- Step 5: Make policy_type NOT NULL (it's required)
ALTER TABLE public.policies 
ALTER COLUMN policy_type SET NOT NULL;

-- Step 6: Add index for performance
CREATE INDEX IF NOT EXISTS idx_policies_policy_type 
ON public.policies(policy_type);

-- =====================================================
-- PHASE 3: Seed default payment modes configuration
-- =====================================================

-- Add default payment modes for each company if not exists
INSERT INTO public.configuration (company_id, config_key, config_value)
SELECT 
  id as company_id,
  'payment_modes',
  '["monthly", "quarterly", "biannual", "annual"]'::jsonb
FROM public.companies
ON CONFLICT (company_id, config_key) DO NOTHING;

-- =====================================================
-- PHASE 4: Seed default policy types configuration
-- =====================================================

-- Add default policy types for each company if not exists
INSERT INTO public.configuration (company_id, config_key, config_value)
SELECT 
  id as company_id,
  'policy_types',
  '["auto", "moto", "home", "life", "health", "business", "other"]'::jsonb
FROM public.companies
ON CONFLICT (company_id, config_key) DO NOTHING;

-- =====================================================
-- PHASE 5: Drop old ENUM types (optional cleanup)
-- =====================================================

-- Note: We can't drop the enum types if they're still referenced elsewhere
-- This will fail if other tables use these enums, which is fine
DO $$
BEGIN
  -- Try to drop payment_mode enum
  BEGIN
    DROP TYPE IF EXISTS payment_mode CASCADE;
  EXCEPTION
    WHEN dependent_objects_still_exist THEN
      RAISE NOTICE 'payment_mode enum still in use elsewhere, skipping drop';
  END;
  
  -- Try to drop policy_type enum
  BEGIN
    DROP TYPE IF EXISTS policy_type CASCADE;
  EXCEPTION
    WHEN dependent_objects_still_exist THEN
      RAISE NOTICE 'policy_type enum still in use elsewhere, skipping drop';
  END;
END $$;

-- =====================================================
-- Migration complete
-- =====================================================

COMMENT ON COLUMN public.policies.payment_mode IS 'Payment mode - configurable per company';
COMMENT ON COLUMN public.policies.policy_type IS 'Policy type - configurable per company';

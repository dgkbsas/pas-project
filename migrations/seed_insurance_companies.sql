-- Seed Insurance Companies for your company
-- This will add common insurance companies to your account

-- First, let's get your company_id from your user
-- Replace 'your-email@example.com' with your actual email
DO $$
DECLARE
  v_company_id UUID;
BEGIN
  -- Get company_id from users table (adjust email as needed)
  SELECT company_id INTO v_company_id
  FROM public.users
  WHERE email = 'your-email@example.com' -- CHANGE THIS TO YOUR EMAIL
  LIMIT 1;

  -- If company_id found, insert insurance companies
  IF v_company_id IS NOT NULL THEN
    INSERT INTO public.insurance_companies (company_id, name, code, active, created_at, updated_at)
    VALUES
      (v_company_id, 'Allianz Argentina', 'ALLIANZ', true, NOW(), NOW()),
      (v_company_id, 'Zurich Argentina', 'ZURICH', true, NOW(), NOW()),
      (v_company_id, 'Federación Patronal', 'FEDPAT', true, NOW(), NOW()),
      (v_company_id, 'La Caja Seguros', 'LACAJA', true, NOW(), NOW()),
      (v_company_id, 'Sancor Seguros', 'SANCOR', true, NOW(), NOW()),
      (v_company_id, 'Mercantil Andina', 'MERCANDINA', true, NOW(), NOW()),
      (v_company_id, 'Río Uruguay Seguros', 'RIOURUGUAY', true, NOW(), NOW()),
      (v_company_id, 'San Cristóbal Seguros', 'SANCRIS', true, NOW(), NOW()),
      (v_company_id, 'Galeno Seguros', 'GALENO', true, NOW(), NOW()),
      (v_company_id, 'Provincia Seguros', 'PROVINCIA', true, NOW(), NOW())
    ON CONFLICT (company_id, name) DO NOTHING;

    RAISE NOTICE 'Insurance companies added successfully for company_id: %', v_company_id;
  ELSE
    RAISE EXCEPTION 'User not found with that email. Please update the email in the script.';
  END IF;
END $$;

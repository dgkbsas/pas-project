-- Simple migration: Copy address to street as fallback
-- You can manually clean up the data later if needed

-- Add the new columns
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS street_number TEXT;

-- Option 1: Simple copy - just copy the entire address to street
-- This is safe and you can manually edit later
UPDATE clients
SET street = address
WHERE address IS NOT NULL 
  AND address != ''
  AND (street IS NULL OR street = '');

-- Option 2: Try to extract number from end of address
-- Uncomment if you want to try automatic parsing:
/*
UPDATE clients
SET 
  street = TRIM(REGEXP_REPLACE(address, '\s+\d+.*$', '')),
  street_number = TRIM(SUBSTRING(address FROM '\d+'))
WHERE address IS NOT NULL 
  AND address != ''
  AND (street IS NULL OR street = '');
*/

-- Check results
SELECT 
  id,
  address as original_address,
  street,
  street_number,
  city
FROM clients
WHERE address IS NOT NULL
LIMIT 10;

-- Migrate existing address data to street and street_number fields
-- This script attempts to parse the address field and split it into components

-- First, add the new columns if they don't exist
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS street_number TEXT;

-- Update street and street_number from existing address data
-- This assumes addresses are in format like "Calle Name 1234" or "Street Name 123"
UPDATE clients
SET 
  street = CASE 
    WHEN address IS NOT NULL AND address != '' THEN
      -- Extract everything except the last word (assumed to be the number)
      TRIM(REGEXP_REPLACE(address, '\s+\d+\s*$', ''))
    ELSE NULL
  END,
  street_number = CASE 
    WHEN address IS NOT NULL AND address != '' THEN
      -- Extract the last numeric sequence
      TRIM(REGEXP_REPLACE(address, '^.*\s+(\d+)\s*$', '\1'))
    ELSE NULL
  END
WHERE address IS NOT NULL 
  AND address != ''
  AND (street IS NULL OR street = '')
  AND (street_number IS NULL OR street_number = '');

-- Log the migration results
DO $$
DECLARE
  updated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO updated_count
  FROM clients
  WHERE address IS NOT NULL 
    AND address != ''
    AND street IS NOT NULL;
  
  RAISE NOTICE 'Migration completed. Updated % records.', updated_count;
END $$;

-- Add comments
COMMENT ON COLUMN clients.street IS 'Street name (migrated from address)';
COMMENT ON COLUMN clients.street_number IS 'Street number (migrated from address)';

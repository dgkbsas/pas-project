-- Add missing address fields to clients table
-- Migration: Add street and street_number fields
-- Note: floor, apartment, and phone_landline already exist

ALTER TABLE clients
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS street_number TEXT;

-- Add comments for documentation
COMMENT ON COLUMN clients.street IS 'Street name';
COMMENT ON COLUMN clients.street_number IS 'Street number';

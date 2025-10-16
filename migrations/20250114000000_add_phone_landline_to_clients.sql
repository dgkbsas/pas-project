-- Add phone_landline column to clients table
-- This separates mobile/cellular phone from landline phone

ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS phone_landline VARCHAR(20);

COMMENT ON COLUMN public.clients.phone_landline IS 'Landline/fixed phone number';
COMMENT ON COLUMN public.clients.phone IS 'Mobile/cellular phone number';

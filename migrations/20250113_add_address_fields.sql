-- Migration: Add floor and apartment fields to clients
-- Created: 2025-01-13
-- Description: Add floor and apartment fields for better address management

-- Add floor and apartment fields
DO $$ 
BEGIN
  -- floor: piso
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'clients' 
    AND column_name = 'floor'
  ) THEN
    ALTER TABLE public.clients ADD COLUMN floor VARCHAR(10) NULL;
  END IF;

  -- apartment: departamento
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'clients' 
    AND column_name = 'apartment'
  ) THEN
    ALTER TABLE public.clients ADD COLUMN apartment VARCHAR(10) NULL;
  END IF;
END $$;

-- Add column comments for documentation
COMMENT ON COLUMN public.clients.floor IS 'Floor number (Piso)';
COMMENT ON COLUMN public.clients.apartment IS 'Apartment number (Departamento)';

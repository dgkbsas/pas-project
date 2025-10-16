-- Agregar campo active a la tabla companies
-- Ejecutar este script en Supabase Dashboard > SQL Editor

ALTER TABLE companies
  ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Actualizar registros existentes para que tengan active = true por defecto
UPDATE companies SET active = true WHERE active IS NULL;

-- Verificar que la columna se agregó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'companies'
  AND table_schema = 'public'
  AND column_name = 'active';

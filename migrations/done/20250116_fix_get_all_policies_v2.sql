-- Corregir función get_all_policies
-- Primero eliminar la función existente

DROP FUNCTION IF EXISTS public.get_all_policies();

-- Crear con tipo de retorno simplificado (sin las columnas que causan error)
CREATE OR REPLACE FUNCTION public.get_all_policies()
RETURNS TABLE(
  table_name text,
  policy_name text,
  command text,
  roles text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.tablename::text,
    p.policyname::text,
    p.cmd::text,
    p.roles::text[]
  FROM pg_policies p
  WHERE p.schemaname = 'public'
  ORDER BY p.tablename, p.policyname;
END;
$$;

-- Dar permisos
GRANT EXECUTE ON FUNCTION public.get_all_policies() TO authenticated;

-- Verificar que funciona
SELECT * FROM public.get_all_policies() LIMIT 5;

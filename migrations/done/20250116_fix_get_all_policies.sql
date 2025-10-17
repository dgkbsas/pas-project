-- Corregir función get_all_policies (problema con pg_get_expr)

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

GRANT EXECUTE ON FUNCTION public.get_all_policies() TO authenticated;

-- Verificar
SELECT * FROM public.get_all_policies() LIMIT 5;

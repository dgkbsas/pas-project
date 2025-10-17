-- =====================================================
-- MIGRACIÓN: Funciones RPC para Administración
-- Fecha: 2025-01-16
-- =====================================================

-- FUNCIÓN 1: Ejecutar SQL Arbitrario (solo admins)
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  is_admin boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  ) INTO is_admin;

  IF NOT is_admin THEN
    RAISE EXCEPTION 'Solo los administradores pueden ejecutar SQL';
  END IF;

  EXECUTE format('SELECT jsonb_agg(row_to_json(t)) FROM (%s) t', sql) INTO result;
  RETURN COALESCE(result, '[]'::jsonb);
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', SQLERRM, 'detail', SQLSTATE);
END;
$$;

-- FUNCIÓN 2: Ver Todas las Tablas
CREATE OR REPLACE FUNCTION public.get_all_tables()
RETURNS TABLE(
  table_name text,
  rls_enabled boolean,
  num_rows bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tablename::text,
    t.rowsecurity,
    0::bigint as num_rows
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  ORDER BY t.tablename;
END;
$$;

-- FUNCIÓN 3: Ver Todas las Políticas RLS
CREATE OR REPLACE FUNCTION public.get_all_policies()
RETURNS TABLE(
  table_name text,
  policy_name text,
  command text,
  roles text[],
  using_expression text,
  with_check_expression text
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
    p.roles::text[],
    pg_get_expr(p.qual, p.tablename::regclass)::text as using_expr,
    pg_get_expr(p.with_check, p.tablename::regclass)::text as with_check_expr
  FROM pg_policies p
  WHERE p.schemaname = 'public'
  ORDER BY p.tablename, p.policyname;
END;
$$;

-- FUNCIÓN 4: Ver Esquema de una Tabla
CREATE OR REPLACE FUNCTION public.get_table_schema(p_table_name text)
RETURNS TABLE(
  column_name text,
  data_type text,
  is_nullable text,
  column_default text,
  is_primary_key boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text,
    EXISTS (
      SELECT 1
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
        AND tc.table_name = p_table_name
        AND kcu.column_name = c.column_name
    ) as is_primary_key
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = p_table_name
  ORDER BY c.ordinal_position;
END;
$$;

-- FUNCIÓN 5: Contar Registros en Tablas
CREATE OR REPLACE FUNCTION public.get_table_counts()
RETURNS TABLE(
  table_name text,
  row_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  t record;
  query text;
  count_result bigint;
BEGIN
  FOR t IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  LOOP
    query := format('SELECT COUNT(*) FROM public.%I', t.tablename);
    EXECUTE query INTO count_result;
    table_name := t.tablename;
    row_count := count_result;
    RETURN NEXT;
  END LOOP;
END;
$$;

-- FUNCIÓN 6: Ver Estado Completo de RLS
CREATE OR REPLACE FUNCTION public.get_rls_status()
RETURNS TABLE(
  table_name text,
  rls_enabled boolean,
  num_policies integer,
  has_select boolean,
  has_insert boolean,
  has_update boolean,
  has_delete boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.tablename::text,
    t.rowsecurity,
    (
      SELECT COUNT(*)::integer
      FROM pg_policies p
      WHERE p.schemaname = 'public'
      AND p.tablename = t.tablename
    ) as num_policies,
    EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = 'public'
      AND p.tablename = t.tablename
      AND p.cmd = 'SELECT'
    ) as has_select,
    EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = 'public'
      AND p.tablename = t.tablename
      AND p.cmd = 'INSERT'
    ) as has_insert,
    EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = 'public'
      AND p.tablename = t.tablename
      AND p.cmd = 'UPDATE'
    ) as has_update,
    EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = 'public'
      AND p.tablename = t.tablename
      AND p.cmd = 'DELETE'
    ) as has_delete
  FROM pg_tables t
  WHERE t.schemaname = 'public'
  ORDER BY t.tablename;
END;
$$;

-- FUNCIÓN 7: Ver Funciones del Sistema
CREATE OR REPLACE FUNCTION public.get_functions()
RETURNS TABLE(
  function_name text,
  arguments text,
  return_type text,
  language text,
  volatility text
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.proname::text,
    pg_get_function_identity_arguments(p.oid)::text,
    pg_get_function_result(p.oid)::text,
    l.lanname::text,
    CASE
      WHEN p.provolatile = 'i' THEN 'IMMUTABLE'
      WHEN p.provolatile = 's' THEN 'STABLE'
      WHEN p.provolatile = 'v' THEN 'VOLATILE'
    END::text as volatility
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  JOIN pg_language l ON p.prolang = l.oid
  WHERE n.nspname IN ('public', 'auth')
    AND p.proname NOT LIKE 'pg_%'
  ORDER BY n.nspname, p.proname;
END;
$$;

-- PERMISOS
GRANT EXECUTE ON FUNCTION public.get_all_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_all_policies() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_table_schema(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_table_counts() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_rls_status() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_functions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO authenticated;

-- Verificación
SELECT
  proname as function_name,
  pg_get_function_identity_arguments(oid) as arguments
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN (
    'exec_sql',
    'get_all_tables',
    'get_all_policies',
    'get_table_schema',
    'get_table_counts',
    'get_rls_status',
    'get_functions'
  )
ORDER BY proname;

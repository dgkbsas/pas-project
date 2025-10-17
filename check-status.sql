-- Verificar funciones existentes
SELECT 'FUNCIONES:' as check_type, proname as name FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
AND proname IN ('exec_sql', 'get_all_tables', 'get_all_policies', 'get_table_schema',
                'get_table_counts', 'get_rls_status', 'get_functions', 'get_user_company_id')
ORDER BY proname;

-- Verificar estado de RLS
SELECT 'RLS_STATUS:' as check_type, tablename as name, rowsecurity as enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('companies', 'users', 'clients', 'policies', 'policy_alerts',
                  'policy_followups', 'insurance_companies', 'configuration')
ORDER BY tablename;

-- Contar políticas
SELECT 'POLICIES_COUNT:' as check_type, tablename as name, COUNT(*) as count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

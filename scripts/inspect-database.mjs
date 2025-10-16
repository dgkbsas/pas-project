#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  process.exit(1);
}

// Usar SERVICE_ROLE_KEY para bypass RLS y ver todo
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(query) {
  const { data, error } = await supabase.rpc('exec_sql', { sql: query });
  return { data, error };
}

async function main() {
  console.log('🔍 Inspeccionando base de datos de Supabase...\n');

  // Primero, crear función temporal para ejecutar SQL si no existe
  console.log('⚙️  Verificando funciones auxiliares...\n');

  const createExecSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      result jsonb;
    BEGIN
      EXECUTE 'SELECT jsonb_agg(row_to_json(t)) FROM (' || sql || ') t' INTO result;
      RETURN result;
    END;
    $$;
  `;

  // Intentar crear la función (puede fallar si ya existe o no hay permisos)
  // Esto lo haremos manualmente después

  // 1. Listar todas las tablas
  console.log('📊 TABLAS Y ESTADO DE RLS:');
  console.log('='.repeat(80));

  const tablesQuery = `
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;

  const { data: tablesData, error: tablesError } = await supabase.rpc('exec_sql', { sql: tablesQuery });

  if (tablesError) {
    console.log('⚠️  No se pudo acceder directamente a pg_tables');
    console.log('   Probando con tablas conocidas...\n');

    // Intentar acceder a cada tabla conocida
    const knownTables = ['companies', 'users', 'clients', 'policies',
                         'insurance_companies', 'policy_followups', 'policy_alerts', 'configuration'];

    for (const table of knownTables) {
      try {
        const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (!error) {
          console.log(`  ✅ ${table.padEnd(30)} → existe (RLS estado desconocido)`);
        }
      } catch (e) {
        console.log(`  ❌ ${table.padEnd(30)} → no accesible`);
      }
    }
  } else if (tablesData) {
    tablesData.forEach(t => {
      const rlsStatus = t.rowsecurity ? '✅ HABILITADO' : '❌ DESHABILITADO';
      console.log(`  ${t.tablename.padEnd(30)} → RLS ${rlsStatus}`);
    });
  }

  // 2. Listar todas las políticas RLS
  console.log('\n🔒 POLÍTICAS RLS:');
  console.log('='.repeat(80));

  const policiesQuery = `
    SELECT schemaname, tablename, policyname, cmd, roles
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname
  `;

  const { data: policiesData, error: policiesError } = await supabase.rpc('exec_sql', { sql: policiesQuery });

  if (policiesError) {
    console.log('  ⚠️  No se pudo acceder a políticas RLS directamente');
    console.log('  ℹ️  Ejecutar query manualmente en Supabase SQL Editor:');
    console.log(`     ${policiesQuery}`);
  } else if (!policiesData || policiesData.length === 0) {
    console.log('  ⚠️  No se encontraron políticas RLS');
  } else {
    let currentTable = '';
    policiesData.forEach(p => {
      if (p.tablename !== currentTable) {
        currentTable = p.tablename;
        console.log(`\n  📋 Tabla: ${currentTable}`);
      }
      console.log(`     → [${p.cmd}] ${p.policyname}`);
    });
  }

  // 3. Verificar función helper
  console.log('\n🔧 FUNCIONES HELPER:');
  console.log('='.repeat(80));

  const functionsQuery = `
    SELECT proname, pronargs
    FROM pg_proc
    WHERE proname LIKE '%user_company_id%'
  `;

  const { data: functionsData, error: funcError } = await supabase.rpc('exec_sql', { sql: functionsQuery });

  if (funcError) {
    console.log('  ⚠️  No se pudo verificar funciones');
  } else if (!functionsData || functionsData.length === 0) {
    console.log('  ⚠️  Función auth.user_company_id() NO ENCONTRADA');
  } else {
    console.log('  ✅ Función user_company_id() encontrada');
  }

  // 4. Contar registros en tablas principales
  console.log('\n📈 CONTEO DE REGISTROS:');
  console.log('='.repeat(80));

  const mainTables = ['companies', 'users', 'clients', 'policies', 'insurance_companies',
                      'policy_followups', 'policy_alerts', 'configuration'];

  for (const table of mainTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ${table.padEnd(25)} → ❌ ${error.message}`);
      } else {
        console.log(`  ${table.padEnd(25)} → ${count ?? 0} registros`);
      }
    } catch (err) {
      console.log(`  ${table.padEnd(25)} → ❌ Tabla no existe`);
    }
  }

  console.log('\n✅ Inspección completada\n');
}

main().catch(console.error);

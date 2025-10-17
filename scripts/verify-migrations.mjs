#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║  🔍 VERIFICANDO ESTADO DE MIGRACIONES                         ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

async function verifyMigrations() {
  let allGood = true;

  // 1. Verificar función get_user_company_id
  console.log('1️⃣  Verificando función get_user_company_id()...');
  const { data: funcCheck1, error: funcErr1 } = await supabase
    .from('pg_proc')
    .select('proname')
    .eq('proname', 'get_user_company_id')
    .maybeSingle();

  if (funcErr1 || !funcCheck1) {
    console.log('   ❌ Función get_user_company_id() NO EXISTE');
    console.log('   📝 Debes aplicar: migrations/20250116_cleanup_rls_policies_fixed.sql\n');
    allGood = false;
  } else {
    console.log('   ✅ Función get_user_company_id() existe\n');
  }

  // 2. Verificar funciones RPC
  console.log('2️⃣  Verificando funciones RPC...');
  const rpcFunctions = ['exec_sql', 'get_all_tables', 'get_all_policies',
                        'get_table_schema', 'get_table_counts', 'get_rls_status', 'get_functions'];

  let rpcCount = 0;
  for (const funcName of rpcFunctions) {
    const { data, error } = await supabase
      .from('pg_proc')
      .select('proname')
      .eq('proname', funcName)
      .maybeSingle();

    if (!error && data) {
      rpcCount++;
    }
  }

  if (rpcCount === 0) {
    console.log('   ❌ Funciones RPC NO EXISTEN');
    console.log('   📝 Debes aplicar: migrations/20250116_create_admin_rpc_functions.sql\n');
    allGood = false;
  } else if (rpcCount < 7) {
    console.log(`   ⚠️  Solo ${rpcCount}/7 funciones RPC existen`);
    console.log('   📝 Puede que la migración se aplicó parcialmente\n');
    allGood = false;
  } else {
    console.log('   ✅ Todas las funciones RPC existen (7/7)\n');
  }

  // 3. Verificar RLS habilitado
  console.log('3️⃣  Verificando estado de RLS...');
  const tables = ['companies', 'users', 'clients', 'policies', 'policy_alerts',
                  'policy_followups', 'insurance_companies', 'configuration'];

  const { data: rlsData, error: rlsErr } = await supabase
    .from('pg_tables')
    .select('tablename, rowsecurity')
    .eq('schemaname', 'public')
    .in('tablename', tables);

  if (rlsErr) {
    console.log('   ❌ Error al verificar RLS:', rlsErr.message);
    allGood = false;
  } else {
    const rlsDisabled = rlsData.filter(t => !t.rowsecurity);
    if (rlsDisabled.length > 0) {
      console.log('   ❌ RLS DESHABILITADO en:');
      rlsDisabled.forEach(t => console.log(`      - ${t.tablename}`));
      console.log('   📝 Debes aplicar: migrations/20250116_cleanup_rls_policies_fixed.sql\n');
      allGood = false;
    } else {
      console.log('   ✅ RLS habilitado en todas las tablas\n');
    }
  }

  // 4. Verificar políticas
  console.log('4️⃣  Verificando políticas RLS...');
  const { data: policiesData, error: policiesErr } = await supabase
    .from('pg_policies')
    .select('tablename, policyname')
    .eq('schemaname', 'public');

  if (policiesErr) {
    console.log('   ❌ Error al verificar políticas:', policiesErr.message);
    allGood = false;
  } else {
    const policyCount = policiesData.length;
    if (policyCount === 0) {
      console.log('   ❌ NO HAY POLÍTICAS RLS');
      console.log('   📝 Debes aplicar: migrations/20250116_cleanup_rls_policies_fixed.sql\n');
      allGood = false;
    } else if (policyCount < 30) {
      console.log(`   ⚠️  Solo ${policyCount} políticas (esperadas ~32)`);
      console.log('   📝 Puede que la migración se aplicó parcialmente\n');
      allGood = false;
    } else {
      console.log(`   ✅ ${policyCount} políticas RLS creadas\n`);
    }
  }

  // 5. Probar acceso a datos
  console.log('5️⃣  Probando acceso a datos...');
  const { data: clientsData, error: clientsErr } = await supabase
    .from('clients')
    .select('id')
    .limit(1);

  if (clientsErr) {
    console.log('   ❌ Error al acceder a clientes:', clientsErr.message);
    console.log('   📝 Puede ser un problema de RLS o políticas\n');
    allGood = false;
  } else {
    console.log('   ✅ Acceso a datos funciona correctamente\n');
  }

  // Resumen final
  console.log('═'.repeat(80));
  if (allGood) {
    console.log('✅ TODO CORRECTO - Migraciones aplicadas exitosamente');
  } else {
    console.log('❌ MIGRACIONES PENDIENTES - Sigue las instrucciones arriba');
  }
  console.log('═'.repeat(80));
  console.log();
}

verifyMigrations().catch(console.error);

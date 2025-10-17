#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey);

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║  🧪 PROBANDO FUNCIONES RPC DE SUPABASE                        ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

async function testRPCFunctions() {

  // 1. Ver todas las tablas
  console.log('📊 1. TODAS LAS TABLAS:');
  console.log('='.repeat(80));
  const { data: tables, error: tablesError } = await supabase
    .rpc('get_all_tables');

  if (tablesError) {
    console.error('❌ Error:', tablesError.message);
  } else {
    console.table(tables);
  }

  // 2. Ver estado de RLS
  console.log('\n🔒 2. ESTADO DE RLS:');
  console.log('='.repeat(80));
  const { data: rlsStatus, error: rlsError } = await supabase
    .rpc('get_rls_status');

  if (rlsError) {
    console.error('❌ Error:', rlsError.message);
  } else {
    console.table(rlsStatus);
  }

  // 3. Ver conteo de registros
  console.log('\n📈 3. CONTEO DE REGISTROS:');
  console.log('='.repeat(80));
  const { data: counts, error: countsError } = await supabase
    .rpc('get_table_counts');

  if (countsError) {
    console.error('❌ Error:', countsError.message);
  } else {
    console.table(counts);
  }

  // 4. Ver políticas (primeras 10)
  console.log('\n🔐 4. POLÍTICAS RLS (primeras 10):');
  console.log('='.repeat(80));
  const { data: policies, error: policiesError } = await supabase
    .rpc('get_all_policies');

  if (policiesError) {
    console.error('❌ Error:', policiesError.message);
  } else {
    console.table(policies.slice(0, 10));
    console.log(`... ${policies.length} políticas en total`);
  }

  // 5. Ver esquema de una tabla
  console.log('\n📋 5. ESQUEMA DE LA TABLA "clients":');
  console.log('='.repeat(80));
  const { data: schema, error: schemaError } = await supabase
    .rpc('get_table_schema', { p_table_name: 'clients' });

  if (schemaError) {
    console.error('❌ Error:', schemaError.message);
  } else {
    console.table(schema);
  }

  // 6. Ver funciones del sistema
  console.log('\n⚙️  6. FUNCIONES PERSONALIZADAS:');
  console.log('='.repeat(80));
  const { data: functions, error: functionsError } = await supabase
    .rpc('get_functions');

  if (functionsError) {
    console.error('❌ Error:', functionsError.message);
  } else {
    const customFunctions = functions.filter(f =>
      f.function_name.startsWith('get_') ||
      f.function_name.startsWith('exec_')
    );
    console.table(customFunctions);
  }

  // 7. Ejecutar SQL arbitrario (ejemplo simple)
  console.log('\n🔧 7. EJECUTAR SQL ARBITRARIO:');
  console.log('='.repeat(80));
  const { data: sqlResult, error: sqlError } = await supabase
    .rpc('exec_sql', {
      sql: 'SELECT COUNT(*) as total_clients FROM clients WHERE active = true'
    });

  if (sqlError) {
    console.error('❌ Error:', sqlError.message);
  } else {
    console.log('Query: SELECT COUNT(*) as total_clients FROM clients WHERE active = true');
    console.log('Resultado:', sqlResult);
  }

  console.log('\n✅ Prueba completada\n');
}

testRPCFunctions().catch(console.error);

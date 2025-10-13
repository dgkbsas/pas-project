#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Verificando estado de la base de datos...\n');

async function checkStatus() {
  try {
    // 1. Verificar si existe la tabla clients
    console.log('1️⃣ Verificando tabla clients...');
    const { data: tableExists, error: tableError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);

    if (tableError) {
      if (tableError.message.includes('does not exist')) {
        console.log('   ❌ La tabla clients NO existe');
        console.log('   ⚠️  Necesitas ejecutar primero: supabase/schema.sql\n');
        console.log('   📝 Ve a: https://app.supabase.com/project/cnwaaqvgwndsovmbchxp/sql/new');
        console.log('   📋 Copia y pega el contenido de supabase/schema.sql');
        console.log('   ▶️  Click en "Run"\n');
        return false;
      }
      throw tableError;
    }

    console.log('   ✅ Tabla clients existe\n');

    // 2. Verificar si el campo assigned_to ya existe
    console.log('2️⃣ Verificando campo assigned_to...');
    const { data: columns, error: colError } = await supabase
      .rpc('exec_sql', {
        sql: `SELECT column_name 
              FROM information_schema.columns 
              WHERE table_name = 'clients' 
              AND column_name = 'assigned_to';`
      });

    // Si exec_sql no existe, intentamos otro método
    if (colError) {
      // Intentar consultar directamente
      const { data: testClient } = await supabase
        .from('clients')
        .select('assigned_to')
        .limit(1)
        .single();

      if (testClient && 'assigned_to' in testClient) {
        console.log('   ✅ Campo assigned_to YA EXISTE');
        console.log('   ℹ️  La migración ya fue aplicada\n');
        return 'already_migrated';
      }
    }

    if (!columns || columns.length === 0) {
      console.log('   ❌ Campo assigned_to NO existe');
      console.log('   ✅ Listo para ejecutar la migración\n');
      return 'ready';
    }

    console.log('   ✅ Campo assigned_to YA EXISTE');
    console.log('   ℹ️  La migración ya fue aplicada\n');
    return 'already_migrated';

  } catch (e) {
    console.error('❌ Error:', e.message);
    return false;
  }
}

const status = await checkStatus();

if (status === false) {
  console.log('❌ No se pudo verificar el estado de la base de datos');
  console.log('   Verifica tu conexión ejecutando:');
  console.log('   node scripts/test-supabase.mjs\n');
  process.exit(1);
} else if (status === 'already_migrated') {
  console.log('✅ La base de datos ya tiene el campo assigned_to');
  console.log('   No necesitas ejecutar la migración de nuevo\n');
  process.exit(0);
} else if (status === 'ready') {
  console.log('📋 PRÓXIMO PASO: Ejecutar la migración');
  console.log('   1. Abre: https://app.supabase.com/project/cnwaaqvgwndsovmbchxp/sql/new');
  console.log('   2. Copia el contenido de: supabase/migration-add-assigned-to.sql');
  console.log('   3. Pega en el editor SQL');
  console.log('   4. Click en "Run"\n');
  console.log('   📖 Guía completa en: MIGRATION_GUIDE.md\n');
  process.exit(0);
}

#!/usr/bin/env node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  process.exit(1);
}

// Usar SERVICE_ROLE_KEY para bypass RLS
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQLFile(filePath) {
  console.log(`\n📄 Ejecutando: ${filePath}\n`);

  const sql = readFileSync(filePath, 'utf-8');

  // Ejecutar el SQL completo
  // Nota: Supabase no soporta ejecución directa de SQL desde el cliente
  // Necesitamos ejecutar esto manualmente en el SQL Editor de Supabase

  console.log('⚠️  IMPORTANTE: Esta migración debe ejecutarse manualmente en Supabase SQL Editor\n');
  console.log('Instrucciones:');
  console.log('1. Abre tu proyecto en Supabase Dashboard');
  console.log('2. Ve a SQL Editor');
  console.log('3. Crea una nueva query');
  console.log('4. Copia y pega el contenido de:');
  console.log(`   ${filePath}`);
  console.log('5. Ejecuta la query\n');

  console.log('📋 Contenido del archivo (primeras líneas):');
  console.log('='.repeat(80));
  console.log(sql.split('\n').slice(0, 20).join('\n'));
  console.log('...\n');

  // Preguntar si ya se ejecutó
  console.log('Una vez ejecutada la migración en Supabase, presiona Enter para continuar con la verificación...');
}

async function verifyRLS() {
  console.log('\n🔍 Verificando estado de RLS...\n');

  const tables = ['companies', 'users', 'clients', 'policies',
                  'insurance_companies', 'policy_followups',
                  'policy_alerts', 'configuration'];

  console.log('📊 ESTADO DE LAS TABLAS:');
  console.log('='.repeat(80));

  for (const table of tables) {
    try {
      // Intentar acceder a la tabla con autenticación
      const { error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌ ${table.padEnd(25)} → Error: ${error.message}`);
      } else {
        console.log(`  ✅ ${table.padEnd(25)} → ${count ?? 0} registros (accesible)`);
      }
    } catch (err) {
      console.log(`  ❌ ${table.padEnd(25)} → Error inesperado`);
    }
  }

  console.log('\n✅ Verificación completada\n');
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔒 APLICACIÓN DE MIGRACIÓN: Limpieza de Políticas RLS        ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const migrationPath = join(__dirname, '..', 'migrations', '20250116_cleanup_rls_policies.sql');

  await executeSQLFile(migrationPath);

  console.log('\n⏸️  Pausado. Ejecuta la migración en Supabase SQL Editor y presiona Enter...\n');
  console.log('(Ctrl+C para cancelar)');

  // Esperar input del usuario
  process.stdin.once('data', async () => {
    await verifyRLS();
    process.exit(0);
  });
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

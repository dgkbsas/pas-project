#!/usr/bin/env node
import 'dotenv/config';
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

async function executeSQLDirect(sql) {
  const url = `${supabaseUrl}/rest/v1/rpc/exec_sql`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceRoleKey,
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ sql })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(result, null, 2));
    }

    return result;
  } catch (error) {
    throw error;
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔒 APLICANDO MIGRACIÓN: Limpieza de Políticas RLS           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  const migrationPath = join(__dirname, '..', 'migrations', '20250116_cleanup_rls_policies.sql');
  const sql = readFileSync(migrationPath, 'utf-8');

  console.log('📄 Archivo de migración cargado\n');
  console.log('⚠️  IMPORTANTE: Esta migración eliminará TODAS las políticas RLS existentes');
  console.log('    y las reemplazará con políticas limpias y optimizadas.\n');

  console.log('📋 Para aplicar esta migración:\n');
  console.log('1. Abre Supabase Dashboard: https://supabase.com/dashboard');
  console.log(`2. Selecciona tu proyecto (${supabaseUrl})`);
  console.log('3. Ve a "SQL Editor" en el menú lateral');
  console.log('4. Haz clic en "New query"');
  console.log('5. Copia y pega el contenido del archivo:');
  console.log(`   ${migrationPath}`);
  console.log('6. Haz clic en "Run" para ejecutar la migración\n');

  console.log('📝 Vista previa del archivo (primeras 50 líneas):');
  console.log('='.repeat(80));
  const lines = sql.split('\n').slice(0, 50);
  lines.forEach((line, i) => {
    console.log(`${String(i + 1).padStart(3, ' ')} │ ${line}`);
  });
  console.log('='.repeat(80));
  console.log(`... (${sql.split('\n').length} líneas en total)\n`);

  console.log('✅ Archivo listo para ser ejecutado en Supabase SQL Editor');
  console.log('\n💡 Después de ejecutar la migración, prueba tu aplicación para');
  console.log('   verificar que no haya errores 404 de acceso.\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

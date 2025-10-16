#!/usr/bin/env node
import 'dotenv/config';
import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Extraer la connection string de la URL de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Falta SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  process.exit(1);
}

// Construir la connection string de PostgreSQL
// Formato: postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ No se pudo extraer el project ref de SUPABASE_URL');
  console.error('   SUPABASE_URL debe tener el formato: https://[project-ref].supabase.co');
  process.exit(1);
}

// Necesitamos la contraseña de la base de datos
if (!process.env.DATABASE_PASSWORD) {
  console.error('❌ Falta DATABASE_PASSWORD en .env');
  console.error('   La contraseña de la base de datos se encuentra en:');
  console.error('   Supabase Dashboard → Settings → Database → Connection string');
  console.error('   Agrega esta línea a tu .env:');
  console.error('   DATABASE_PASSWORD=tu_password_aqui');
  process.exit(1);
}

const connectionString = `postgresql://postgres:${process.env.DATABASE_PASSWORD}@db.${projectRef}.supabase.co:5432/postgres`;

async function executeMigration() {
  const client = new pg.Client({ connectionString });

  try {
    console.log('🔌 Conectando a la base de datos...\n');
    await client.connect();
    console.log('✅ Conectado exitosamente\n');

    const migrationPath = join(__dirname, '..', 'migrations', '20250116_cleanup_rls_policies.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Ejecutando migración...\n');
    console.log('='.repeat(80));

    const result = await client.query(sql);

    console.log('\n✅ Migración ejecutada exitosamente\n');

    // Verificar estado de RLS
    console.log('🔍 Verificando estado de RLS...\n');

    const rlsStatus = await client.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);

    console.log('📊 ESTADO DE RLS:');
    console.log('='.repeat(80));
    rlsStatus.rows.forEach(row => {
      const status = row.rowsecurity ? '✅ HABILITADO' : '❌ DESHABILITADO';
      console.log(`  ${row.tablename.padEnd(30)} → ${status}`);
    });

    // Contar políticas
    const policiesCount = await client.query(`
      SELECT tablename, COUNT(*) as num_policies
      FROM pg_policies
      WHERE schemaname = 'public'
      GROUP BY tablename
      ORDER BY tablename
    `);

    console.log('\n🔒 POLÍTICAS CREADAS:');
    console.log('='.repeat(80));
    policiesCount.rows.forEach(row => {
      console.log(`  ${row.tablename.padEnd(30)} → ${row.num_policies} políticas`);
    });

    console.log('\n✅ Migración completada y verificada exitosamente\n');

  } catch (error) {
    console.error('\n❌ Error al ejecutar la migración:');
    console.error(error.message);
    throw error;
  } finally {
    await client.end();
    console.log('🔌 Conexión cerrada\n');
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  🔒 EJECUTANDO MIGRACIÓN: Limpieza de Políticas RLS          ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await executeMigration();
  } catch (error) {
    console.error('❌ Falló la ejecución de la migración');
    process.exit(1);
  }
}

main();

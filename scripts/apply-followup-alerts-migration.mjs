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

    const migrationPath = join(__dirname, '..', 'migrations', '20250116_add_followup_alerts.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    console.log('📄 Ejecutando migración...\n');
    console.log('='.repeat(80));

    const result = await client.query(sql);

    console.log('\n✅ Migración ejecutada exitosamente\n');

    // Verificar que se agregó la columna
    console.log('🔍 Verificando columna alert_date...\n');

    const columnCheck = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'policy_followups'
      AND column_name = 'alert_date'
    `);

    if (columnCheck.rows.length > 0) {
      console.log('📊 COLUMNA AGREGADA:');
      console.log('='.repeat(80));
      const col = columnCheck.rows[0];
      console.log(`  Nombre: ${col.column_name}`);
      console.log(`  Tipo: ${col.data_type}`);
      console.log(`  Nullable: ${col.is_nullable}`);
      console.log('\n✅ La columna alert_date fue agregada exitosamente');
    } else {
      console.error('❌ No se encontró la columna alert_date');
    }

    // Verificar índice
    const indexCheck = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND tablename = 'policy_followups'
      AND indexname = 'idx_policy_followups_alert_date'
    `);

    if (indexCheck.rows.length > 0) {
      console.log('\n🔍 ÍNDICE CREADO:');
      console.log('='.repeat(80));
      console.log(`  ${indexCheck.rows[0].indexname}`);
      console.log(`  ${indexCheck.rows[0].indexdef}`);
    }

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
  console.log('║  🔔 EJECUTANDO MIGRACIÓN: Alertas de Seguimientos            ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    await executeMigration();
  } catch (error) {
    console.error('❌ Falló la ejecución de la migración');
    process.exit(1);
  }
}

main();

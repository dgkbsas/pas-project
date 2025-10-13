#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Consultando estructura de la base de datos...\n');

async function listTables() {
  try {
    // Método 1: Intentar obtener todas las tablas usando una consulta REST a pg_catalog
    const { data: schemaData, error: schemaError } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (!schemaError && schemaData && schemaData.length > 0) {
      console.log(`📋 Tablas encontradas (${schemaData.length}):\n`);
      schemaData.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.tablename}`);
      });
      return;
    }

    // Método 2: Intentar listar tablas conocidas de auth/storage
    console.log('⚠️  No se encontraron tablas en el esquema público.\n');
    console.log('📊 Información de tu base de datos:');
    console.log(`   URL: ${process.env.SUPABASE_URL}`);
    console.log(`   Proyecto: cnwaaqvgwndsovmbchxp\n`);
    
    console.log('💡 Tu base de datos está vacía. Para empezar:');
    console.log('\n1️⃣  Ve al editor SQL de Supabase:');
    console.log('   https://app.supabase.com/project/cnwaaqvgwndsovmbchxp/sql/new');
    console.log('\n2️⃣  Crea una tabla de ejemplo:');
    console.log(`
   CREATE TABLE todos (
     id BIGSERIAL PRIMARY KEY,
     task TEXT NOT NULL,
     is_complete BOOLEAN DEFAULT false,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   
   -- Insertar datos de ejemplo
   INSERT INTO todos (task) 
   VALUES 
     ('Configurar Supabase'),
     ('Integrar con Claude Code'),
     ('Crear mi primera app');
   
   -- Habilitar RLS (Row Level Security)
   ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
   
   -- Política para permitir lectura pública
   CREATE POLICY "Permitir lectura pública" 
   ON todos FOR SELECT 
   USING (true);
`);
    
    console.log('\n3️⃣  Después ejecuta:');
    console.log('   node scripts/list-tables.mjs\n');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.log('\n🔧 Verifica tu conexión ejecutando:');
    console.log('   node scripts/test-supabase.mjs');
  }
}

listTables();

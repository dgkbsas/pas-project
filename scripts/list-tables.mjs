#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Listando tablas en tu base de datos de Supabase...\n');

try {
  // Consultar el esquema de información para obtener las tablas
  const { data, error } = await supabase
    .rpc('exec_sql', { 
      sql: `SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name;`
    })
    .single();

  if (error) {
    // Si no existe la función exec_sql, intentamos otra forma
    console.log('⚠️  Método directo no disponible, intentando método alternativo...\n');
    
    // Intentar con una consulta directa a las tablas del sistema
    const { data: tables, error: err2 } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');
    
    if (err2) {
      console.error('❌ Error al obtener tablas:', err2.message);
      console.log('\n💡 Esto puede indicar que:');
      console.log('   1. No hay tablas públicas en tu base de datos');
      console.log('   2. Las tablas están protegidas por RLS');
      console.log('   3. Necesitas crear tablas primero');
      process.exit(1);
    }
    
    if (!tables || tables.length === 0) {
      console.log('📋 No se encontraron tablas en el esquema público.');
      console.log('\n💡 Para crear una tabla, ve a tu dashboard de Supabase:');
      console.log('   https://app.supabase.com/project/cnwaaqvgwndsovmbchxp/editor');
      process.exit(0);
    }
    
    console.log(`📋 Tablas encontradas (${tables.length}):\n`);
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table.table_name}`);
    });
    
  } else {
    if (!data || data.length === 0) {
      console.log('📋 No se encontraron tablas en el esquema público.');
      console.log('\n💡 Para crear una tabla, ve a tu dashboard de Supabase:');
      console.log('   https://app.supabase.com/project/cnwaaqvgwndsovmbchxp/editor');
    } else {
      console.log(`📋 Tablas encontradas (${data.length}):\n`);
      data.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.table_name}`);
      });
    }
  }
  
} catch (e) {
  console.error('❌ Error inesperado:', e.message);
  console.log('\n🔧 Verifica tu conexión ejecutando:');
  console.log('   node scripts/test-supabase.mjs');
  process.exit(1);
}

console.log('\n✅ Consulta completada');

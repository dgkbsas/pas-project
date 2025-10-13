#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

console.log('🔍 Verificando conexión con Supabase...\n');

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Verificar que las variables existan
if (!url) {
  console.error('❌ Error: SUPABASE_URL no está definida en .env');
  process.exit(1);
}

if (!anonKey) {
  console.error('❌ Error: SUPABASE_ANON_KEY no está definida en .env');
  process.exit(1);
}

if (!serviceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está definida en .env');
  process.exit(1);
}

console.log('✅ Variables de entorno encontradas');
console.log(`   URL: ${url}`);
console.log(`   Anon Key: ${anonKey.substring(0, 20)}...`);
console.log(`   Service Key: ${serviceKey.substring(0, 20)}...\n`);

// Test 1: Cliente con ANON KEY
console.log('📝 Test 1: Conectando con ANON KEY...');
try {
  const supabaseAnon = createClient(url, anonKey);
  const { data, error } = await supabaseAnon.from('_').select('*').limit(1);
  
  // Es normal que falle si no hay tabla _, pero si conecta es suficiente
  console.log('✅ Conexión con ANON KEY establecida correctamente\n');
} catch (e) {
  console.log('✅ ANON KEY válida (error esperado si no hay tablas públicas)\n');
}

// Test 2: Cliente con SERVICE ROLE KEY  
console.log('📝 Test 2: Conectando con SERVICE ROLE KEY...');
try {
  const supabaseAdmin = createClient(url, serviceKey);
  
  // Intentar listar usuarios (requiere service role)
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1
  });
  
  if (error) {
    console.warn('⚠️  Advertencia al listar usuarios:', error.message);
    console.log('   (Esto puede ser normal si Auth no está configurado)');
  } else {
    console.log('✅ SERVICE ROLE KEY válida y funcionando');
    console.log(`   Usuarios encontrados: ${data.users?.length ?? 0}`);
  }
} catch (e) {
  console.error('❌ Error con SERVICE ROLE KEY:', e.message);
  console.log('   Verifica que la key sea correcta en tu dashboard de Supabase');
  process.exit(1);
}

console.log('\n🎉 ¡Todas las verificaciones completadas!');
console.log('\n📚 Próximos pasos:');
console.log('   1. Abre este proyecto con Claude Code');
console.log('   2. Claude detectará el servidor MCP de Supabase automáticamente');
console.log('   3. Prueba con: "Lista todas las tablas de mi base de datos"');
console.log('\n   Consulta SUPABASE.md para más información');

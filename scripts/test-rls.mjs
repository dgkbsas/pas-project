#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const USER_EMAIL = 'dgkbsas@gmail.com';

// Cliente con ANON KEY (simula el browser)
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Cliente con SERVICE ROLE (sin RLS)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

console.log('🔍 Probando acceso con RLS para:', USER_EMAIL, '\n');

async function testRLS() {
  try {
    // 1. Iniciar sesión como el usuario
    console.log('1️⃣ Iniciando sesión...');
    const { data: authData, error: authError } = await supabaseAnon.auth.signInWithPassword({
      email: USER_EMAIL,
      password: 'demo1234' // Intenta con esta contraseña común
    });

    if (authError) {
      console.log('   ❌ No pude iniciar sesión con contraseña demo1234');
      console.log('   ℹ️  Error:', authError.message);
      console.log();
      console.log('   🔧 SOLUCIÓN: Obtener políticas RLS directamente');
      console.log();
      
      // Obtener políticas RLS
      const { data: policies, error: polError } = await supabaseAdmin
        .rpc('exec_sql', {
          sql: `SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
                FROM pg_policies 
                WHERE tablename IN ('clients', 'policies', 'users')
                ORDER BY tablename, policyname;`
        });

      if (!polError && policies) {
        console.log('📋 Políticas RLS actuales:\n');
        console.log(JSON.stringify(policies, null, 2));
      }
      
      // Ver directamente qué usuario está en la BD
      console.log('\n2️⃣ Verificando usuario en BD...');
      const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', USER_EMAIL)
        .single();
      
      if (dbUser) {
        console.log('   Usuario encontrado:');
        console.log('   - ID:', dbUser.id);
        console.log('   - Email:', dbUser.email);
        console.log('   - Role:', dbUser.role);
        console.log('   - Company:', dbUser.company_id);
        console.log('   - Active:', dbUser.active);
      }
      
      console.log('\n🔧 PROBLEMA DETECTADO:');
      console.log('   Las políticas RLS están bloqueando el acceso.');
      console.log();
      console.log('   OPCIÓN 1: Desactivar RLS temporalmente (SOLO PARA DEBUG)');
      console.log('   ```sql');
      console.log('   ALTER TABLE clients DISABLE ROW LEVEL SECURITY;');
      console.log('   ALTER TABLE policies DISABLE ROW LEVEL SECURITY;');
      console.log('   ```');
      console.log();
      console.log('   OPCIÓN 2: Recrear las políticas RLS');
      console.log('   Ejecuta de nuevo: supabase/migration-add-assigned-to.sql');
      console.log();
      return;
    }

    console.log('   ✅ Sesión iniciada correctamente');
    console.log('   👤 Usuario:', authData.user.email);
    console.log();

    // 2. Intentar leer clientes con el token del usuario
    console.log('2️⃣ Intentando leer clientes (con RLS)...');
    const { data: clients, error: clientsError } = await supabaseAnon
      .from('clients')
      .select('*');

    if (clientsError) {
      console.log('   ❌ Error:', clientsError.message);
      console.log();
    } else {
      console.log(`   ✅ Clientes encontrados: ${clients?.length || 0}`);
      if (clients && clients.length > 0) {
        console.log();
        clients.slice(0, 3).forEach((c, i) => {
          console.log(`      ${i + 1}. ${c.first_name} ${c.last_name}`);
        });
      }
    }
    console.log();

    // 3. Intentar leer pólizas
    console.log('3️⃣ Intentando leer pólizas (con RLS)...');
    const { data: policies, error: policiesError } = await supabaseAnon
      .from('policies')
      .select('*');

    if (policiesError) {
      console.log('   ❌ Error:', policiesError.message);
    } else {
      console.log(`   ✅ Pólizas encontradas: ${policies?.length || 0}`);
    }
    console.log();

    // Cerrar sesión
    await supabaseAnon.auth.signOut();

  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

testRLS();

#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TARGET_EMAIL = 'dgkbsas@gmail.com';

console.log('🔍 Verificando usuario:', TARGET_EMAIL, '\n');

async function setupUser() {
  try {
    // 1. Verificar si el usuario existe en auth.users
    console.log('1️⃣ Verificando en auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('   ❌ Error al listar usuarios de auth:', authError.message);
      return;
    }

    const authUser = authUsers.users.find(u => u.email === TARGET_EMAIL);
    
    if (!authUser) {
      console.log('   ❌ Usuario NO encontrado en auth.users');
      console.log('   ℹ️  Necesitas crear el usuario primero desde el panel admin');
      console.log('   📧 Email:', TARGET_EMAIL);
      return;
    }

    console.log('   ✅ Usuario encontrado en auth.users');
    console.log('   📋 ID:', authUser.id);
    console.log('   📧 Email:', authUser.email);
    console.log('   📅 Creado:', new Date(authUser.created_at).toLocaleString('es-AR'));
    console.log();

    // 2. Verificar si el usuario existe en la tabla users
    console.log('2️⃣ Verificando en tabla users...');
    const { data: dbUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    if (dbError && dbError.code !== 'PGRST116') {
      console.error('   ❌ Error al buscar usuario:', dbError.message);
      return;
    }

    if (dbUser) {
      console.log('   ✅ Usuario YA EXISTE en tabla users');
      console.log('   🏢 Empresa ID:', dbUser.company_id);
      console.log('   👤 Rol:', dbUser.role);
      console.log('   📊 Activo:', dbUser.active);
      console.log();
      
      // Verificar el nombre de la empresa
      const { data: company } = await supabase
        .from('companies')
        .select('name')
        .eq('id', dbUser.company_id)
        .single();
      
      if (company) {
        console.log('   🏢 Empresa:', company.name);
      }
      
      console.log();
      console.log('✅ Todo configurado correctamente');
      console.log('   Puedes iniciar sesión en: http://localhost:5173/login');
      return;
    }

    console.log('   ❌ Usuario NO existe en tabla users');
    console.log();

    // 3. Verificar si hay empresas
    console.log('3️⃣ Verificando empresas disponibles...');
    const { data: companies, error: compError } = await supabase
      .from('companies')
      .select('*')
      .limit(5);

    if (compError) {
      console.error('   ❌ Error al listar empresas:', compError.message);
      return;
    }

    if (!companies || companies.length === 0) {
      console.log('   ❌ No hay empresas en la base de datos');
      console.log();
      console.log('📝 SOLUCIÓN: Crear empresa y usuario');
      console.log();
      console.log('Ejecuta este SQL en Supabase:');
      console.log('https://app.supabase.com/project/cnwaaqvgwndsovmbchxp/sql/new');
      console.log();
      console.log('```sql');
      console.log('-- 1. Crear empresa');
      console.log("INSERT INTO companies (name) VALUES ('Mi Empresa') RETURNING id;");
      console.log();
      console.log('-- 2. Agregar usuario a la tabla users (reemplaza <COMPANY_ID>)');
      console.log('INSERT INTO users (id, company_id, email, full_name, role, active)');
      console.log('VALUES (');
      console.log(`  '${authUser.id}',`);
      console.log("  '<COMPANY_ID>', -- Reemplaza con el ID de la empresa");
      console.log(`  '${TARGET_EMAIL}',`);
      console.log("  'Usuario Principal',");
      console.log("  'admin',");
      console.log('  true');
      console.log(');');
      console.log('```');
      return;
    }

    console.log(`   ✅ Encontradas ${companies.length} empresa(s):`);
    companies.forEach((c, i) => {
      console.log(`      ${i + 1}. ${c.name} (${c.id})`);
    });
    console.log();

    // 4. Ofrecer crear el usuario automáticamente
    const defaultCompany = companies[0];
    console.log('🔧 SOLUCIÓN AUTOMÁTICA:');
    console.log();
    console.log(`¿Quieres agregar el usuario a la empresa "${defaultCompany.name}"?`);
    console.log();
    console.log('Ejecuta este SQL en Supabase:');
    console.log('https://app.supabase.com/project/cnwaaqvgwndsovmbchxp/sql/new');
    console.log();
    console.log('```sql');
    console.log('INSERT INTO users (id, company_id, email, full_name, role, active)');
    console.log('VALUES (');
    console.log(`  '${authUser.id}',`);
    console.log(`  '${defaultCompany.id}',`);
    console.log(`  '${TARGET_EMAIL}',`);
    console.log("  'Usuario Principal',");
    console.log("  'admin',");
    console.log('  true');
    console.log(');');
    console.log('```');
    console.log();
    console.log('Después ejecuta: node scripts/setup-user.mjs');

  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

setupUser();

#!/usr/bin/env node

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const USER_EMAIL = 'dgkbsas@gmail.com';
const USER_ID = 'b0a00dbb-eb6c-4dc6-af6b-758554ec03e2';

console.log('🔍 Verificando acceso a datos para:', USER_EMAIL, '\n');

async function checkData() {
  try {
    // 1. Verificar campo assigned_to en clients
    console.log('1️⃣ Verificando estructura de tabla clients...');
    const { data: clientSample, error: sampleError } = await supabase
      .from('clients')
      .select('*')
      .limit(1);

    if (sampleError) {
      console.error('   ❌ Error:', sampleError.message);
      return;
    }

    if (clientSample && clientSample.length > 0) {
      const hasAssignedTo = 'assigned_to' in clientSample[0];
      if (hasAssignedTo) {
        console.log('   ✅ Campo assigned_to existe');
      } else {
        console.log('   ❌ Campo assigned_to NO existe');
        console.log('   ⚠️  La migración no se aplicó correctamente');
        return;
      }
    }
    console.log();

    // 2. Ver todos los clientes (con service role)
    console.log('2️⃣ Listando TODOS los clientes (admin view)...');
    const { data: allClients, error: allError } = await supabase
      .from('clients')
      .select('id, first_name, last_name, created_by, assigned_to, company_id')
      .limit(10);

    if (allError) {
      console.error('   ❌ Error:', allError.message);
      return;
    }

    if (!allClients || allClients.length === 0) {
      console.log('   ℹ️  No hay clientes en la base de datos');
      console.log('   💡 Crea algunos clientes en: http://localhost:5173/dashboard/clients/new');
      console.log();
      return;
    }

    console.log(`   ✅ Encontrados ${allClients.length} cliente(s):\n`);
    allClients.forEach((c, i) => {
      console.log(`      ${i + 1}. ${c.first_name} ${c.last_name}`);
      console.log(`         ID: ${c.id}`);
      console.log(`         Creado por: ${c.created_by}`);
      console.log(`         Asignado a: ${c.assigned_to || '❌ SIN ASIGNAR'}`);
      console.log(`         Empresa: ${c.company_id}`);
      console.log();
    });

    // 3. Ver clientes asignados al usuario específico
    console.log('3️⃣ Clientes asignados a', USER_EMAIL, '...');
    const assignedClients = allClients.filter(c => c.assigned_to === USER_ID);
    
    if (assignedClients.length === 0) {
      console.log('   ❌ NO hay clientes asignados a este usuario');
      console.log();
      
      // Verificar si hay clientes de la misma empresa
      const { data: user } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', USER_ID)
        .single();

      if (user) {
        const sameCompanyClients = allClients.filter(c => c.company_id === user.company_id);
        
        if (sameCompanyClients.length > 0) {
          console.log('   ⚠️  Hay clientes de tu empresa pero NO asignados a ti:');
          sameCompanyClients.forEach((c, i) => {
            console.log(`      ${i + 1}. ${c.first_name} ${c.last_name}`);
          });
          console.log();
          console.log('   🔧 SOLUCIÓN: Asignar clientes existentes');
          console.log();
          console.log('   Ejecuta este SQL en Supabase:');
          console.log('   https://app.supabase.com/project/cnwaaqvgwndsovmbchxp/sql/new');
          console.log();
          console.log('   ```sql');
          console.log('   -- Asignar TODOS los clientes de tu empresa a ti');
          console.log('   UPDATE clients');
          console.log(`   SET assigned_to = '${USER_ID}'`);
          console.log(`   WHERE company_id = '${user.company_id}';`);
          console.log('   ```');
          console.log();
        }
      }
      return;
    }

    console.log(`   ✅ Encontrados ${assignedClients.length} cliente(s) asignado(s):\n`);
    assignedClients.forEach((c, i) => {
      console.log(`      ${i + 1}. ${c.first_name} ${c.last_name}`);
    });
    console.log();

    // 4. Probar acceso con RLS (simulando el usuario)
    console.log('4️⃣ Probando acceso con RLS (como usuario)...');
    
    // Crear cliente temporal con el user token
    const { data: { session }, error: sessionError } = await supabase.auth.admin.getUserById(USER_ID);
    
    console.log('   ℹ️  Nota: Para probar RLS correctamente, inicia sesión en la app');
    console.log('   🌐 http://localhost:5173/login');
    console.log();

    console.log('✅ Resumen:');
    console.log(`   - Total clientes: ${allClients.length}`);
    console.log(`   - Asignados a ti: ${assignedClients.length}`);
    console.log(`   - Sin asignar: ${allClients.filter(c => !c.assigned_to).length}`);
    console.log();

  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

checkData();

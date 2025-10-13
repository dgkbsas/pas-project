#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_EMAIL = 'dgkbsas@gmail.com';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function main() {
	console.log('🔍 Verificando datos para:', USER_EMAIL);
	console.log('');

	// 1. Verificar usuario en auth
	const { data: authUsers } = await supabase.auth.admin.listUsers();
	const authUser = authUsers.users.find((u) => u.email === USER_EMAIL);

	if (!authUser) {
		console.log('❌ Usuario NO encontrado en auth.users');
		console.log('   Debes crear la cuenta primero en /signup');
		return;
	}

	console.log('✅ Usuario en auth.users:');
	console.log('   ID:', authUser.id);
	console.log('   Email:', authUser.email);
	console.log('');

	// 2. Verificar usuario en tabla users
	const { data: user, error: userError } = await supabase
		.from('users')
		.select('*')
		.eq('id', authUser.id)
		.single();

	if (userError || !user) {
		console.log('❌ Usuario NO encontrado en tabla users');
		console.log('   Error:', userError?.message);
		return;
	}

	console.log('✅ Usuario en tabla users:');
	console.log('   ID:', user.id);
	console.log('   Email:', user.email);
	console.log('   Company ID:', user.company_id);
	console.log('   Role:', user.role);
	console.log('   Active:', user.active);
	console.log('');

	// 3. Verificar empresa
	const { data: company } = await supabase
		.from('companies')
		.select('*')
		.eq('id', user.company_id)
		.single();

	if (!company) {
		console.log('❌ Empresa NO encontrada');
		return;
	}

	console.log('✅ Empresa:');
	console.log('   ID:', company.id);
	console.log('   Name:', company.name);
	console.log('');

	// 4. Verificar clientes
	const { data: clients, error: clientsError } = await supabase
		.from('clients')
		.select('*')
		.eq('company_id', user.company_id);

	console.log('📋 Clientes:');
	if (clientsError) {
		console.log('   Error:', clientsError.message);
	} else {
		console.log('   Total:', clients?.length || 0);
		if (clients && clients.length > 0) {
			clients.slice(0, 3).forEach((c) => {
				console.log(`   - ${c.first_name} ${c.last_name} (${c.active ? 'Activo' : 'Inactivo'})`);
			});
			if (clients.length > 3) {
				console.log(`   ... y ${clients.length - 3} más`);
			}
		}
	}
	console.log('');

	// 5. Verificar pólizas
	const { data: policies, error: policiesError } = await supabase
		.from('policies')
		.select('*')
		.eq('company_id', user.company_id);

	console.log('📄 Pólizas:');
	if (policiesError) {
		console.log('   Error:', policiesError.message);
	} else {
		console.log('   Total:', policies?.length || 0);
		const active = policies?.filter((p) => p.active).length || 0;
		const inactive = (policies?.length || 0) - active;
		console.log('   Activas:', active);
		console.log('   Inactivas:', inactive);
	}
	console.log('');

	// 6. Test de RLS
	console.log('🔒 Probando RLS (Row Level Security):');

	// Crear cliente de usuario (no service role)
	const userSupabase = createClient(SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

	// Simular login
	const { data: sessionData } = await userSupabase.auth.signInWithPassword({
		email: USER_EMAIL,
		password: 'test123' // Esto fallará si la contraseña no es esta
	});

	if (!sessionData.session) {
		console.log('   ⚠️  No se pudo simular login (contraseña incorrecta)');
		console.log('   Pero los datos están ahí, el problema puede ser RLS');
	} else {
		// Probar consulta con RLS
		const { data: rlsClients, error: rlsError } = await userSupabase
			.from('clients')
			.select('*');

		if (rlsError) {
			console.log('   ❌ Error con RLS:', rlsError.message);
		} else {
			console.log('   ✅ RLS funcionando, clientes visibles:', rlsClients?.length || 0);
		}
	}

	console.log('');
	console.log('📊 Resumen:');
	console.log('   Usuario existe:', user ? '✅' : '❌');
	console.log('   Empresa existe:', company ? '✅' : '❌');
	console.log('   Clientes:', clients?.length || 0);
	console.log('   Pólizas:', policies?.length || 0);
}

main().catch(console.error);

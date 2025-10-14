#!/usr/bin/env node

/**
 * Script para generar datos de prueba
 * Crea clientes y pólizas de ejemplo para el usuario dgkbsas@gmail.com
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_EMAIL = 'dgkbsas@gmail.com';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
	console.error('❌ Error: Faltan variables de entorno');
	process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Datos de prueba realistas argentinos
const clientsData = [
	{
		first_name: 'Juan',
		last_name: 'Pérez',
		document_number: '20345678',
		birth_date: '1980-05-15',
		email_primary: 'juan.perez@gmail.com',
		phone: '11-4567-8901',
		address: 'Av. Corrientes 1234',
		city: 'Buenos Aires',
		province: 'CABA',
		postal_code: '1043'
	},
	{
		first_name: 'María',
		last_name: 'González',
		document_number: '27654321',
		birth_date: '1985-08-22',
		email_primary: 'maria.gonzalez@hotmail.com',
		phone: '11-5678-9012',
		address: 'Calle Falsa 456',
		city: 'La Plata',
		province: 'Buenos Aires',
		postal_code: '1900'
	},
	{
		first_name: 'Carlos',
		last_name: 'Rodríguez',
		document_number: '18234567',
		birth_date: '1975-03-10',
		email_primary: 'carlos.rod@yahoo.com',
		phone: '351-456-7890',
		address: 'San Martín 789',
		city: 'Córdoba',
		province: 'Córdoba',
		postal_code: '5000'
	},
	{
		first_name: 'Ana',
		last_name: 'Martínez',
		document_number: '30987654',
		birth_date: '1992-11-05',
		email_primary: 'ana.martinez@outlook.com',
		phone: '11-6789-0123',
		address: 'Belgrano 321',
		city: 'San Isidro',
		province: 'Buenos Aires',
		postal_code: '1642'
	},
	{
		first_name: 'Diego',
		last_name: 'Fernández',
		document_number: '25456789',
		birth_date: '1988-07-18',
		email_primary: 'diego.fernandez@gmail.com',
		phone: '261-567-8901',
		address: 'Las Heras 987',
		city: 'Mendoza',
		province: 'Mendoza',
		postal_code: '5500'
	},
	{
		first_name: 'Laura',
		last_name: 'López',
		document_number: '32123456',
		birth_date: '1995-02-28',
		email_primary: 'laura.lopez@gmail.com',
		phone: '11-7890-1234',
		address: 'Rivadavia 654',
		city: 'Tigre',
		province: 'Buenos Aires',
		postal_code: '1648'
	},
	{
		first_name: 'Roberto',
		last_name: 'Sánchez',
		document_number: '22876543',
		birth_date: '1982-12-03',
		email_primary: 'roberto.sanchez@hotmail.com',
		phone: '341-678-9012',
		address: 'Mitre 147',
		city: 'Rosario',
		province: 'Santa Fe',
		postal_code: '2000'
	},
	{
		first_name: 'Gabriela',
		last_name: 'Torres',
		document_number: '28765432',
		birth_date: '1990-09-14',
		email_primary: 'gabi.torres@gmail.com',
		phone: '11-8901-2345',
		address: 'Sarmiento 258',
		city: 'Vicente López',
		province: 'Buenos Aires',
		postal_code: '1638'
	},
	{
		first_name: 'Martín',
		last_name: 'Romero',
		document_number: '24567890',
		birth_date: '1986-04-20',
		email_primary: 'martin.romero@yahoo.com',
		phone: '381-789-0123',
		address: 'Maipú 369',
		city: 'San Miguel de Tucumán',
		province: 'Tucumán',
		postal_code: '4000'
	},
	{
		first_name: 'Valeria',
		last_name: 'Díaz',
		document_number: '31234567',
		birth_date: '1993-06-25',
		email_primary: 'vale.diaz@outlook.com',
		phone: '11-9012-3456',
		address: 'Libertador 852',
		city: 'San Fernando',
		province: 'Buenos Aires',
		postal_code: '1646'
	}
];

const policyTypes = [
	'auto',
	'moto',
	'home',
	'fire',
	'various_risks',
	'collective_life',
	'mandatory_life',
	'civil_liability',
	'pets',
	'consortium',
	'personal_accidents'
];

const paymentModes = ['monthly', 'quarterly', 'biannual', 'annual'];

const vehiclePlates = [
	'AB123CD',
	'EF456GH',
	'IJ789KL',
	'MN012OP',
	'QR345ST',
	'UV678WX',
	'YZ901AB',
	'CD234EF',
	'GH567IJ',
	'KL890MN'
];

function randomDate(start, end) {
	return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
	return date.toISOString().split('T')[0];
}

async function main() {
	console.log('🚀 Iniciando generación de datos de prueba...\n');

	try {
		// 1. Buscar o crear empresa
		console.log('1️⃣ Verificando empresa...');
		let { data: companies } = await supabase.from('companies').select('*').limit(1);

		let companyId;
		if (!companies || companies.length === 0) {
			const { data: newCompany, error } = await supabase
				.from('companies')
				.insert({ name: 'Demo Insurance Company' })
				.select()
				.single();

			if (error) throw error;
			companyId = newCompany.id;
			console.log('   ✓ Empresa creada');
		} else {
			companyId = companies[0].id;
			console.log('   ✓ Empresa encontrada');
		}

		// 2. Buscar usuario en auth
		console.log('\n2️⃣ Verificando usuario en auth...');
		const { data: authUsers } = await supabase.auth.admin.listUsers();
		let authUser = authUsers.users.find((u) => u.email === USER_EMAIL);

		let userId;
		if (!authUser) {
			console.log('   ⚠️  Usuario no encontrado en auth');
			console.log('   ℹ️  Debes crear el usuario primero desde el panel admin');
			console.log(`   ℹ️  Email: ${USER_EMAIL}`);
			return;
		} else {
			userId = authUser.id;
			console.log('   ✓ Usuario encontrado en auth');
		}

		// 3. Verificar/crear usuario en tabla users
		console.log('\n3️⃣ Verificando usuario en tabla users...');
		let { data: existingUser } = await supabase
			.from('users')
			.select('*')
			.eq('id', userId)
			.single();

		if (!existingUser) {
			const { error } = await supabase.from('users').insert({
				id: userId,
				company_id: companyId,
				email: USER_EMAIL,
				full_name: 'Usuario Demo',
				role: 'admin',
				active: true
			});

			if (error) throw error;
			console.log('   ✓ Usuario creado en tabla users');
		} else {
			console.log('   ✓ Usuario ya existe en tabla users');
		}

		// 4. Crear clientes
		console.log('\n4️⃣ Creando clientes...');
		const createdClients = [];

		for (const clientData of clientsData) {
			const { data: client, error } = await supabase
				.from('clients')
				.insert({
					...clientData,
					company_id: companyId,
					created_by: userId,
					last_edited_by: userId,
					active: Math.random() > 0.1 // 90% activos
				})
				.select()
				.single();

			if (error) {
				console.error('   ❌ Error creando cliente:', error);
				continue;
			}

			createdClients.push(client);
			console.log(`   ✓ Cliente creado: ${client.first_name} ${client.last_name}`);
		}

		console.log(`\n   Total clientes creados: ${createdClients.length}`);

		// 5. Crear pólizas (40-50 pólizas)
		console.log('\n5️⃣ Creando pólizas...');
		const policiesToCreate = 45;
		let policiesCreated = 0;

		for (let i = 0; i < policiesToCreate; i++) {
			const client = createdClients[Math.floor(Math.random() * createdClients.length)];
			const policyType = policyTypes[Math.floor(Math.random() * policyTypes.length)];

			const startDate = randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31));
			const expiryDate = new Date(startDate);
			expiryDate.setFullYear(expiryDate.getFullYear() + 1);

			// Algunas pólizas vencen pronto (próximos 30 días)
			if (i % 5 === 0) {
				const today = new Date();
				const daysAhead = Math.floor(Math.random() * 30);
				expiryDate.setTime(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
			}

			const needsPlate = policyType === 'auto' || policyType === 'moto';

			const { error } = await supabase.from('policies').insert({
				client_id: client.id,
				company_id: companyId,
				created_by: userId,
				last_edited_by: userId,
				policy_number: `POL-${String(i + 1).padStart(6, '0')}`,
				policy_type: policyType,
				payment_mode: paymentModes[Math.floor(Math.random() * paymentModes.length)],
				start_date: formatDate(startDate),
				expiry_date: formatDate(expiryDate),
				vehicle_plate: needsPlate
					? vehiclePlates[Math.floor(Math.random() * vehiclePlates.length)]
					: null,
				active: Math.random() > 0.15, // 85% activas
				observations:
					i % 3 === 0 ? 'Póliza renovada automáticamente' : i % 5 === 0 ? 'Cliente preferencial' : null
			});

			if (error) {
				console.error('   ❌ Error creando póliza:', error);
				continue;
			}

			policiesCreated++;
			if (policiesCreated % 10 === 0) {
				console.log(`   ✓ ${policiesCreated} pólizas creadas...`);
			}
		}

		console.log(`\n   Total pólizas creadas: ${policiesCreated}`);

		console.log('\n✅ ¡Datos de prueba creados exitosamente!');
		console.log('\n📊 Resumen:');
		console.log(`   - Empresa: ${companyId}`);
		console.log(`   - Usuario: ${USER_EMAIL}`);
		console.log(`   - Clientes: ${createdClients.length}`);
		console.log(`   - Pólizas: ${policiesCreated}`);
		console.log('\n🔗 Ahora puedes iniciar sesión con: ' + USER_EMAIL);
	} catch (error) {
		console.error('\n❌ Error:', error);
		process.exit(1);
	}
}

main();

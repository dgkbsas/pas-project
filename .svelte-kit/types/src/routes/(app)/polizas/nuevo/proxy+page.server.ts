// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ locals, url }: Parameters<PageServerLoad>[0]) => {
	const { supabase, session } = locals;

	if (!session) {
		throw error(401, 'No autorizado');
	}

	// Obtener datos del usuario para conseguir company_id
	const { data: userData, error: userError } = await supabase
		.from('users')
		.select('company_id')
		.eq('id', session.user.id)
		.single();

	if (userError || !userData) {
		console.error('[NUEVA POLIZA] Error obteniendo usuario:', userError);
		throw error(404, 'Usuario no encontrado');
	}

	// Obtener lista de clientes de la empresa para el select
	const { data: clients, error: clientsError } = await supabase
		.from('clients')
		.select('id, first_name, last_name')
		.eq('company_id', (userData as any).company_id)
		.eq('active', true)
		.order('first_name');

	if (clientsError) {
		console.error('[NUEVA POLIZA] Error al cargar clientes:', clientsError);
		throw error(500, 'Error al cargar clientes');
	}

	// Si hay renew_from, cargar datos de la póliza a renovar
	const renewFromId = url.searchParams.get('renew_from');
	let renewData = null;

	if (renewFromId) {
		const { data: policyData, error: policyError } = await supabase
			.from('policies')
			.select('client_id, policy_type, insurer, payment_mode, vehicle_plate, vehicle_brand, vehicle_model')
			.eq('id', renewFromId)
			.eq('company_id', (userData as any).company_id)
			.single();

		if (!policyError && policyData) {
			renewData = policyData;
		}
	}

	return {
		clients: clients || [],
		renewData
	};
};

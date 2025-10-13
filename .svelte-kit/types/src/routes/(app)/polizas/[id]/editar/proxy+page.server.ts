// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = async ({ params, locals }: Parameters<PageServerLoad>[0]) => {
	const { supabase, session } = locals;
	
	if (!session) {
		throw error(401, 'No autorizado');
	}
	
	// Obtener company_id desde la tabla users
	const { data: userData } = await supabase
		.from('users')
		.select('company_id')
		.eq('id', session.user.id)
		.single();

	if (!userData) {
		throw error(404, 'Usuario no encontrado');
	}

	const companyId = (userData as any).company_id as string;
	
	// Obtener la póliza
	const { data: policy, error: policyError } = await supabase
		.from('policies')
		.select('*')
		.eq('id', params.id)
		.eq('company_id', companyId)
		.single();
	
	if (policyError || !policy) {
		throw error(404, 'Póliza no encontrada');
	}
	
	// Obtener lista de clientes para el select
	const { data: clients, error: clientsError } = await supabase
		.from('clients')
		.select('id, first_name, last_name')
		.eq('company_id', companyId)
		.order('first_name');
	
	if (clientsError) {
		throw error(500, 'Error al cargar clientes');
	}
	
	return {
		policy,
		clients: clients || []
	};
};

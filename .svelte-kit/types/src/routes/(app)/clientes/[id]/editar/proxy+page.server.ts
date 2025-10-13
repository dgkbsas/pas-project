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

	const { data: client, error: clientError } = await supabase
		.from('clients')
		.select('*')
		.eq('id', params.id)
		.eq('company_id', (userData as any).company_id)
		.single();
	
	if (clientError || !client) {
		throw error(404, 'Cliente no encontrado');
	}
	
	return {
		client
	};
};

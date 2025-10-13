import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
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
	
	// Obtener datos del cliente
	const { data: client, error: clientError } = await supabase
		.from('clients')
		.select('*')
		.eq('id', params.id)
		.eq('company_id', companyId)
		.single();
	
	if (clientError || !client) {
		throw error(404, 'Cliente no encontrado');
	}
	
	// Obtener pólizas del cliente
	const { data: policies, error: policiesError } = await supabase
		.from('policies')
		.select('*')
		.eq('client_id', params.id)
		.eq('company_id', companyId)
		.order('created_at', { ascending: false });
	
	return {
		client,
		policies: policies || []
	};
};

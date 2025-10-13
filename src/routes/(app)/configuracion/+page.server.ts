import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
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
	
	// Obtener datos de la empresa
	const { data: company, error: companyError } = await supabase
		.from('companies')
		.select('*')
		.eq('id', companyId)
		.single();
	
	// Obtener usuarios de la empresa
	const { data: users, error: usersError } = await supabase
		.from('users')
		.select('id, email, role, created_at')
		.eq('company_id', companyId)
		.order('created_at', { ascending: false });
	
	// Obtener invitaciones pendientes
	const { data: invitations, error: invitationsError } = await supabase
		.from('invitations')
		.select('*')
		.eq('company_id', companyId)
		.order('created_at', { ascending: false });
	
	return {
		user: session.user,
		company: company || null,
		users: users || [],
		invitations: invitations || []
	};
};

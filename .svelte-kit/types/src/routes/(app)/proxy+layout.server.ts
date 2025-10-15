// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	const session = locals.session;

	// Redirigir a login si no hay sesión
	if (!session) {
		throw redirect(303, '/auth/login');
	}

	// Obtener perfil del usuario
	const { data: userProfile } = await locals.supabase
		.from('users')
		.select('id, email, full_name, company_id, role')
		.eq('id', session.user.id)
		.single();

	return {
		session,
		userProfile: userProfile || undefined
	};
};

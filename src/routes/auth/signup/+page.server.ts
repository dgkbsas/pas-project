import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Si ya está autenticado, redirigir al dashboard
	if (locals.session) {
		throw redirect(303, '/dashboard');
	}

	return {
		supabase: locals.supabase
	};
};

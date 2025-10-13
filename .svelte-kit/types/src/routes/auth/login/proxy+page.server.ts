// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	// Si ya está autenticado, redirigir al dashboard
	if (locals.session) {
		throw redirect(303, '/dashboard');
	}

	// No devolver nada, el cliente de Supabase se crea en el cliente
	return {};
};

export const actions = {
	login: async ({ request, locals }: import('./$types').RequestEvent) => {
		console.log('[LOGIN ACTION] Iniciando login...');
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		console.log('[LOGIN ACTION] Email:', email);

		if (!email || !password) {
			console.log('[LOGIN ACTION] Faltan campos');
			return fail(400, {
				message: 'Por favor completa todos los campos',
				email
			});
		}

		console.log('[LOGIN ACTION] Intentando autenticar con Supabase...');
		const { data, error } = await locals.supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			console.error('[LOGIN ACTION] Error de autenticación:', error);
			return fail(401, {
				message: error.message || 'Credenciales inválidas',
				email
			});
		}

		console.log('[LOGIN ACTION] Login exitoso, sesión creada:', data.session ? 'SI' : 'NO');
		
		// Redirigir al dashboard después de login exitoso
		throw redirect(303, '/dashboard');
	}
};
;null as any as Actions;
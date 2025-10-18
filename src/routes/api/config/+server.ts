import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { CompanyConfigUpdate } from '$lib/types/config.types';
import type { Database } from '$lib/types/database.types';

/**
 * GET /api/config
 * Returns complete configuration for the current user's company
 */
export const GET: RequestHandler = async ({ locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		// Get user's company_id
		const { data: userData, error: userError } = await supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single();

		if (userError || !userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

		const company_id = (userData as { company_id: string }).company_id;

		// Get company configuration
		const { data: config, error: configError } = await supabase
			.from('company_config')
			.select('*')
			.eq('company_id', company_id)
			.single();

		if (configError) {
			if (configError.code === 'PGRST116') {
				// Config doesn't exist, create default one
				const { data: newConfig, error: insertError } = await supabase
					.from('company_config')
					.insert({ company_id } as any)
					.select()
					.single();

				if (insertError) {
					console.error('Error creating default config:', insertError);
					return json({ message: 'Error al crear configuración' }, { status: 500 });
				}

				return json({ config: newConfig });
			}

			console.error('Error fetching config:', configError);
			return json({ message: 'Error al obtener configuración' }, { status: 500 });
		}

		return json({ config });
	} catch (err: any) {
		console.error('Error in GET /api/config:', err);
		return json({ message: 'Error al obtener configuración' }, { status: 500 });
	}
};

/**
 * PATCH /api/config
 * Updates specific configuration fields
 */
export const PATCH: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const updates = await request.json() as CompanyConfigUpdate;

		// Get user's company_id and role
		const { data: userData, error: userError } = await supabase
			.from('users')
			.select('company_id, role')
			.eq('id', session.user.id)
			.single();

		if (userError || !userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

		const { company_id, role } = userData as { company_id: string; role: string };

		// Only admins can update configuration
		if (role !== 'admin') {
			return json({ message: 'Sin permisos para actualizar configuración' }, { status: 403 });
		}

		// Update configuration
		const { data: config, error: updateError } = await supabase
			.from('company_config')
			// @ts-expect-error - Supabase types not fully generated for company_config yet
			.update({
				...updates,
				updated_by: session.user.id
			})
			.eq('company_id', company_id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating config:', updateError);
			return json({ message: 'Error al actualizar configuración' }, { status: 400 });
		}

		return json({ config, message: 'Configuración actualizada exitosamente' });
	} catch (err: any) {
		console.error('Error in PATCH /api/config:', err);
		return json({ message: 'Error al actualizar configuración' }, { status: 500 });
	}
};

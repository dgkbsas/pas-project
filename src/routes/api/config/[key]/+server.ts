import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { SYSTEM_CONFIG_KEYS } from '$lib/types/config.types';

/**
 * GET /api/config/[key]
 * Returns a specific configuration variable
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const configKey = params.key;

		// Validate that config_key is a system variable
		if (!SYSTEM_CONFIG_KEYS.includes(configKey as any)) {
			return json({ 
				message: `Solo se permiten variables del sistema: ${SYSTEM_CONFIG_KEYS.join(', ')}` 
			}, { status: 400 });
		}

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

		// Get specific configuration
		const { data: config, error: configError } = await supabase
			.from('configuration')
			.select('*')
			.eq('company_id', company_id)
			.eq('config_key', configKey)
			.single();

		if (configError) {
			if (configError.code === 'PGRST116') {
				return json({ message: 'Configuración no encontrada' }, { status: 404 });
			}
			console.error('Error fetching config:', configError);
			return json({ message: 'Error al obtener configuración' }, { status: 500 });
		}

		return json({ config });
	} catch (err: any) {
		console.error('Error in GET /api/config/[key]:', err);
		return json({ message: 'Error al obtener configuración' }, { status: 500 });
	}
};

/**
 * PUT /api/config/[key]
 * Updates or creates a specific configuration variable (upsert)
 */
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const configKey = params.key;
		const body = await request.json();
		const { config_value } = body;

		// Validate that config_key is a system variable
		if (!SYSTEM_CONFIG_KEYS.includes(configKey as any)) {
			return json({ 
				message: `Solo se permiten variables del sistema: ${SYSTEM_CONFIG_KEYS.join(', ')}` 
			}, { status: 400 });
		}

		if (config_value === undefined) {
			return json({ message: 'config_value es requerido' }, { status: 400 });
		}

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

		// Upsert configuration (update if exists, insert if not)
		const { data: config, error: upsertError } = await supabase
			.from('configuration')
			.upsert(
				{
					company_id,
					config_key: configKey,
					config_value: config_value,
					updated_by: session.user.id
				} as any,
				{
					onConflict: 'company_id,config_key'
				}
			)
			.select()
			.single();

		if (upsertError) {
			console.error('Error upserting config:', upsertError);
			return json({ message: 'Error al actualizar configuración' }, { status: 400 });
		}

		return json({ config, message: 'Configuración actualizada exitosamente' });
	} catch (err: any) {
		console.error('Error in PUT /api/config/[key]:', err);
		return json({ message: 'Error al actualizar configuración' }, { status: 500 });
	}
};

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { SYSTEM_CONFIG_KEYS } from '$lib/types/config.types';

/**
 * GET /api/config
 * Returns all configuration variables for the current user's company
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

		// Get all configuration for this company
		const { data: configs, error: configError } = await supabase
			.from('configuration')
			.select('*')
			.eq('company_id', company_id)
			.order('config_key');

		if (configError) {
			console.error('Error fetching configs:', configError);
			return json({ message: 'Error al obtener configuración' }, { status: 500 });
		}

		return json({ configs: configs || [] });
	} catch (err: any) {
		console.error('Error in GET /api/config:', err);
		return json({ message: 'Error al obtener configuración' }, { status: 500 });
	}
};

/**
 * POST /api/config
 * Creates a new configuration variable
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { config_key, config_value } = body;

		if (!config_key) {
			return json({ message: 'config_key es requerido' }, { status: 400 });
		}

		// Validate that config_key is a system variable
		if (!SYSTEM_CONFIG_KEYS.includes(config_key as any)) {
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

		// Only admins can create configuration
		if (role !== 'admin') {
			return json({ message: 'Sin permisos para crear configuración' }, { status: 403 });
		}

		// Check if key already exists
		const { data: existing } = await supabase
			.from('configuration')
			.select('id')
			.eq('company_id', company_id)
			.eq('config_key', config_key)
			.single();

		if (existing) {
			return json({ message: 'Esta clave ya existe' }, { status: 400 });
		}

		// Create configuration
		const { data: config, error: insertError } = await supabase
			.from('configuration')
			.insert({
				company_id,
				config_key,
				config_value: config_value || {},
				updated_by: session.user.id
			} as any)
			.select()
			.single();

		if (insertError) {
			console.error('Error creating config:', insertError);
			return json({ message: 'Error al crear configuración' }, { status: 400 });
		}

		return json({ config, message: 'Configuración creada exitosamente' }, { status: 201 });
	} catch (err: any) {
		console.error('Error in POST /api/config:', err);
		return json({ message: 'Error al crear configuración' }, { status: 500 });
	}
};

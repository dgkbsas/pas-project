import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import type { ConfigItem, ArrayConfigKey } from '$lib/types/config.types';
import { ARRAY_CONFIG_KEYS, generateConfigKey } from '$lib/types/config.types';

/**
 * GET /api/config/[key]
 * Returns a specific configuration field
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const fieldKey = params.key;

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
			.select(fieldKey)
			.eq('company_id', company_id)
			.single();

		if (configError) {
			console.error('Error fetching config field:', configError);
			return json({ message: 'Error al obtener configuración' }, { status: 500 });
		}

		return json({ value: config[fieldKey] });
	} catch (err: any) {
		console.error('Error in GET /api/config/[key]:', err);
		return json({ message: 'Error al obtener configuración' }, { status: 500 });
	}
};

/**
 * PUT /api/config/[key]
 * Updates a complete configuration field (replaces the entire value)
 */
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const fieldKey = params.key;
		const body = await request.json();
		const { value } = body;

		if (value === undefined) {
			return json({ message: 'value es requerido' }, { status: 400 });
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

		// Update configuration field
		const { data: config, error: updateError } = await supabase
			.from('company_config')
			.update({
				[fieldKey]: value,
				updated_by: session.user.id
			})
			.eq('company_id', company_id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating config field:', updateError);
			return json({ message: 'Error al actualizar configuración' }, { status: 400 });
		}

		return json({ config, message: 'Configuración actualizada exitosamente' });
	} catch (err: any) {
		console.error('Error in PUT /api/config/[key]:', err);
		return json({ message: 'Error al actualizar configuración' }, { status: 500 });
	}
};

/**
 * POST /api/config/[key]
 * Adds or updates an item in a configuration array (payment_modes, policy_types, followup_types)
 */
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const fieldKey = params.key as ArrayConfigKey;
		const body = await request.json();
		const { value, key, active = true } = body;

		// Validate that this is an array config field
		if (!ARRAY_CONFIG_KEYS.includes(fieldKey)) {
			return json({
				message: `Solo se pueden agregar items a: ${ARRAY_CONFIG_KEYS.join(', ')}`
			}, { status: 400 });
		}

		if (!value) {
			return json({ message: 'value (label) es requerido' }, { status: 400 });
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
			return json({ message: 'Sin permisos para modificar configuración' }, { status: 403 });
		}

		// Get current items
		const { data: currentConfig, error: fetchError } = await supabase
			.from('company_config')
			.select(fieldKey)
			.eq('company_id', company_id)
			.single();

		if (fetchError) {
			console.error('Error fetching current config:', fetchError);
			return json({ message: 'Error al obtener configuración actual' }, { status: 500 });
		}

		const currentItems: ConfigItem[] = currentConfig[fieldKey] || [];

		// Generate key if not provided
		const itemKey = key || generateConfigKey(value);

		// Check if key already exists
		const existingIndex = currentItems.findIndex(item => item.key === itemKey);

		let updatedItems: ConfigItem[];
		if (existingIndex >= 0) {
			// Update existing item (but keep the original key)
			updatedItems = currentItems.map((item, index) =>
				index === existingIndex
					? { ...item, value, active }
					: item
			);
		} else {
			// Add new item
			updatedItems = [...currentItems, { key: itemKey, value, active }];
		}

		// Update configuration
		const { data: config, error: updateError } = await supabase
			.from('company_config')
			.update({
				[fieldKey]: updatedItems,
				updated_by: session.user.id
			})
			.eq('company_id', company_id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating config:', updateError);
			return json({ message: 'Error al actualizar configuración' }, { status: 400 });
		}

		return json({
			config,
			item: updatedItems.find(i => i.key === itemKey),
			message: existingIndex >= 0 ? 'Item actualizado exitosamente' : 'Item agregado exitosamente'
		});
	} catch (err: any) {
		console.error('Error in POST /api/config/[key]:', err);
		return json({ message: 'Error al agregar item' }, { status: 500 });
	}
};

/**
 * DELETE /api/config/[key]
 * Soft deletes (deactivates) an item in a configuration array
 * Query param: itemKey (the key of the item to deactivate)
 */
export const DELETE: RequestHandler = async ({ params, url, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const fieldKey = params.key as ArrayConfigKey;
		const itemKey = url.searchParams.get('itemKey');

		// Validate that this is an array config field
		if (!ARRAY_CONFIG_KEYS.includes(fieldKey)) {
			return json({
				message: `Solo se pueden eliminar items de: ${ARRAY_CONFIG_KEYS.join(', ')}`
			}, { status: 400 });
		}

		if (!itemKey) {
			return json({ message: 'itemKey es requerido como query param' }, { status: 400 });
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
			return json({ message: 'Sin permisos para modificar configuración' }, { status: 403 });
		}

		// Get current items
		const { data: currentConfig, error: fetchError } = await supabase
			.from('company_config')
			.select(fieldKey)
			.eq('company_id', company_id)
			.single();

		if (fetchError) {
			console.error('Error fetching current config:', fetchError);
			return json({ message: 'Error al obtener configuración actual' }, { status: 500 });
		}

		const currentItems: ConfigItem[] = currentConfig[fieldKey] || [];

		// Find and deactivate the item
		const itemIndex = currentItems.findIndex(item => item.key === itemKey);

		if (itemIndex === -1) {
			return json({ message: 'Item no encontrado' }, { status: 404 });
		}

		// Toggle active status
		const updatedItems = currentItems.map((item, index) =>
			index === itemIndex
				? { ...item, active: !item.active }
				: item
		);

		// Update configuration
		const { data: config, error: updateError } = await supabase
			.from('company_config')
			.update({
				[fieldKey]: updatedItems,
				updated_by: session.user.id
			})
			.eq('company_id', company_id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating config:', updateError);
			return json({ message: 'Error al actualizar configuración' }, { status: 400 });
		}

		const wasActive = currentItems[itemIndex].active;
		return json({
			config,
			message: wasActive ? 'Item desactivado exitosamente' : 'Item activado exitosamente'
		});
	} catch (err: any) {
		console.error('Error in DELETE /api/config/[key]:', err);
		return json({ message: 'Error al eliminar item' }, { status: 500 });
	}
};

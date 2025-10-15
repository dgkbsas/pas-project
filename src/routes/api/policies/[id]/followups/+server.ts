import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

/**
 * GET /api/policies/[id]/followups
 * Returns all followups for a specific policy
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const policyId = params.id;

		// Get all followups for this policy
		// RLS will automatically filter by company access
		const { data: followups, error } = await supabase
			.from('policy_followups')
			.select('*')
			.eq('policy_id', policyId)
			.order('date', { ascending: false })
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching followups:', error);
			return json({ message: 'Error al obtener seguimientos' }, { status: 500 });
		}

		return json({ followups: followups || [] });
	} catch (err: any) {
		console.error('Error in GET /api/policies/[id]/followups:', err);
		return json({ message: 'Error al obtener seguimientos' }, { status: 500 });
	}
};

/**
 * POST /api/policies/[id]/followups
 * Creates a new followup for a specific policy
 */
export const POST: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const policyId = params.id;
		const body = await request.json();

		// Validate required fields
		const { followup_type, date, description, status } = body;

		if (!followup_type) {
			return json({ message: 'El tipo de seguimiento es requerido' }, { status: 400 });
		}

		if (!date) {
			return json({ message: 'La fecha es requerida' }, { status: 400 });
		}

		// Optionally validate followup_type against company configuration
		// Get company configuration to validate followup types
		const { data: userData } = await supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single();

		if (userData) {
			const company_id = (userData as { company_id: string }).company_id;
			const { data: config } = await supabase
				.from('configuration')
				.select('config_value')
				.eq('company_id', company_id)
				.eq('config_key', 'followup_types')
				.single();

			if (config && (config as { config_value?: string[] }).config_value) {
				const validTypes = (config as { config_value: string[] }).config_value;
				if (!validTypes.includes(followup_type)) {
					return json(
						{ message: `Tipo de seguimiento no válido. Tipos permitidos: ${validTypes.join(', ')}` },
						{ status: 400 }
					);
				}
			}
		}

		// Create followup
		// Policy_id is enforced from params, not from body
		const { data: followup, error: insertError } = await supabase
			.from('policy_followups')
			.insert({
				policy_id: policyId,
				followup_type,
				date,
				description: description || null,
				status: status || null,
				created_by: session.user.id
			} as any)
			.select()
			.single();

		if (insertError) {
			console.error('Error creating followup:', insertError);
			
			// Check if it's an RLS policy violation
			if (insertError.code === '42501' || insertError.message?.includes('policy')) {
				return json({ message: 'No tienes permiso para crear seguimientos en esta póliza' }, { status: 403 });
			}
			
			return json({ message: 'Error al crear seguimiento' }, { status: 400 });
		}

		return json({ followup, message: 'Seguimiento creado exitosamente' }, { status: 201 });
	} catch (err: any) {
		console.error('Error in POST /api/policies/[id]/followups:', err);
		return json({ message: 'Error al crear seguimiento' }, { status: 500 });
	}
};

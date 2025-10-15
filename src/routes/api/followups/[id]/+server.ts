import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

/**
 * PUT /api/followups/[id]
 * Updates a specific followup
 */
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const followupId = params.id;
		const body = await request.json();

		// Validate and filter allowed fields
		// Never allow changing policy_id or created_by
		const allowedFields = ['followup_type', 'date', 'description', 'status'];
		const updates: Record<string, any> = {};

		for (const field of allowedFields) {
			if (field in body) {
				updates[field] = body[field];
			}
		}

		// Ensure at least one field is being updated
		if (Object.keys(updates).length === 0) {
			return json({ message: 'No se proporcionaron campos para actualizar' }, { status: 400 });
		}

		// Validate followup_type if provided
		if (updates.followup_type) {
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
					if (!validTypes.includes(updates.followup_type)) {
						return json(
							{ message: `Tipo de seguimiento no válido. Tipos permitidos: ${validTypes.join(', ')}` },
							{ status: 400 }
						);
					}
				}
			}
		}

		// Update followup
		// RLS will ensure only allowed users can update
		const { data: followup, error: updateError } = await supabase
			.from('policy_followups')
			// @ts-expect-error - Supabase type inference issue with dynamic updates
			.update(updates)
			.eq('id', followupId)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating followup:', updateError);
			
			// Check if it's an RLS policy violation
			if (updateError.code === '42501' || updateError.message?.includes('policy')) {
				return json({ message: 'No tienes permiso para actualizar este seguimiento' }, { status: 403 });
			}
			
			// Check if not found
			if (updateError.code === 'PGRST116') {
				return json({ message: 'Seguimiento no encontrado' }, { status: 404 });
			}
			
			return json({ message: 'Error al actualizar seguimiento' }, { status: 400 });
		}

		return json({ followup, message: 'Seguimiento actualizado exitosamente' });
	} catch (err: any) {
		console.error('Error in PUT /api/followups/[id]:', err);
		return json({ message: 'Error al actualizar seguimiento' }, { status: 500 });
	}
};

/**
 * DELETE /api/followups/[id]
 * Deletes a specific followup
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const followupId = params.id;

		// Delete followup
		// RLS will ensure only allowed users can delete
		const { error: deleteError } = await supabase
			.from('policy_followups')
			.delete()
			.eq('id', followupId);

		if (deleteError) {
			console.error('Error deleting followup:', deleteError);
			
			// Check if it's an RLS policy violation
			if (deleteError.code === '42501' || deleteError.message?.includes('policy')) {
				return json({ message: 'No tienes permiso para eliminar este seguimiento' }, { status: 403 });
			}
			
			return json({ message: 'Error al eliminar seguimiento' }, { status: 400 });
		}

		return json({ message: 'Seguimiento eliminado exitosamente' }, { status: 200 });
	} catch (err: any) {
		console.error('Error in DELETE /api/followups/[id]:', err);
		return json({ message: 'Error al eliminar seguimiento' }, { status: 500 });
	}
};

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

/**
 * GET /api/company
 * Returns the company information for the current user
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

		// Get company data
		const { data: company, error: companyError } = await supabase
			.from('companies')
			.select('*')
			.eq('id', company_id)
			.single();

		if (companyError || !company) {
			return json({ message: 'Empresa no encontrada' }, { status: 404 });
		}

		return json({ company });
	} catch (err: any) {
		console.error('Error fetching company:', err);
		return json({ message: 'Error al obtener empresa' }, { status: 500 });
	}
};

/**
 * PUT /api/company
 * Updates the company information for the current user
 */
export const PUT: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return json({ message: 'No autenticado' }, { status: 401 });
	}

	try {
		const body = await request.json();

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

		// Only admins can update company info
		if (role !== 'admin') {
			return json({ message: 'Sin permisos para actualizar empresa' }, { status: 403 });
		}

		// Validate and filter allowed fields
		const allowedFields = ['name', 'address', 'city', 'postal_code', 'phone', 'active'];
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

		// Add updated_at timestamp
		updates.updated_at = new Date().toISOString();

		// Update company
		const { data: company, error: updateError } = await supabase
			.from('companies')
			.update(updates as any)
			.eq('id', company_id)
			.select()
			.single();

		if (updateError) {
			console.error('Error updating company:', {
				error: updateError,
				code: updateError.code,
				message: updateError.message,
				details: updateError.details,
				hint: updateError.hint,
				company_id,
				updates: updates
			});
			
			// Check for specific error types
			if (updateError.code === '42501') {
				return json({ 
					message: 'No tienes permisos para actualizar la empresa. Verifica que seas administrador.' 
				}, { status: 403 });
			}
			
			return json({ 
				message: 'Error al actualizar empresa',
				error: updateError.message 
			}, { status: 400 });
		}

		return json({ company, message: 'Empresa actualizada exitosamente' });
	} catch (err: any) {
		console.error('Error in PUT /api/company:', err);
		return json({ message: 'Error al actualizar empresa' }, { status: 500 });
	}
};

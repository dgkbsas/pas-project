import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { updatePolicySchema } from '$lib/schemas/policies';

/**
 * GET /api/policies/[id]
 * Obtiene detalles de una póliza con información del cliente
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;
	const { id } = params;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		// Obtener company_id del usuario
		const { data: userData } = (await supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single()) as { data: any };

		if (!userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

		// Obtener póliza con información del cliente
		const { data: policy, error: policyError } = await supabase
			.from('policies')
			.select(`
				*,
				clients (
					id,
					first_name,
					last_name,
					email_primary,
					phone
				)
			`)
			.eq('id', id)
			.eq('company_id', userData.company_id)
			.single();

		if (policyError || !policy) {
			return json({ message: 'Póliza no encontrada' }, { status: 404 });
		}

		// Format the response to match PolicyWithClient type
		const policyData = policy as any;
		const clientData = policyData.clients;
		
		const formattedPolicy = {
			...policyData,
			client: clientData,
			client_full_name: clientData 
				? `${clientData.first_name} ${clientData.last_name}`
				: null,
		};

		// Remove the clients property from the response
		delete formattedPolicy.clients;

		return json({ policy: formattedPolicy });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * PUT /api/policies/[id]
 * Actualiza una póliza existente
 */
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;
	const { id } = params;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		const body = await request.json();
		const validation = updatePolicySchema.safeParse(body);

		if (!validation.success) {
			return json(
				{
					message: 'Datos inválidos',
					errors: validation.error.flatten().fieldErrors
				},
				{ status: 400 }
			);
		}

		// Obtener company_id del usuario
		const { data: userData } = (await supabase
			.from('users')
			.select('company_id, role')
			.eq('id', session.user.id)
			.single()) as { data: any };

		if (!userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

		// Solo admins y users pueden editar pólizas
		if (userData.role === 'guest') {
			return json({ message: 'Sin permisos para editar pólizas' }, { status: 403 });
		}

		// Actualizar póliza
		const { data: policy, error } = await supabase
			.from('policies')
			// @ts-expect-error - Supabase type inference issue with update
			.update(validation.data)
			.eq('id', id)
			.eq('company_id', userData.company_id)
			.select()
			.single();

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		if (!policy) {
			return json({ message: 'Póliza no encontrada' }, { status: 404 });
		}

		return json({ policy });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * DELETE /api/policies/[id]
 * Soft delete de una póliza (marca como inactiva)
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;
	const { id } = params;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		// Obtener company_id del usuario
		const { data: userData } = (await supabase
			.from('users')
			.select('company_id, role')
			.eq('id', session.user.id)
			.single()) as { data: any };

		if (!userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

		// Solo admins pueden eliminar pólizas
		if (userData.role !== 'admin') {
			return json({ message: 'Sin permisos para eliminar pólizas' }, { status: 403 });
		}

		// Soft delete: marcar como inactiva
		const { data: policy, error } = await supabase
			.from('policies')
			.update({
				active: false,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.eq('company_id', userData.company_id)
			.select()
			.single();

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		if (!policy) {
			return json({ message: 'Póliza no encontrada' }, { status: 404 });
		}

		return json({ message: 'Póliza marcada como inactiva', policy });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

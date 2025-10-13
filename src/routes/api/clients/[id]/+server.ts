import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { updateClientSchema } from '$lib/schemas/clients';

/**
 * GET /api/clients/[id]
 * Obtiene detalles de un cliente con sus pólizas
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

		// Obtener cliente
		const { data: client, error: clientError } = await supabase
			.from('clients')
			.select('*')
			.eq('id', id)
			.eq('company_id', userData.company_id)
			.single();

		if (clientError || !client) {
			return json({ message: 'Cliente no encontrado' }, { status: 404 });
		}

		// Obtener pólizas del cliente
		const { data: policies, error: policiesError } = await supabase
			.from('policies')
			.select('id, policy_number, policy_type, insurer, active, start_date, expiry_date')
			.eq('client_id', id)
			.eq('company_id', userData.company_id)
			.order('created_at', { ascending: false });

		if (policiesError) {
			console.error('Error fetching policies:', policiesError);
			// No fallar si hay error obteniendo pólizas, solo retornar cliente sin pólizas
			return json({ client: { ...(client as any), policies: [] } });
		}

		return json({ client: { ...(client as any), policies: policies || [] } });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * PUT /api/clients/[id]
 * Actualiza un cliente existente
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
		const validation = updateClientSchema.safeParse(body);

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

		// Solo admins y users pueden editar clientes
		if (userData.role === 'guest') {
			return json({ message: 'Sin permisos para editar clientes' }, { status: 403 });
		}

		// Actualizar cliente
		const { data: client, error } = await supabase
			.from('clients')
			// @ts-expect-error - Supabase type inference issue with update
			.update(validation.data)
			.eq('id', id)
			.eq('company_id', userData.company_id)
			.select()
			.single();

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		if (!client) {
			return json({ message: 'Cliente no encontrado' }, { status: 404 });
		}

		return json({ client });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * DELETE /api/clients/[id]
 * Elimina un cliente (soft delete)
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

		// Solo admins pueden eliminar clientes
		if (userData.role !== 'admin') {
			return json({ message: 'Sin permisos para eliminar clientes' }, { status: 403 });
		}

		// Verificar si el cliente tiene pólizas asociadas
		const { count: policiesCount } = (await supabase
			.from('policies')
			.select('*', { count: 'exact', head: true })
			.eq('client_id', id)) as { count: any };

		if (policiesCount && policiesCount > 0) {
			return json(
				{
					message: `No se puede eliminar. El cliente tiene ${policiesCount} póliza(s) asociada(s)`
				},
				{ status: 400 }
			);
		}

		// Eliminar cliente
		const { error } = await supabase
			.from('clients')
			.delete()
			.eq('id', id)
			.eq('company_id', userData.company_id);

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		return new Response(null, { status: 204 });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { clientSchema } from '$lib/schemas/clients';

/**
 * GET /api/clients
 * Lista todos los clientes de la empresa del usuario con filtros opcionales
 */
export const GET: RequestHandler = async ({ url, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		// Obtener datos del usuario
		const { data: userData } = (await supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single()) as { data: any };

		if (!userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

	// Parámetros de búsqueda y filtros
	const search = url.searchParams.get('search') || '';
	const activeOnly = url.searchParams.get('active_only') === 'true';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '30');
	const offset = (page - 1) * limit;

	// Nuevos filtros
	const cities = url.searchParams.getAll('city');
	const hasEmail = url.searchParams.get('has_email');
	const hasPhone = url.searchParams.get('has_phone');
	const dateFrom = url.searchParams.get('date_from');
	const dateTo = url.searchParams.get('date_to');

	// Parámetros de ordenamiento
	const sortBy = url.searchParams.get('sort_by') || 'first_name';
	const sortOrder = url.searchParams.get('sort_order') || 'asc';
	const ascending = sortOrder === 'asc';

	// Validar sort_by para evitar inyecciones
	const validSortFields = ['first_name', 'last_name', 'created_at', 'updated_at', 'policy_count'];
	const sortField = validSortFields.includes(sortBy) ? sortBy : 'first_name';

	// Query base
	let query = supabase
		.from('clients')
		.select('*', { count: 'exact' })
		.eq('company_id', userData.company_id);
	
	// Filtrar solo activos si se solicita
	if (activeOnly) {
		query = query.eq('active', true);
	}

	// Aplicar búsqueda si existe
	if (search) {
		query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email_primary.ilike.%${search}%,phone.ilike.%${search}%`);
	}

	// Aplicar filtros de ciudad
	if (cities.length > 0) {
		query = query.in('city', cities);
	}

	// Filtrar por presencia de email
	if (hasEmail === 'true') {
		query = query.not('email_primary', 'is', null);
	} else if (hasEmail === 'false') {
		query = query.is('email_primary', null);
	}

	// Filtrar por presencia de teléfono
	if (hasPhone === 'true') {
		query = query.not('phone', 'is', null);
	} else if (hasPhone === 'false') {
		query = query.is('phone', null);
	}

	// Filtrar por rango de fechas de creación
	if (dateFrom) {
		query = query.gte('created_at', dateFrom);
	}
	if (dateTo) {
		query = query.lte('created_at', dateTo);
	}

	// Aplicar ordenamiento (excepto policy_count que se hace después)
	if (sortField !== 'policy_count') {
		query = query.order(sortField as any, { ascending });
	}

	// Aplicar paginación
	query = query.range(offset, offset + limit - 1);

	const { data: clients, error, count } = await query;

	if (error) {
		return json({ message: error.message }, { status: 400 });
	}

	// Obtener conteo de pólizas activas por cliente
	if (clients && clients.length > 0) {
		const clientIds = (clients as any[]).map(c => c.id);

		// Query para contar pólizas activas por cliente
		const { data: policyCounts } = await supabase
			.from('policies')
			.select('client_id')
			.in('client_id', clientIds)
			.eq('active', true);

		// Crear un mapa de conteos
		const countsMap = new Map<string, number>();
		(policyCounts as any[])?.forEach(p => {
			countsMap.set(p.client_id, (countsMap.get(p.client_id) || 0) + 1);
		});

		// Agregar el conteo a cada cliente
		(clients as any[]).forEach(client => {
			client.active_policies_count = countsMap.get(client.id) || 0;
		});

		// Ordenar por policy_count si fue solicitado
		if (sortField === 'policy_count') {
			(clients as any[]).sort((a, b) => {
				const countA = a.active_policies_count || 0;
				const countB = b.active_policies_count || 0;
				return ascending ? countA - countB : countB - countA;
			});
		}
	}

	return json({
		clients,
		pagination: {
			page,
			limit,
			total: count || 0,
			total_pages: Math.ceil((count || 0) / limit)
		}
	});
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * POST /api/clients
 * Crea un nuevo cliente
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		const body = await request.json();
		const validation = clientSchema.safeParse(body);

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

		// Solo admins y users pueden crear clientes
		if (userData.role === 'guest') {
			return json({ message: 'Sin permisos para crear clientes' }, { status: 403 });
		}

		// Crear cliente
		const { data: client, error } = await supabase
			.from('clients')
			.insert({
				...validation.data,
				company_id: userData.company_id,
				created_by: session.user.id,
				assigned_to: session.user.id
			} as any)
			.select()
			.single();

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		return json({ client }, { status: 201 });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

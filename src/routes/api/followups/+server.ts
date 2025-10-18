import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

/**
 * GET /api/followups
 * Lista todos los seguimientos con filtros avanzados
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

		// Parse filters
		const filters = {
			policy_id: url.searchParams.get('policy_id') || undefined,
			client_id: url.searchParams.get('client_id') || undefined,
			followup_type: url.searchParams.get('followup_type') || undefined,
			status: url.searchParams.get('status') || undefined,
			date_from: url.searchParams.get('date_from') || undefined,
			date_to: url.searchParams.get('date_to') || undefined,
			search: url.searchParams.get('search') || undefined,
			sortBy: url.searchParams.get('sortBy') || 'date',
			sortOrder: url.searchParams.get('sortOrder') || 'desc',
			page: parseInt(url.searchParams.get('page') || '1'),
			limit: parseInt(url.searchParams.get('limit') || '30')
		};

		const { page, limit, search, policy_id, client_id, followup_type, status, date_from, date_to, sortBy, sortOrder } = filters;
		const offset = (page - 1) * limit;

		// Query base con join a policies y clients
		let query = supabase
			.from('policy_followups')
			.select(
				`
				*,
				policy:policies (
					id,
					policy_number,
					policy_type,
					client_id,
					client:clients (
						id,
						first_name,
						last_name
					)
				)
			`,
				{ count: 'exact' }
			);

		// Filter by company through policies
		// Since policy_followups doesn't have company_id directly,
		// we need to filter through the policies table
		// This is handled by RLS policies, but we'll explicitly filter for safety
		const { data: companyPolicies } = await supabase
			.from('policies')
			.select('id')
			.eq('company_id', userData.company_id);

		if (companyPolicies) {
			const policyIds = companyPolicies.map((p: any) => p.id);
			if (policyIds.length > 0) {
				query = query.in('policy_id', policyIds);
			} else {
				// No policies found, return empty result
				return json({
					followups: [],
					pagination: {
						page,
						limit,
						total: 0,
						total_pages: 0
					}
				});
			}
		}

		// Apply filters
		if (search) {
			query = query.or(`followup_type.ilike.%${search}%,description.ilike.%${search}%,status.ilike.%${search}%`);
		}

		if (policy_id) {
			query = query.eq('policy_id', policy_id);
		}

		// Filter by client_id (through policy relationship)
		if (client_id) {
			const { data: clientPolicies } = await supabase
				.from('policies')
				.select('id')
				.eq('client_id', client_id)
				.eq('company_id', userData.company_id);

			if (clientPolicies && clientPolicies.length > 0) {
				const clientPolicyIds = clientPolicies.map((p: any) => p.id);
				query = query.in('policy_id', clientPolicyIds);
			} else {
				// No policies for this client
				return json({
					followups: [],
					pagination: {
						page,
						limit,
						total: 0,
						total_pages: 0
					}
				});
			}
		}

		if (followup_type) {
			query = query.eq('followup_type', followup_type);
		}

		if (status) {
			query = query.eq('status', status);
		}

		if (date_from) {
			query = query.gte('date', date_from);
		}

		if (date_to) {
			query = query.lte('date', date_to);
		}

		// Aplicar ordenamiento
		const ascending = sortOrder === 'asc';
		query = query.order(sortBy || 'date', { ascending });

		// Aplicar paginación
		query = query.range(offset, offset + limit - 1);

		const { data: followups, error, count } = (await query) as { data: any; error: any; count: number };

		if (error) {
			console.error('Error fetching followups:', error);
			return json({ message: error.message }, { status: 400 });
		}

		return json({
			followups,
			pagination: {
				page,
				limit,
				total: count || 0,
				total_pages: Math.ceil((count || 0) / limit)
			}
		});
	} catch (err: any) {
		console.error('Error in GET /api/followups:', err);
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * POST /api/followups
 * Crea un nuevo seguimiento
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		const body = await request.json();
		console.log('POST /api/followups - Request body:', JSON.stringify(body, null, 2));

		// Validate required fields
		if (!body.policy_id || !body.followup_type || !body.date) {
			return json({
				message: 'Datos incompletos. Se requiere: policy_id, followup_type, date'
			}, { status: 400 });
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

		// Solo admins y users pueden crear seguimientos
		if (userData.role === 'guest') {
			return json({ message: 'Sin permisos para crear seguimientos' }, { status: 403 });
		}

		// Verificar que la póliza pertenezca a la misma empresa
		const { data: policy } = (await supabase
			.from('policies')
			.select('id, company_id')
			.eq('id', body.policy_id)
			.eq('company_id', userData.company_id)
			.single()) as { data: any };

		if (!policy) {
			return json({ message: 'Póliza no encontrada' }, { status: 404 });
		}

		// Crear seguimiento
		const { data: followup, error } = (await supabase
			.from('policy_followups')
			.insert({
				policy_id: body.policy_id,
				followup_type: body.followup_type,
				date: body.date,
				description: body.description || null,
				status: body.status || null,
				alert_date: body.alert_date || null,
				created_by: session.user.id
			} as any)
			.select()
			.single()) as { data: any; error: any };

		if (error) {
			console.error('Database error creating followup:', error);
			return json({ message: error.message }, { status: 400 });
		}

		return json({ followup }, { status: 201 });
	} catch (err: any) {
		console.error('Error in POST /api/followups:', err);
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { policySchema, policyFilterSchema } from '$lib/schemas/policies';

/**
 * GET /api/policies
 * Lista todas las pólizas con filtros avanzados
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

		// Auto-inactivar pólizas vencidas
		const today = new Date().toISOString().split('T')[0];
		await supabase
			.from('policies')
			.update({
				active: false,
				updated_at: new Date().toISOString()
			})
			.eq('company_id', userData.company_id)
			.eq('active', true)
			.lt('expiry_date', today);

		// Parse filters with support for multiple values
		const policyTypes = url.searchParams.getAll('policy_type');
		const paymentModes = url.searchParams.getAll('payment_mode');
		const insurers = url.searchParams.getAll('insurer');
		
		const filters = {
			client_id: url.searchParams.get('client_id') || undefined,
			status: url.searchParams.get('status') || undefined,
			policy_type: policyTypes.length > 0 ? policyTypes : url.searchParams.get('policy_type') || undefined,
			payment_mode: paymentModes.length > 0 ? paymentModes : undefined,
			insurer: insurers.length > 0 ? insurers : undefined,
			search: url.searchParams.get('search') || undefined,
			active_only: url.searchParams.get('active_only') === 'true',
			sortBy: url.searchParams.get('sortBy') || 'created_at',
			sortOrder: url.searchParams.get('sortOrder') || 'desc',
			page: parseInt(url.searchParams.get('page') || '1'),
			limit: parseInt(url.searchParams.get('limit') || '30')
		};

		const validation = policyFilterSchema.safeParse(filters);
		if (!validation.success) {
			return json(
				{ message: 'Filtros inválidos', errors: validation.error.flatten().fieldErrors },
				{ status: 400 }
			);
		}

	const { page, limit, search, client_id, status, policy_type, payment_mode, insurer, active_only, sortBy, sortOrder } = validation.data;
		const offset = (page - 1) * limit;

		// Query base con join a clients
		let query = supabase
			.from('policies')
			.select(
				`
				*,
				client:clients (
					id,
					first_name,
					last_name,
					email_primary,
					phone
				),
				followups_count:policy_followups(count)
			`,
				{ count: 'exact' }
			)
			.eq('company_id', userData.company_id);

		// Aplicar filtros
		if (search) {
			query = query.or(`policy_number.ilike.%${search}%,policy_type.ilike.%${search}%,vehicle_plate.ilike.%${search}%`);
		}

		if (client_id) {
			query = query.eq('client_id', client_id);
		}

		// Filtro de estado con lógica especial
		if (status) {
			if (status === 'active') {
				query = query.eq('active', true);
			} else if (status === 'inactive') {
				query = query.eq('active', false);
			} else if (status === 'expiring_soon') {
				// Pólizas activas que vencen en los próximos 30 días
				const futureDate = new Date();
				futureDate.setDate(futureDate.getDate() + 30);
				const future = futureDate.toISOString().split('T')[0];
				query = query.eq('active', true).gte('expiry_date', today).lte('expiry_date', future);
			} else if (status === 'expired') {
				// Pólizas inactivas con fecha de vencimiento pasada
				query = query.eq('active', false).lt('expiry_date', today);
			}
		}

		// Filter by policy type (single or multiple)
		if (policy_type) {
			if (Array.isArray(policy_type) && policy_type.length > 0) {
				query = query.in('policy_type', policy_type);
			} else if (typeof policy_type === 'string') {
				query = query.eq('policy_type', policy_type);
			}
		}
		
		// Filter by payment mode (multiple)
		if (payment_mode && Array.isArray(payment_mode) && payment_mode.length > 0) {
			query = query.in('payment_mode', payment_mode);
		}
		
		// Filter by insurer (multiple)
		if (insurer && Array.isArray(insurer) && insurer.length > 0) {
			query = query.in('insurer', insurer);
		}
		
		// Filtrar solo activas si se solicita
		if (active_only) {
			query = query.eq('active', true);
		}

		// Aplicar ordenamiento
		const ascending = sortOrder === 'asc';
		query = query.order(sortBy || 'created_at', { ascending });

		// Aplicar paginación
		query = query.range(offset, offset + limit - 1);

		const { data: policies, error, count } = (await query) as { data: any; error: any; count: number };

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		return json({
			policies,
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
 * POST /api/policies
 * Crea una nueva póliza
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		const body = await request.json();
		console.log('POST /api/policies - Request body:', JSON.stringify(body, null, 2));
		
		const validation = policySchema.safeParse(body);

		if (!validation.success) {
			console.error('Validation failed:', validation.error.flatten());
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

		// Solo admins y users pueden crear pólizas
		if (userData.role === 'guest') {
			return json({ message: 'Sin permisos para crear pólizas' }, { status: 403 });
		}

		// Verificar que el cliente pertenezca a la misma empresa
		const { data: client } = (await supabase
			.from('clients')
			.select('id')
			.eq('id', validation.data.client_id)
			.eq('company_id', userData.company_id)
			.single()) as { data: any };

		if (!client) {
			return json({ message: 'Cliente no encontrado' }, { status: 404 });
		}

		// Crear póliza
		const { data: policy, error } = (await supabase
			.from('policies')
			.insert({
				...validation.data,
				company_id: userData.company_id,
				created_by: session.user.id
			} as any)
			.select()
			.single()) as { data: any; error: any };

		if (error) {
			console.error('Database error creating policy:', error);
			return json({ message: error.message }, { status: 400 });
		}

		return json({ policy }, { status: 201 });
	} catch (err: any) {
		console.error('Error in POST /api/policies:', err);
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

/**
 * GET /api/clients/search
 * Search clients with typeahead support for dropdowns
 */
export const GET: RequestHandler = async ({ url, locals }) => {
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

		// Get search parameters
		const q = url.searchParams.get('q') || '';
		const limit = parseInt(url.searchParams.get('limit') || '20');

		// Build query
		let query = supabase
			.from('clients')
			.select('id, first_name, last_name, email_primary, document_number')
			.eq('company_id', company_id)
			.eq('active', true)
			.limit(limit);

		// Apply search filter
		if (q) {
			query = query.or(
				`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email_primary.ilike.%${q}%,document_number.ilike.%${q}%`
			);
		}

		// Order by relevance (first name, then last name)
		query = query.order('first_name', { ascending: true });

		const { data: clients, error } = await query;

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		// Transform to option format
		const options = (clients || []).map((client: any) => ({
			value: client.id,
			label: `${client.first_name} ${client.last_name}`,
			email: client.email_primary,
			document: client.document_number,
		}));

		return json({ options });
	} catch (err: any) {
		console.error('Error searching clients:', err);
		return json({ message: 'Error al buscar clientes' }, { status: 500 });
	}
};

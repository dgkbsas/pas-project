// @ts-nocheck
import type { PageServerLoad } from './$types';

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return {
			followups: [],
			clients: [],
			policies: [],
			followupTypes: [],
			statuses: []
		};
	}

	try {
		// Get user's company
		const { data: userData } = await supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single();

		if (!userData) {
			return {
				followups: [],
				clients: [],
				policies: [],
				followupTypes: [],
				statuses: []
			};
		}

		const company_id = (userData as { company_id: string }).company_id;

		// Load clients for filter dropdown
		const { data: clients } = await supabase
			.from('clients')
			.select('id, first_name, last_name')
			.eq('company_id', company_id)
			.eq('active', true)
			.order('first_name');

		// Load configuration for followup types
		const { data: config } = await supabase
			.from('company_config')
			.select('followup_types, followup_statuses')
			.eq('company_id', company_id)
			.single();

		const followupTypes = config && (config as any).followup_types
			? (config as any).followup_types.filter((t: any) => t.active).map((t: any) => t.value)
			: [];

		// Get unique statuses from existing followups
		const { data: existingFollowups } = await supabase
			.from('policy_followups')
			.select('status, policy:policies!inner(company_id)')
			.eq('policy.company_id', company_id)
			.not('status', 'is', null);

		const statuses = existingFollowups
			? Array.from(new Set((existingFollowups as any[]).map(f => f.status).filter(Boolean)))
			: [];

		return {
			clients: clients || [],
			followupTypes,
			statuses
		};
	} catch (error) {
		console.error('Error loading followups page data:', error);
		return {
			clients: [],
			followupTypes: [],
			statuses: []
		};
	}
};

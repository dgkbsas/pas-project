import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

/**
 * GET /api/debug/policies-schema
 * Returns the structure and constraints of the policies table
 * TEMPORARY ENDPOINT FOR DEBUGGING - REMOVE IN PRODUCTION
 */
export const GET: RequestHandler = async ({ locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		// Get sample data to see existing values
		const { data: allPolicies, error: allError } = await supabase
			.from('policies')
			.select('payment_mode, policy_type')
			.limit(100);

		// Get unique values
		const uniquePaymentModes = [...new Set(allPolicies?.map(p => p.payment_mode).filter(Boolean))];
		const uniquePolicyTypes = [...new Set(allPolicies?.map(p => p.policy_type).filter(Boolean))];

		// Get user's company_id
		const { data: userData } = await supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single();

		// Test inserting with semi-annual
		const testPolicy = {
			client_id: allPolicies?.[0]?.client_id || '00000000-0000-0000-0000-000000000000',
			company_id: userData?.company_id,
			created_by: session.user.id,
			policy_number: 'TEST-SEMI-ANNUAL',
			policy_type: 'auto',
			payment_mode: 'semi-annual',
			start_date: '2025-01-01',
			expiry_date: '2026-01-01',
			active: false
		};

		const { data: insertTest, error: insertError } = await supabase
			.from('policies')
			.insert(testPolicy)
			.select()
			.single();

		// If successful, delete the test policy
		if (insertTest) {
			await supabase.from('policies').delete().eq('id', insertTest.id);
		}

		return json({
			uniquePaymentModes,
			uniquePolicyTypes,
			semiAnnualTest: {
				success: !insertError,
				error: insertError?.message || null,
				errorDetails: insertError || null
			},
			samplePolicies: allPolicies?.slice(0, 5)
		});
	} catch (err: any) {
		return json({ 
			message: 'Error querying database structure',
			error: err.message,
			details: err
		}, { status: 500 });
	}
};

/**
 * Root Layout Server Load
 * Runs on every page load to provide session data
 */

import type { LayoutServerLoad } from './$types';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
 
injectAnalytics({ mode: dev ? 'development' : 'production' });

injectSpeedInsights();

export const load: LayoutServerLoad = async ({ locals }) => {
	const { session, user } = await locals.safeGetSession();

	
	// Serializar solo los datos necesarios, no objetos completos
	return {
		session: session ? {
			access_token: session.access_token,
			refresh_token: session.refresh_token,
			expires_at: session.expires_at,
			expires_in: session.expires_in,
			token_type: session.token_type,
			user: session.user
		} : null,
		user
	};
};

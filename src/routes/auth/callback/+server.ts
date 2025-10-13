/**
 * Auth Callback Handler
 * Handles the OAuth callback from Supabase Auth
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/dashboard';

	if (code) {
		await locals.supabase.auth.exchangeCodeForSession(code);
	}

	throw redirect(303, next);
};

/**
 * SvelteKit Server Hooks
 * These run on every server-side request
 */

import { handle as supabaseHandle } from '$lib/server/supabase';
import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// First run the Supabase handle to set up the client
	return supabaseHandle({ event, resolve: async (event) => {
		// Check authentication for protected routes
		const { session, user } = await event.locals.safeGetSession();
		
		// IMPORTANTE: Validar que la sesión sea válida y no esté expirada
		const isValidSession = session && session.expires_at && 
							  new Date(session.expires_at * 1000) > new Date();
		
		event.locals.session = isValidSession ? session : null;
		event.locals.user = isValidSession ? user : null;
		const path = event.url.pathname;

		// Public routes that don't require authentication
		const publicRoutes = ['/', '/auth/login', '/auth/callback'];
		const isPublicRoute = publicRoutes.some(route => path === route || path.startsWith(route + '/'));

		// If user is not authenticated and trying to access protected route, redirect to login
		if (!isValidSession && !isPublicRoute && !path.startsWith('/api/')) {
			console.log('Redirecting to login - no valid session');
			throw redirect(303, '/auth/login');
		}

		// If user is authenticated and trying to access login, redirect to dashboard
		if (isValidSession && path === '/auth/login') {
			throw redirect(303, '/dashboard');
		}

		return resolve(event);
	}});
};

/**
 * Server-side Supabase client
 * This file creates a Supabase client that works on the server with cookies
 */

import { createServerClient } from '@supabase/ssr';
import { type Handle } from '@sveltejs/kit';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import type { Database } from '$lib/types/database.types';

export const handle: Handle = async ({ event, resolve }) => {
	// Create a Supabase client specific to this request
	event.locals.supabase = createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, {
						...options,
						path: '/',
						// Configuración para desarrollo en red local
						sameSite: 'lax',
						secure: false, // true solo en producción con HTTPS
						httpOnly: false, // Permitir acceso desde JS para debugging
					});
				});
			}
		}
	});

	/**
	 * Safely get the session without throwing errors
	 * Uses getUser() as the primary authentication source (more secure)
	 * getSession() data comes from cookies and may not be authentic
	 */
	event.locals.safeGetSession = async () => {
		// First, get the authenticated user from Supabase Auth server
		const {
			data: { user },
			error: userError
		} = await event.locals.supabase.auth.getUser();

		// Only if user is authenticated, get session data
		// Note: session data comes from storage and should be validated against user
		let session = null;
		if (user && !userError) {
			const { data } = await event.locals.supabase.auth.getSession();
			session = data.session;
		}

		return { session, user };
	};

	// Continue with the request
	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Allows supabase auth headers to be passed through
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

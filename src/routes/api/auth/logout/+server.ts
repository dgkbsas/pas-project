/**
 * Logout API Endpoint
 * Handles user logout by signing out from Supabase
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	try {
		console.log('[LOGOUT API] Iniciando logout...');

		// Sign out from Supabase
		const { error } = await locals.supabase.auth.signOut();

		if (error) {
			console.error('[LOGOUT API] Error al cerrar sesión:', error);
			return json(
				{
					success: false,
					message: error.message || 'Error al cerrar sesión'
				},
				{ status: 500 }
			);
		}

		console.log('[LOGOUT API] Logout exitoso');
		return json({
			success: true,
			message: 'Sesión cerrada exitosamente'
		});
	} catch (error) {
		console.error('[LOGOUT API] Error inesperado:', error);
		return json(
			{
				success: false,
				message: 'Error inesperado al cerrar sesión'
			},
			{ status: 500 }
		);
	}
};

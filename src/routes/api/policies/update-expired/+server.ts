import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

/**
 * POST /api/policies/update-expired
 * Marca todas las pólizas vencidas como inactivas
 * Este endpoint puede ser llamado manualmente o por un cron job
 */
export const POST: RequestHandler = async ({ locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		// Obtener company_id del usuario
		const { data: userData } = (await supabase
			.from('users')
			.select('company_id, role')
			.eq('id', session.user.id)
			.single()) as { data: any };

		if (!userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

		// Solo admins pueden ejecutar esta operación
		if (userData.role !== 'admin') {
			return json({ message: 'Sin permisos para ejecutar esta operación' }, { status: 403 });
		}

		// Fecha actual en formato YYYY-MM-DD
		const today = new Date().toISOString().split('T')[0];

		// Buscar y actualizar pólizas vencidas que aún están activas
		const { data: expiredPolicies, error } = await supabase
			.from('policies')
			.update({
				active: false,
				updated_at: new Date().toISOString()
			})
			.eq('company_id', userData.company_id)
			.eq('active', true)
			.lt('expiry_date', today)
			.select('id, policy_number, expiry_date');

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		return json({
			message: `${expiredPolicies?.length || 0} pólizas marcadas como inactivas`,
			updated_policies: expiredPolicies || []
		});
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * GET /api/policies/update-expired
 * Verifica cuántas pólizas vencidas hay sin marcarlas como inactivas
 */
export const GET: RequestHandler = async ({ locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		// Obtener company_id del usuario
		const { data: userData } = (await supabase
			.from('users')
			.select('company_id')
			.eq('id', session.user.id)
			.single()) as { data: any };

		if (!userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

		// Fecha actual en formato YYYY-MM-DD
		const today = new Date().toISOString().split('T')[0];

		// Contar pólizas vencidas que aún están activas
		const { data: expiredPolicies, error, count } = await supabase
			.from('policies')
			.select('id, policy_number, expiry_date', { count: 'exact' })
			.eq('company_id', userData.company_id)
			.eq('active', true)
			.lt('expiry_date', today);

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		return json({
			count: count || 0,
			expired_policies: expiredPolicies || []
		});
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

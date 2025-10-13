import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase, session } = locals;
	
	if (!session) {
		throw error(401, 'No autorizado');
	}
	
	// Obtener datos del usuario desde la tabla users
	const { data: userData, error: userError } = await supabase
		.from('users')
		.select('company_id, full_name')
		.eq('id', session.user.id)
		.single();

	if (userError || !userData) {
		console.error('[DASHBOARD] Error obteniendo usuario:', userError);
		throw error(404, 'Usuario no encontrado');
	}

	const companyId = (userData as any).company_id as string;
	
	// Fechas para los queries
	const today = new Date();
	const thirtyDaysFromNow = new Date(today);
	thirtyDaysFromNow.setDate(today.getDate() + 30);
	const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
	const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	
	// Ejecutar todas las queries en paralelo
	const [
		{ count: clientsCount },
		{ count: activePoliciesCount },
		{ count: expiringPoliciesCount },
		{ count: renewalsThisMonthCount },
		{ data: recentClients },
		{ data: recentPolicies }
	] = await Promise.all([
		// Estadísticas de clientes
		supabase
			.from('clients')
			.select('*', { count: 'exact', head: true })
			.eq('company_id', companyId),
		
		// Pólizas activas
		supabase
			.from('policies')
			.select('*', { count: 'exact', head: true })
			.eq('company_id', companyId)
			.eq('active', true),
		
		// Pólizas por vencer (próximos 30 días)
		supabase
			.from('policies')
			.select('*', { count: 'exact', head: true })
			.eq('company_id', companyId)
			.eq('active', true)
			.gte('expiry_date', today.toISOString())
			.lte('expiry_date', thirtyDaysFromNow.toISOString()),
		
		// Renovaciones del mes
		supabase
			.from('policies')
			.select('*', { count: 'exact', head: true })
			.eq('company_id', companyId)
			.gte('expiry_date', firstDayOfMonth.toISOString())
			.lte('expiry_date', lastDayOfMonth.toISOString()),
		
		// Clientes recientes
		supabase
			.from('clients')
			.select('id, first_name, last_name, created_at')
			.eq('company_id', companyId)
			.order('created_at', { ascending: false })
			.limit(3),
		
		// Pólizas recientes
		supabase
			.from('policies')
			.select('id, policy_number, policy_type, created_at, clients(first_name, last_name)')
			.eq('company_id', companyId)
			.order('created_at', { ascending: false })
			.limit(3)
	]);
	
	return {
		userProfile: userData,
		stats: {
			clientsCount: clientsCount || 0,
			activePoliciesCount: activePoliciesCount || 0,
			expiringPoliciesCount: expiringPoliciesCount || 0,
			renewalsThisMonthCount: renewalsThisMonthCount || 0
		},
		recentActivity: {
			clients: recentClients || [],
			policies: recentPolicies || []
		}
	};
};

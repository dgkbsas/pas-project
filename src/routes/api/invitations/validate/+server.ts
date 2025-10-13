import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

/**
 * POST /api/invitations/validate
 * Valida y obtiene información de una invitación por su token
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;

	try {
		const { token } = await request.json();

		if (!token) {
			return json({ message: 'Token requerido' }, { status: 400 });
		}

		// Usar la función RPC para validar el token
		const { data, error } = await supabase.rpc('invitation_token_status', {
			p_token: token
		} as any);

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		if (!data || (data as any[]).length === 0) {
			return json({ message: 'Invitación no encontrada' }, { status: 404 });
		}

		const invitation = (data as any[])[0];

		// Si la invitación no es válida, devolver el motivo
		if (!invitation.valid) {
			return json(
				{
					valid: false,
					reason: invitation.reason,
					message:
						invitation.reason === 'used'
							? 'Esta invitación ya ha sido utilizada'
							: invitation.reason === 'expired'
							? 'Esta invitación ha expirado'
							: 'Invitación no válida'
				},
				{ status: 410 } // Gone
			);
		}

		// Obtener información adicional de la compañía
		const { data: companyData } = (await supabase
			.from('companies')
			.select('name, company_name')
			.eq('id', invitation.company_id)
			.single()) as { data: any };

		return json({
			valid: true,
			invitation: {
				id: invitation.id,
				email: invitation.email,
				role: invitation.role,
				expires_at: invitation.expires_at,
				company: {
					id: invitation.company_id,
					name: companyData?.company_name || companyData?.name || 'Empresa'
				}
			}
		});
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

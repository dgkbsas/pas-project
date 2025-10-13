import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { invitationCreateSchema } from '$lib/schemas/invitation.schema';

/**
 * GET /api/invitations
 * Lista todas las invitaciones de la compañía del usuario
 */
export const DELETE: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		const { id } = await request.json();

		if (!id) {
			return new Response('ID requerido', { status: 400 });
		}

		// Verificar que el usuario tiene permiso (debe ser admin de la compañía)
		const { data: userData } = (await supabase
			.from('users')
			.select('company_id, role')
			.eq('id', session.user.id)
			.single()) as { data: any };

		if (!userData) {
			return new Response('Usuario no encontrado', { status: 404 });
		}

		if (userData.role !== 'admin') {
			return new Response('Sin permisos', { status: 403 });
		}

		// Eliminar la invitación
		const { error } = await supabase
			.from('company_invitations')
			.delete()
			.eq('id', id)
			.eq('company_id', userData.company_id);

		if (error) {
			return new Response(error.message, { status: 400 });
		}

		return new Response(null, { status: 204 });
	} catch (err: any) {
		return new Response(err.message || 'Error interno', { status: 500 });
	}
};

/**
 * GET /api/invitations
 * Lista todas las invitaciones
 */
export const GET: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	
	if (!locals.session) {
		return new Response('No autorizado', { status: 401 });
	}
	
	try {
		const { data, error } = (await supabase
			.from('company_invitations')
			.select('*')
			.order('created_at', { ascending: false })) as { data: any; error: any };

		if (error) {
			return new Response(error.message, { status: 400 });
		}

		return json(data);
	} catch (err: any) {
		return new Response(err.message || 'Error interno', { status: 500 });
	}
};

/**
 * POST /api/invitations
 * Crea una nueva invitación
 */
export const POST: RequestHandler = async ({ request, locals, url }) => {
	const supabase = locals.supabase;
	
	if (!locals.session) {
		return new Response('No autorizado', { status: 401 });
	}

	try {
		const body = await request.json();
		const parsed = invitationCreateSchema.safeParse(body);

		if (!parsed.success) {
			return json(
				{ error: 'Datos inválidos', details: parsed.error.format() },
				{ status: 400 }
			);
		}

		const { email, role, company_id, expires_in_days } = parsed.data;

		// Generar token único
		const { data: tokenData, error: tokenErr } = (await supabase.rpc(
			'generate_company_invite_token',
			{ p_bytes: 24 } as any
		)) as { data: any; error: any };

		if (tokenErr) {
			return new Response(tokenErr.message, { status: 400 });
		}

		// Calcular fecha de expiración
		const expires_at = new Date(Date.now() + expires_in_days * 86400000).toISOString();

		// Crear invitación
		const { data, error } = (await supabase
			.from('company_invitations')
			.insert({
				company_id,
				email,
				role,
				token: tokenData,
				expires_at,
				created_by: locals.session.user.id
			} as any)
			.select()
			.single()) as { data: any; error: any };

		if (error) {
			return new Response(error.message, { status: 400 });
		}

		// Construir URL de invitación
		const invitation_url = `${url.origin}/invite?token=${data.token}`;

		return json({
			...data,
			invitation_url
		}, { status: 201 });
	} catch (err: any) {
		return new Response(err.message || 'Error interno', { status: 500 });
	}
};

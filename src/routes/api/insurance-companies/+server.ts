import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

// Validation schema for insurance company
const insuranceCompanySchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	code: z.string().optional().nullable(),
	contact_email: z.string().email('Email inv\u00e1lido').optional().nullable().or(z.literal('')),
	contact_phone: z.string().optional().nullable(),
	website: z.string().url('URL inv\u00e1lida').optional().nullable().or(z.literal('')),
});

/**
 * GET /api/insurance-companies
 * Lista todas las compañías de seguros de la empresa
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

		// Obtener compañías de seguros
		const { data: companies, error } = await supabase
			.from('insurance_companies')
			.select('*')
			.eq('company_id', userData.company_id)
			.order('name', { ascending: true });

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		return json({ companies: companies || [] });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * POST /api/insurance-companies
 * Crea una nueva compañía de seguros
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;

	if (!session?.user) {
		return new Response('No autenticado', { status: 401 });
	}

	try {
		const body = await request.json();
		const validation = insuranceCompanySchema.safeParse(body);

		if (!validation.success) {
			return json(
				{
					message: 'Datos inválidos',
					errors: validation.error.flatten().fieldErrors
				},
				{ status: 400 }
			);
		}

		// Obtener company_id del usuario
		const { data: userData } = (await supabase
			.from('users')
			.select('company_id, role')
			.eq('id', session.user.id)
			.single()) as { data: any };

		if (!userData) {
			return json({ message: 'Usuario no encontrado' }, { status: 404 });
		}

		// Solo admins pueden crear compañías de seguros
		if (userData.role !== 'admin') {
			return json({ message: 'Sin permisos para crear compañías de seguros' }, { status: 403 });
		}

		// Crear compañía de seguros
		const { data: company, error } = await supabase
			.from('insurance_companies')
			.insert({
				...validation.data,
				company_id: userData.company_id,
				created_by: session.user.id
			} as any)
			.select()
			.single();

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		return json({ company }, { status: 201 });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

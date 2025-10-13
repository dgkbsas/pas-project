import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { z } from 'zod';

// Validation schema for insurance company
const insuranceCompanySchema = z.object({
	name: z.string().min(1, 'El nombre es requerido'),
	code: z.string().optional().nullable(),
	contact_email: z.string().email('Email inválido').optional().nullable().or(z.literal('')),
	contact_phone: z.string().optional().nullable(),
	website: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
});

/**
 * PUT /api/insurance-companies/[id]
 * Actualiza una compañía de seguros
 */
export const PUT: RequestHandler = async ({ params, request, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;
	const { id } = params;

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

		// Solo admins pueden actualizar compañías de seguros
		if (userData.role !== 'admin') {
			return json({ message: 'Sin permisos para actualizar compañías de seguros' }, { status: 403 });
		}

		// Actualizar compañía de seguros
		const { data: company, error } = await supabase
			.from('insurance_companies')
			.update(validation.data as any)
			.eq('id', id)
			.eq('company_id', userData.company_id)
			.select()
			.single();

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		if (!company) {
			return json({ message: 'Compañía de seguros no encontrada' }, { status: 404 });
		}

		return json({ company });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

/**
 * DELETE /api/insurance-companies/[id]
 * Elimina una compañía de seguros
 */
export const DELETE: RequestHandler = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const session = locals.session;
	const { id } = params;

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

		// Solo admins pueden eliminar compañías de seguros
		if (userData.role !== 'admin') {
			return json({ message: 'Sin permisos para eliminar compañías de seguros' }, { status: 403 });
		}

		// Verificar si hay pólizas asociadas
		const { count: policiesCount } = (await supabase
			.from('policies')
			.select('*', { count: 'exact', head: true })
			.eq('insurer', id)) as { count: any };

		if (policiesCount && policiesCount > 0) {
			return json(
				{
					message: `No se puede eliminar. Hay ${policiesCount} póliza(s) asociada(s) a esta compañía`
				},
				{ status: 400 }
			);
		}

		// Eliminar compañía de seguros
		const { error } = await supabase
			.from('insurance_companies')
			.delete()
			.eq('id', id)
			.eq('company_id', userData.company_id);

		if (error) {
			return json({ message: error.message }, { status: 400 });
		}

		return new Response(null, { status: 204 });
	} catch (err: any) {
		return json({ message: err.message || 'Error interno' }, { status: 500 });
	}
};

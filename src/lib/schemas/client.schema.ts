import { z } from 'zod';

export const clientSchema = z.object({
	first_name: z
		.string()
		.min(1, 'El nombre es requerido')
		.max(100, 'El nombre es muy largo'),

	last_name: z
		.string()
		.min(1, 'El apellido es requerido')
		.max(100, 'El apellido es muy largo'),

	document_number: z
		.string()
		.max(20, 'El número de documento es muy largo')
		.optional()
		.nullable(),

	birth_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
		.optional()
		.nullable(),

	email_primary: z
		.string()
		.email('Email inválido')
		.optional()
		.nullable()
		.or(z.literal('')),

	email_secondary: z
		.string()
		.email('Email secundario inválido')
		.optional()
		.nullable()
		.or(z.literal('')),

	phone: z
		.string()
		.max(30, 'El celular es muy largo')
		.optional()
		.nullable(),

	phone_landline: z
		.string()
		.max(20, 'El teléfono es muy largo')
		.optional()
		.nullable(),

	address: z
		.string()
		.max(200, 'La dirección es muy larga')
		.optional()
		.nullable(),

	postal_code: z
		.string()
		.max(10, 'El código postal es muy largo')
		.optional()
		.nullable(),

	city: z
		.string()
		.max(100, 'La localidad es muy larga')
		.optional()
		.nullable(),

	province: z
		.string()
		.max(100, 'La provincia es muy larga')
		.optional()
		.nullable(),

	alias_pas: z
		.string()
		.max(100, 'El alias es muy largo')
		.optional()
		.nullable(),

	referred_by: z
		.string()
		.max(200, 'El campo referenciado por es muy largo')
		.optional()
		.nullable(),

	observations: z
		.string()
		.max(1000, 'Las observaciones son muy largas')
		.optional()
		.nullable(),

	active: z.boolean().default(true)
});

export type ClientFormData = z.infer<typeof clientSchema>;

import { z } from 'zod';
import { PolicyType, PaymentMode } from '$lib/types/enums';

export const policySchema = z.object({
	client_id: z
		.string()
		.uuid('ID de cliente inválido'),

	policy_number: z
		.string()
		.max(50, 'El número de póliza es muy largo')
		.optional()
		.nullable(),

	policy_type: z.nativeEnum(PolicyType, {
		errorMap: () => ({ message: 'Tipo de póliza inválido' })
	}),

	insurer_id: z
		.string()
		.uuid('ID de aseguradora inválido')
		.optional()
		.nullable(),

	payment_mode: z
		.nativeEnum(PaymentMode, {
			errorMap: () => ({ message: 'Modo de pago inválido' })
		})
		.optional()
		.nullable(),

	start_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),

	expiry_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)'),

	review_date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato de fecha inválido (YYYY-MM-DD)')
		.optional()
		.nullable(),

	vehicle_plate: z
		.string()
		.max(20, 'El dominio es muy largo')
		.optional()
		.nullable(),

	insured_sum: z
		.number()
		.nonnegative('La suma asegurada debe ser positiva')
		.optional()
		.nullable(),

	accessories: z
		.string()
		.max(2000, 'Los accesorios son muy largos')
		.optional()
		.nullable(),

	premium: z
		.number()
		.nonnegative('El premio debe ser positivo')
		.optional()
		.nullable(),

	endorsement: z
		.string()
		.max(2000, 'El endoso es muy largo')
		.optional()
		.nullable(),

	observations: z
		.string()
		.max(1000, 'Las observaciones son muy largas')
		.optional()
		.nullable(),

	active: z.boolean().default(true)
})
	(data) => {
		// Validate that expiry_date is after start_date
		if (data.start_date && data.expiry_date) {
			return new Date(data.expiry_date) > new Date(data.start_date);
		}
		return true;
	},
	{
		message: 'La fecha de vencimiento debe ser posterior a la fecha de alta',
		path: ['expiry_date']
	}
);

export type PolicyFormData = z.infer<typeof policySchema>;

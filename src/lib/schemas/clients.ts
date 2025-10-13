import { z } from 'zod';

export const clientSchema = z.object({
	first_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
	last_name: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
	document_number: z.string().optional().or(z.literal('')),
	email_primary: z.string().email('Email inválido').optional().or(z.literal('')),
	phone: z.string().optional().or(z.literal('')),
	address: z.string().optional().or(z.literal('')),
	city: z.string().optional().or(z.literal('')),
	province: z.string().optional().or(z.literal('')),
	postal_code: z.string().optional().or(z.literal('')),
	observations: z.string().optional().or(z.literal(''))
});

export const updateClientSchema = clientSchema.partial();

export type ClientInput = z.infer<typeof clientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

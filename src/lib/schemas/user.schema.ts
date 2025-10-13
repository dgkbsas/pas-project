import { z } from 'zod';
import { UserRole } from '$lib/types/enums';

export const userSettingsSchema = z.object({
	full_name: z
		.string()
		.min(1, 'El nombre es requerido')
		.max(200, 'El nombre es muy largo')
		.optional()
		.nullable(),

	alert_days_before_expiry: z
		.number()
		.int('Debe ser un número entero')
		.min(1, 'Mínimo 1 día')
		.max(365, 'Máximo 365 días')
		.default(30)
});

export const userSchema = z.object({
	email: z
		.string()
		.email('Email inválido')
		.min(1, 'El email es requerido'),

	full_name: z
		.string()
		.max(200, 'El nombre es muy largo')
		.optional()
		.nullable(),

	role: z.nativeEnum(UserRole, {
		errorMap: () => ({ message: 'Rol inválido' })
	}).default(UserRole.Agent),

	alert_days_before_expiry: z
		.number()
		.int('Debe ser un número entero')
		.min(1, 'Mínimo 1 día')
		.max(365, 'Máximo 365 días')
		.default(30),

	active: z.boolean().default(true)
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;
export type UserFormData = z.infer<typeof userSchema>;

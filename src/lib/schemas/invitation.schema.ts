import { z } from 'zod';

/**
 * Schema para crear una nueva invitación
 */
export const invitationCreateSchema = z.object({
	email: z.string().email('Email inválido'),
	role: z.enum(['admin', 'agent', 'guest'], {
		errorMap: () => ({ message: 'Rol inválido' })
	}),
	company_id: z.string().uuid('ID de compañía inválido'),
	expires_in_days: z.number().int().min(1).max(60).default(7)
});

export type InvitationCreate = z.infer<typeof invitationCreateSchema>;

/**
 * Schema para validar token de invitación
 */
export const invitationTokenSchema = z.object({
	token: z.string().min(16, 'Token inválido').max(256, 'Token inválido')
});

export type InvitationToken = z.infer<typeof invitationTokenSchema>;

/**
 * Schema para aceptar invitación
 */
export const invitationAcceptSchema = z.object({
	token: z.string().min(16).max(256),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
	full_name: z.string().min(1, 'El nombre es requerido').optional()
});

export type InvitationAccept = z.infer<typeof invitationAcceptSchema>;

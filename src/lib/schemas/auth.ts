import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const resetPasswordSchema = z.object({
	email: z.string().email('Email inválido')
});

export const updatePasswordSchema = z.object({
	currentPassword: z.string().min(6),
	newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
	confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
	message: 'Las contraseñas no coinciden',
	path: ['confirmPassword']
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;

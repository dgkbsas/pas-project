import { toast as sonner } from 'svelte-sonner';

/**
 * Toast notification system using svelte-sonner
 * Unified API for showing notifications
 */

export interface ToastOptions {
	type: 'success' | 'error' | 'info' | 'warning' | 'loading';
	message: string;
	description?: string;
	duration?: number;
}

export function showToast(options: ToastOptions) {
	const { type, message, description, duration } = options;

	const config = {
		description,
		duration: duration || 3000
	};

	switch (type) {
		case 'success':
			return sonner.success(message, config);
		case 'error':
			return sonner.error(message, config);
		case 'warning':
			return sonner.warning(message, config);
		case 'info':
			return sonner.message(message, config);
		case 'loading':
			return sonner.loading(message, config);
		default:
			return sonner.message(message, config);
	}
}

// Export individual methods for convenience
export const toast = {
	success: (message: string, description?: string) =>
		showToast({ type: 'success', message, description }),
	error: (message: string, description?: string) =>
		showToast({ type: 'error', message, description }),
	info: (message: string, description?: string) =>
		showToast({ type: 'info', message, description }),
	warning: (message: string, description?: string) =>
		showToast({ type: 'warning', message, description }),
	loading: (message: string, description?: string) =>
		showToast({ type: 'loading', message, description }),
	promise: sonner.promise,
	custom: sonner.custom,
	dismiss: sonner.dismiss
};

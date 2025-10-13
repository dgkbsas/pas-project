import { toast as sonner } from 'svelte-sonner';

/**
 * Toast notification system using svelte-sonner
 */
export const toast = {
  success: (message: string) => {
    return sonner.success(message);
  },
  
  error: (message: string) => {
    return sonner.error(message);
  },
  
  info: (message: string) => {
    return sonner.message(message);
  },
  
  warning: (message: string) => {
    return sonner.warning(message);
  },
  
  loading: (message: string) => {
    return sonner.loading(message);
  },
  
  promise: sonner.promise,
  custom: sonner.custom,
  dismiss: sonner.dismiss,
};

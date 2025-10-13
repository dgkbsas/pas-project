/**
 * Error Handling Utilities
 * Provides consistent error handling patterns across the application
 */

import { showToast } from '$lib/stores/notifications';

/**
 * Standard error response from API
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string>;
  statusCode?: number;
}

/**
 * Handles API fetch errors consistently
 * @param error - The caught error
 * @param fallbackMessage - Message to show if error is unknown
 */
export function handleFetchError(error: unknown, fallbackMessage: string = 'An error occurred'): void {
  console.error('Fetch error:', error);
  
  if (error instanceof Error) {
    showToast({ type: 'error', message: error.message || fallbackMessage });
  } else {
    showToast({ type: 'error', message: fallbackMessage });
  }
}

/**
 * Handles API response errors
 * @param response - Fetch response object
 * @param fallbackMessage - Message to show if no specific error message
 * @returns Promise that rejects if response is not ok
 */
export async function handleApiResponse(
  response: Response,
  fallbackMessage: string = 'Request failed'
): Promise<any> {
  if (!response.ok) {
    let errorMessage = fallbackMessage;
    
    try {
      const result = await response.json();
      if (result.message) {
        errorMessage = result.message;
      }
      
      // Show toast for error
      showToast({ type: 'error', message: errorMessage });
      
      // Return error details for caller to handle
      throw {
        message: errorMessage,
        errors: result.errors,
        statusCode: response.status,
      };
    } catch (err) {
      // If JSON parsing fails, use fallback
      showToast({ type: 'error', message: fallbackMessage });
      throw {
        message: fallbackMessage,
        statusCode: response.status,
      };
    }
  }
  
  return response.json();
}

/**
 * Wraps an async function with try-catch and loading state
 * @param fn - Async function to execute
 * @param loadingState - State object with loading property
 * @param errorMessage - Custom error message
 */
export async function withLoading<T>(
  fn: () => Promise<T>,
  loadingState: { loading: boolean },
  errorMessage?: string
): Promise<T | null> {
  loadingState.loading = true;
  
  try {
    return await fn();
  } catch (error) {
    handleFetchError(error, errorMessage);
    return null;
  } finally {
    loadingState.loading = false;
  }
}

/**
 * Creates a debounced function
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates required field
 */
export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

/**
 * Simple form validation helper
 */
export function validateForm(
  data: Record<string, any>,
  rules: Record<string, (value: any) => string | null>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const [field, validator] of Object.entries(rules)) {
    const error = validator(data[field]);
    if (error) {
      errors[field] = error;
    }
  }
  
  return errors;
}

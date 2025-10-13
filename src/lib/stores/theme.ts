import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

// Get initial theme from localStorage or default to 'system'
function getInitialTheme(): Theme {
  if (!browser) return 'system';
  
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  
  return 'system';
}

// Determine if dark mode should be active
function shouldUseDarkMode(theme: Theme): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  
  // System preference
  if (!browser) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Create the store
export const theme = writable<Theme>(getInitialTheme());

// Apply theme to document
export function applyTheme(newTheme: Theme) {
  if (!browser) return;
  
  const isDark = shouldUseDarkMode(newTheme);
  
  // Apply data-theme attribute
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  
  // Save to localStorage
  localStorage.setItem('theme', newTheme);
}

// Subscribe to theme changes
if (browser) {
  theme.subscribe((value) => {
    applyTheme(value);
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    theme.subscribe((currentTheme) => {
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    });
  });
}

// Toggle theme helper
export function toggleTheme() {
  theme.update((current) => {
    if (current === 'light') return 'dark';
    if (current === 'dark') return 'system';
    return 'light';
  });
}

// Set theme helper
export function setTheme(newTheme: Theme) {
  theme.set(newTheme);
}

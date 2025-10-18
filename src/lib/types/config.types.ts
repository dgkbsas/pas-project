/**
 * Configuration types
 * Defines company configuration options
 */

// Configuration item with key (immutable), value (label), and active status
export interface ConfigItem {
  key: string;        // Immutable identifier (slug) - auto-generated
  value: string;      // Display label - editable
  active: boolean;    // Soft delete flag
}

// Alert settings object
export interface AlertSettings {
  days_before_expiry: number;
  days_critical: number;
  notify_on_create: boolean;
}

// Email settings object (optional)
export interface EmailSettings {
  from?: string;
  reply_to?: string;
  smtp_host?: string;
  smtp_port?: number;
}

// Company configuration table structure (normalized - one row per company)
export interface CompanyConfig {
  company_id: string;
  currency: string | null;
  date_format: string | null;
  timezone: string | null;
  default_alert_days: number | null;
  payment_modes: ConfigItem[] | null;
  policy_types: ConfigItem[] | null;
  followup_types: ConfigItem[] | null;
  alert_settings: AlertSettings | null;
  email_settings: EmailSettings | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

// Insert/Update types
// Para insertar: todos los campos menos created_at y updated_at, pero respetando los nullables
export type CompanyConfigInsert = {
  company_id: string;
  currency?: string | null;
  date_format?: string | null;
  timezone?: string | null;
  default_alert_days?: number | null;
  payment_modes?: ConfigItem[] | null;
  policy_types?: ConfigItem[] | null;
  followup_types?: ConfigItem[] | null;
  alert_settings?: AlertSettings | null;
  email_settings?: EmailSettings | null;
  updated_by?: string | null;
};

// Para update: todos opcionales menos company_id, created_at y updated_at
export type CompanyConfigUpdate = Partial<Omit<CompanyConfig, 'company_id' | 'created_at' | 'updated_at'>>;

// Configuration field keys (for API)
export type ConfigFieldKey =
  | 'currency'
  | 'date_format'
  | 'timezone'
  | 'default_alert_days'
  | 'payment_modes'
  | 'policy_types'
  | 'followup_types'
  | 'alert_settings'
  | 'email_settings';

// Array configuration keys (fields that use ConfigItem[])
export const ARRAY_CONFIG_KEYS = [
  'payment_modes',
  'policy_types',
  'followup_types'
] as const;

export type ArrayConfigKey = typeof ARRAY_CONFIG_KEYS[number];

// Helper to generate key from value
export function generateConfigKey(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove accents
    .replace(/[^a-z0-9]+/g, '_')       // Replace non-alphanumeric with underscore
    .replace(/^_+|_+$/g, '');          // Trim underscores
}

// Helper to get active config items
export function getActiveItems(items: ConfigItem[] | undefined): ConfigItem[] {
  if (!items) return [];
  return items.filter(item => item.active);
}

/**
 * Configuration types
 * Defines company configuration options
 */

// Insurance company entry
export interface InsuranceCompany {
  id: string;
  name: string;
  code?: string;
  active: boolean;
}

// Company configuration stored as JSON
export interface CompanyConfiguration {
  // Insurance companies list
  insurance_companies?: InsuranceCompany[];
  
  // Policy types (in addition to default ones)
  custom_policy_types?: string[];
  
  // Payment modes
  payment_modes?: string[];
  
  // Followup types
  followup_types?: string[];
  
  // Alert settings
  default_alert_days?: number;
  
  // Other settings
  currency?: string; // Default: ARS (Pesos Argentinos)
  date_format?: string;
  timezone?: string;
}

// Configuration table structure
export interface Configuration {
  id: string;
  company_id: string;
  config_key: string;
  config_value: any; // JSON value
  created_at: string;
  updated_at: string;
}

// Configuration keys enum
export type ConfigKey = 
  | 'insurance_companies'
  | 'policy_types'
  | 'payment_modes'
  | 'followup_types'
  | 'alert_settings'
  | 'currency'
  | 'general_settings';

// System configuration keys (cannot be deleted, only edited)
export const SYSTEM_CONFIG_KEYS = [
  'payment_modes',
  'policy_types',
  'alert_settings',
  'followup_types',
  'currency'
] as const;

export type SystemConfigKey = typeof SYSTEM_CONFIG_KEYS[number];

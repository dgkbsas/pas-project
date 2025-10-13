/**
 * Policy related types
 * Defines the structure for insurance policy entities
 */

import type { Client } from './client.types';

// Policy types enum
export type PolicyType = 
  | 'auto'
  | 'home'
  | 'life'
  | 'health'
  | 'business'
  | 'other';

// Payment mode enum
export type PaymentMode = 
  | 'monthly'
  | 'quarterly'
  | 'semi-annual'
  | 'annual';

// Policy status for filtering
export type PolicyStatus = 
  | 'active'
  | 'inactive'
  | 'expiring_soon'
  | 'expired';

// Base policy interface matching database schema
export interface Policy {
  id: string;
  client_id: string;
  company_id: string;
  created_by: string;

  // Policy information
  policy_number: string | null;
  policy_type: PolicyType;
  insurer: string | null; // Insurance company name
  insurer_id: string | null; // Reference to insurance_companies table
  payment_mode: PaymentMode | null;

  // Dates
  start_date: string;
  expiry_date: string;
  review_date: string | null; // Review date for alerts

  // Vehicle specific (for auto policies)
  vehicle_plate: string | null;
  vehicle_brand: string | null;
  vehicle_model: string | null;

  // Financial information
  insured_sum: number | null; // Suma asegurada
  accessories: string | null; // Accesorios
  premium: number | null; // Premio
  endorsement: string | null; // Endoso

  // Additional information
  observations: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
  last_edited_by: string | null;
  active: boolean;
}

// Insert type
export type PolicyInsert = Omit<Policy, 'id' | 'created_at' | 'updated_at'>;

// Update type
export type PolicyUpdate = Partial<
  Omit<PolicyInsert, 'client_id' | 'company_id' | 'created_by'>
>;

// Extended policy with client information
export interface PolicyWithClient extends Policy {
  client?: Client;
  client_full_name?: string;
  days_until_expiry?: number;
  status?: PolicyStatus;
}

// Filter options for policy list
export interface PolicyFilterOptions {
  search?: string;
  status?: PolicyStatus | 'all';
  policy_type?: PolicyType[];
  insurer?: string[];
  payment_mode?: PaymentMode[];
  active_only?: boolean;
  client_id?: string;
  expiring_within_days?: number;
  sort_by?: 'created_at' | 'expiry_date' | 'policy_number' | 'policy_type';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API response types
export interface PolicyListResponse {
  policies: PolicyWithClient[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface PolicyDetailResponse {
  policy: PolicyWithClient;
}

// Policy alert types
export interface PolicyAlert {
  id: string;
  policy_id: string;
  user_id: string;
  alert_date: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

/**
 * Client related types
 * Defines the structure for client entities and related operations
 */

import type { PolicyType, PolicyStatus } from './policy.types';

// Base client interface matching database schema
export interface Client {
  id: string;
  company_id: string;
  created_by: string;

  // Personal information
  first_name: string;
  last_name: string;
  document_number: string | null;
  birth_date: string | null;

  // Contact information
  email_primary: string | null;
  email_secondary: string | null;
  phone: string | null;

  // Address
  address: string | null;
  postal_code: string | null;
  city: string | null;
  province: string | null;

  // Additional fields
  alias_pas: string | null;
  referred_by: string | null;
  observations: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
  last_edited_by: string | null;
  active: boolean;
}

// Insert type (excludes auto-generated fields)
export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'>;

// Update type (all fields optional except IDs)
export type ClientUpdate = Partial<Omit<ClientInsert, 'company_id' | 'created_by'>>;

// Simplified policy for client detail view
export interface PolicySummary {
  id: string;
  policy_number: string | null;
  policy_type: PolicyType;
  insurer: string | null;
  status?: PolicyStatus;
  start_date: string;
  renewal_date?: string;
  premium_amount?: number;
}

// Extended client with computed properties for UI
export interface ClientWithPolicies extends Client {
  policies?: PolicySummary[];
  active_policies_count?: number;
  total_policies_count?: number;
}

// Filter options for client list
export interface ClientFilterOptions {
  search?: string;
  active_only?: boolean;
  province?: string | null;
  city?: string | null;
  sort_by?: 'first_name' | 'last_name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// API response types
export interface ClientListResponse {
  clients: ClientWithPolicies[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ClientDetailResponse {
  client: ClientWithPolicies;
}

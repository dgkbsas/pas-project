/**
 * Central types export
 * Re-exports all types for easy import
 */

// Client types
export type {
  Client,
  ClientInsert,
  ClientUpdate,
  ClientWithPolicies,
  PolicySummary,
  ClientFilterOptions,
  ClientListResponse,
  ClientDetailResponse,
} from './client.types';

// Policy types
export type {
  Policy,
  PolicyInsert,
  PolicyUpdate,
  PolicyWithClient,
  PolicyFilterOptions,
  PolicyListResponse,
  PolicyDetailResponse,
  PolicyAlert,
  PolicyType,
  PaymentMode,
  PolicyStatus,
} from './policy.types';

// Configuration types
export type {
  InsuranceCompany,
  CompanyConfiguration,
  Configuration,
  ConfigKey,
} from './config.types';

// Re-export database types for backward compatibility
export type { Database } from './database.types';

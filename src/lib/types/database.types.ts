/**
 * Database types matching Supabase schema
 */

import type { UserRole, PolicyType, PaymentMode } from './enums';
import type { CompanyConfig, CompanyConfigInsert, CompanyConfigUpdate } from './config.types';

export interface Database {
	public: {
		Tables: {
			companies: {
				Row: Company;
				Insert: CompanyInsert;
				Update: CompanyUpdate;
			};
			users: {
				Row: User;
				Insert: UserInsert;
				Update: UserUpdate;
			};
			clients: {
				Row: Client;
				Insert: ClientInsert;
				Update: ClientUpdate;
			};
			policies: {
				Row: Policy;
				Insert: PolicyInsert;
				Update: PolicyUpdate;
			};
		policy_alerts: {
			Row: PolicyAlert;
			Insert: PolicyAlertInsert;
			Update: PolicyAlertUpdate;
		};
		policy_followups: {
			Row: PolicyFollowup;
			Insert: PolicyFollowupInsert;
			Update: PolicyFollowupUpdate;
		};
		insurance_companies: {
			Row: InsuranceCompany;
			Insert: InsuranceCompanyInsert;
			Update: InsuranceCompanyUpdate;
		};
		company_config: {
			Row: CompanyConfig;
			Insert: CompanyConfigInsert;
			Update: CompanyConfigUpdate;
		};
	};
	};
}

// Company types
export interface Company {
	id: string;
	name: string;
	address?: string | null;
	city?: string | null;
	postal_code?: string | null;
	phone?: string | null;
	created_at: string;
	updated_at: string;
	active: boolean;
}

export type CompanyInsert = Omit<Company, 'id' | 'created_at' | 'updated_at'>;
export type CompanyUpdate = Partial<CompanyInsert>;

// User types
export interface User {
	id: string;
	company_id: string;
	email: string;
	full_name: string | null;
	role: UserRole;
	alert_days_before_expiry: number;
	created_at: string;
	updated_at: string;
	active: boolean;
}

export type UserInsert = Omit<User, 'created_at' | 'updated_at'>;
export type UserUpdate = Partial<Omit<UserInsert, 'id'>>;

// Client types
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
	phone_landline: string | null;

	// Address
	address: string | null;
	street: string | null;
	street_number: string | null;
	floor: string | null;
	apartment: string | null;
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

export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type ClientUpdate = Partial<Omit<ClientInsert, 'company_id' | 'created_by'>>;

// Policy types
export interface Policy {
	id: string;
	client_id: string;
	company_id: string;
	created_by: string;

	// Policy information
	policy_number: string | null;
	policy_type: PolicyType;
	insurer: string | null;
	insurer_id: string | null; // NEW: Reference to insurance_companies
	payment_mode: PaymentMode | null;

	// Dates
	start_date: string;
	expiry_date: string;
	review_date: string | null; // NEW: Review date for alerts

	// Vehicle specific
	vehicle_plate: string | null;
	vehicle_brand: string | null;
	vehicle_model: string | null;

	// Financial information
	insured_sum: number | null; // NEW: Suma asegurada
	accessories: string | null; // NEW: Accesorios
	premium: number | null; // NEW: Premio
	endorsement: string | null; // NEW: Endoso

	// Additional information
	observations: string | null;

	// Metadata
	created_at: string;
	updated_at: string;
	last_edited_by: string | null;
	active: boolean;
}

export type PolicyInsert = Omit<Policy, 'id' | 'created_at' | 'updated_at'>;
export type PolicyUpdate = Partial<
	Omit<PolicyInsert, 'client_id' | 'company_id' | 'created_by'>
>;

// Policy Alert types
export interface PolicyAlert {
	id: string;
	policy_id: string;
	user_id: string;
	alert_date: string;
	message: string | null;
	is_read: boolean;
	created_at: string;
}

export type PolicyAlertInsert = Omit<PolicyAlert, 'id' | 'created_at'>;
export type PolicyAlertUpdate = Partial<Omit<PolicyAlertInsert, 'policy_id' | 'user_id'>>;

// Policy Followup types
export interface PolicyFollowup {
	id: string;
	policy_id: string;
	followup_type: string;
	date: string;
	description: string | null;
	status: string | null;
	alert_date: string | null; // Optional date for alert notification
	created_by: string;
	created_at: string;
	updated_at: string;
}

export type PolicyFollowupInsert = Omit<PolicyFollowup, 'id' | 'created_at' | 'updated_at'>;
export type PolicyFollowupUpdate = Partial<Omit<PolicyFollowupInsert, 'policy_id' | 'created_by'>>;

// Insurance Company types
export interface InsuranceCompany {
	id: string;
	company_id: string;
	name: string;
	code: string | null;
	contact_email: string | null;
	contact_phone: string | null;
	website: string | null;
	created_by: string;
	created_at: string;
	updated_at: string;
	active: boolean;
}

export type InsuranceCompanyInsert = Omit<InsuranceCompany, 'id' | 'created_at' | 'updated_at'>;
export type InsuranceCompanyUpdate = Partial<Omit<InsuranceCompanyInsert, 'company_id' | 'created_by'>>;

// Extended types with relations for UI
export interface ClientWithPolicies extends Client {
	policies?: Policy[];
	policy_count?: number;
}

export interface PolicyWithClient extends Policy {
	client?: Client;
}

export interface PolicyWithAlert extends Policy {
	alert?: PolicyAlert;
	days_until_expiry?: number;
}

// Company Invitation types
export interface CompanyInvitation {
	id: string;
	company_id: string;
	email: string;
	role: 'admin' | 'agent' | 'guest';
	token: string;
	expires_at: string;
	used_at: string | null;
	created_by: string;
	created_at: string;
}

// Alias for convenience
export type Invitation = CompanyInvitation;

// UI Helper types
export type ViewMode = 'grid' | 'list';
export type SortOrder = 'asc' | 'desc';

// Filter options
export interface ClientFilterOptions {
	q?: string;
	active?: boolean | null;
	province?: string | null;
	sortBy?: 'name' | 'created_at' | 'updated_at';
	order?: SortOrder;
}

export interface PolicyFilterOptions {
	q?: string;
	kind?: string | null;
	status?: 'active' | 'inactive' | null;
	dueFrom?: string | null;
	dueTo?: string | null;
	clientId?: string | null;
	sortBy?: 'due_date' | 'kind' | 'client' | 'created_at';
	order?: SortOrder;
}

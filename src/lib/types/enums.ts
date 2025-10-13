/**
 * Enums matching the database schema
 */

export enum UserRole {
	Admin = 'admin',
	Agent = 'agent',
	Guest = 'guest'
}

export enum PolicyType {
	Auto = 'auto', // Vehículos automotores
	Moto = 'moto', // Motocicletas
	Home = 'home', // Hogar
	Fire = 'fire', // Incendio
	VariousRisks = 'various_risks', // Riesgos varios
	CollectiveLife = 'collective_life', // Vida colectivo
	MandatoryLife = 'mandatory_life', // Vida obligatorio
	Transport = 'transport', // Transporte
	Technical = 'technical', // Seguro técnico
	CivilLiability = 'civil_liability', // Responsabilidad civil
	LifeOptions = 'life_options', // Opciones de vida
	Pets = 'pets', // Mascotas
	Malpractice = 'malpractice', // Mala praxis
	LifeInvestment = 'life_investment', // Inversión de vida
	Guarantee = 'guarantee', // Caución
	Consortium = 'consortium', // Consorcio
	PersonalAccidents = 'personal_accidents', // Accidentes personales
	ART = 'art', // ART (Aseguradora de Riesgos del Trabajo)
	Agricultural = 'agricultural', // Agrícola
	Other = 'other' // Otros
}

export enum PaymentMode {
	Monthly = 'monthly', // Mensual
	Quarterly = 'quarterly', // Trimestral
	Biannual = 'biannual', // Semestral
	Annual = 'annual', // Anual
	SinglePayment = 'single_payment' // Pago único
}

// Display labels for policy types (Spanish)
export const PolicyTypeLabels: Record<PolicyType, string> = {
	[PolicyType.Auto]: 'Vehículos (Auto)',
	[PolicyType.Moto]: 'Motocicletas',
	[PolicyType.Home]: 'Hogar',
	[PolicyType.Fire]: 'Incendio',
	[PolicyType.VariousRisks]: 'Riesgos Varios',
	[PolicyType.CollectiveLife]: 'Vida Colectivo',
	[PolicyType.MandatoryLife]: 'Vida Obligatorio',
	[PolicyType.Transport]: 'Transporte',
	[PolicyType.Technical]: 'Seguro Técnico',
	[PolicyType.CivilLiability]: 'Responsabilidad Civil',
	[PolicyType.LifeOptions]: 'Opciones de Vida',
	[PolicyType.Pets]: 'Mascotas',
	[PolicyType.Malpractice]: 'Mala Praxis',
	[PolicyType.LifeInvestment]: 'Inversión de Vida',
	[PolicyType.Guarantee]: 'Caución',
	[PolicyType.Consortium]: 'Consorcio',
	[PolicyType.PersonalAccidents]: 'Accidentes Personales',
	[PolicyType.ART]: 'ART',
	[PolicyType.Agricultural]: 'Agrícola',
	[PolicyType.Other]: 'Otros'
};

// Display labels for payment modes (Spanish)
export const PaymentModeLabels: Record<PaymentMode, string> = {
	[PaymentMode.Monthly]: 'Mensual',
	[PaymentMode.Quarterly]: 'Trimestral',
	[PaymentMode.Biannual]: 'Semestral',
	[PaymentMode.Annual]: 'Anual',
	[PaymentMode.SinglePayment]: 'Pago Único'
};

// Display labels for user roles (Spanish)
export const UserRoleLabels: Record<UserRole, string> = {
	[UserRole.Admin]: 'Administrador',
	[UserRole.Agent]: 'Agente',
	[UserRole.Guest]: 'Invitado'
};

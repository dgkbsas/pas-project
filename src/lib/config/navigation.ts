import { LayoutDashboard, Users, FileText, Settings } from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export interface NavigationItem {
	name: string;
	href: string;
	icon: ComponentType;
}

export const navigationItems: NavigationItem[] = [
	{
		name: 'Dashboard',
		href: '/dashboard',
		icon: LayoutDashboard
	},
	{
		name: 'Clientes',
		href: '/clientes',
		icon: Users
	},
	{
		name: 'Pólizas',
		href: '/polizas',
		icon: FileText
	}
	// Configuración se accede desde el menú de usuario
];

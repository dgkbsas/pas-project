
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/(app)" | "/" | "/api" | "/api/clients" | "/api/clients/search" | "/api/clients/[id]" | "/api/company" | "/api/config" | "/api/config/[key]" | "/api/debug" | "/api/debug/policies-schema" | "/api/followups" | "/api/followups/[id]" | "/api/insurance-companies" | "/api/insurance-companies/[id]" | "/api/invitations" | "/api/invitations/validate" | "/api/policies" | "/api/policies/[id]" | "/api/policies/[id]/followups" | "/auth" | "/auth/callback" | "/auth/login" | "/auth/signup" | "/(app)/clientes" | "/(app)/clientes/nuevo" | "/(app)/clientes/[id]" | "/(app)/clientes/[id]/editar" | "/(app)/configuracion" | "/(app)/dashboard" | "/(app)/polizas" | "/(app)/polizas/nuevo" | "/(app)/polizas/[id]" | "/(app)/polizas/[id]/editar";
		RouteParams(): {
			"/api/clients/[id]": { id: string };
			"/api/config/[key]": { key: string };
			"/api/followups/[id]": { id: string };
			"/api/insurance-companies/[id]": { id: string };
			"/api/policies/[id]": { id: string };
			"/api/policies/[id]/followups": { id: string };
			"/(app)/clientes/[id]": { id: string };
			"/(app)/clientes/[id]/editar": { id: string };
			"/(app)/polizas/[id]": { id: string };
			"/(app)/polizas/[id]/editar": { id: string }
		};
		LayoutParams(): {
			"/(app)": { id?: string };
			"/": { id?: string; key?: string };
			"/api": { id?: string; key?: string };
			"/api/clients": { id?: string };
			"/api/clients/search": Record<string, never>;
			"/api/clients/[id]": { id: string };
			"/api/company": Record<string, never>;
			"/api/config": { key?: string };
			"/api/config/[key]": { key: string };
			"/api/debug": Record<string, never>;
			"/api/debug/policies-schema": Record<string, never>;
			"/api/followups": { id?: string };
			"/api/followups/[id]": { id: string };
			"/api/insurance-companies": { id?: string };
			"/api/insurance-companies/[id]": { id: string };
			"/api/invitations": Record<string, never>;
			"/api/invitations/validate": Record<string, never>;
			"/api/policies": { id?: string };
			"/api/policies/[id]": { id: string };
			"/api/policies/[id]/followups": { id: string };
			"/auth": Record<string, never>;
			"/auth/callback": Record<string, never>;
			"/auth/login": Record<string, never>;
			"/auth/signup": Record<string, never>;
			"/(app)/clientes": { id?: string };
			"/(app)/clientes/nuevo": Record<string, never>;
			"/(app)/clientes/[id]": { id: string };
			"/(app)/clientes/[id]/editar": { id: string };
			"/(app)/configuracion": Record<string, never>;
			"/(app)/dashboard": Record<string, never>;
			"/(app)/polizas": { id?: string };
			"/(app)/polizas/nuevo": Record<string, never>;
			"/(app)/polizas/[id]": { id: string };
			"/(app)/polizas/[id]/editar": { id: string }
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/clients" | "/api/clients/" | "/api/clients/search" | "/api/clients/search/" | `/api/clients/${string}` & {} | `/api/clients/${string}/` & {} | "/api/company" | "/api/company/" | "/api/config" | "/api/config/" | `/api/config/${string}` & {} | `/api/config/${string}/` & {} | "/api/debug" | "/api/debug/" | "/api/debug/policies-schema" | "/api/debug/policies-schema/" | "/api/followups" | "/api/followups/" | `/api/followups/${string}` & {} | `/api/followups/${string}/` & {} | "/api/insurance-companies" | "/api/insurance-companies/" | `/api/insurance-companies/${string}` & {} | `/api/insurance-companies/${string}/` & {} | "/api/invitations" | "/api/invitations/" | "/api/invitations/validate" | "/api/invitations/validate/" | "/api/policies" | "/api/policies/" | `/api/policies/${string}` & {} | `/api/policies/${string}/` & {} | `/api/policies/${string}/followups` & {} | `/api/policies/${string}/followups/` & {} | "/auth" | "/auth/" | "/auth/callback" | "/auth/callback/" | "/auth/login" | "/auth/login/" | "/auth/signup" | "/auth/signup/" | "/clientes" | "/clientes/" | "/clientes/nuevo" | "/clientes/nuevo/" | `/clientes/${string}` & {} | `/clientes/${string}/` & {} | `/clientes/${string}/editar` & {} | `/clientes/${string}/editar/` & {} | "/configuracion" | "/configuracion/" | "/dashboard" | "/dashboard/" | "/polizas" | "/polizas/" | "/polizas/nuevo" | "/polizas/nuevo/" | `/polizas/${string}` & {} | `/polizas/${string}/` & {} | `/polizas/${string}/editar` & {} | `/polizas/${string}/editar/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/.DS_Store" | "/favicon.ico" | "/favicon.png" | "/icons/apple-touch-icon.png" | "/icons/icon-128x128.png" | "/icons/icon-144x144.png" | "/icons/icon-152x152.png" | "/icons/icon-192x192.png" | "/icons/icon-384x384.png" | "/icons/icon-512x512.png" | "/icons/icon-72x72.png" | "/icons/icon-96x96.png" | "/manifest.json" | string & {};
	}
}
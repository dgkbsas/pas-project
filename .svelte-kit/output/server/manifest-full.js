export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([".DS_Store","favicon.ico","favicon.png","icons/apple-touch-icon.png","icons/icon-128x128.png","icons/icon-144x144.png","icons/icon-152x152.png","icons/icon-192x192.png","icons/icon-384x384.png","icons/icon-512x512.png","icons/icon-72x72.png","icons/icon-96x96.png","manifest.json"]),
	mimeTypes: {".png":"image/png",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.oZJMxwzW.js",app:"_app/immutable/entry/app.fMAakEY2.js",imports:["_app/immutable/entry/start.oZJMxwzW.js","_app/immutable/chunks/DboXdvGe.js","_app/immutable/chunks/P-h-QmmT.js","_app/immutable/chunks/DXalFYC5.js","_app/immutable/chunks/W0raZGAH.js","_app/immutable/entry/app.fMAakEY2.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/DXalFYC5.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/P-h-QmmT.js","_app/immutable/chunks/DgS_HarA.js","_app/immutable/chunks/2cUHOQ7Q.js","_app/immutable/chunks/BjGM86Mo.js","_app/immutable/chunks/BkTacmYQ.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js')),
			__memo(() => import('./nodes/8.js')),
			__memo(() => import('./nodes/9.js')),
			__memo(() => import('./nodes/10.js')),
			__memo(() => import('./nodes/11.js')),
			__memo(() => import('./nodes/12.js')),
			__memo(() => import('./nodes/13.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/(app)/actividades",
				pattern: /^\/actividades\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/api/activities",
				pattern: /^\/api\/activities\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/activities/_server.ts.js'))
			},
			{
				id: "/api/auth/logout",
				pattern: /^\/api\/auth\/logout\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/auth/logout/_server.ts.js'))
			},
			{
				id: "/api/clients",
				pattern: /^\/api\/clients\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/clients/_server.ts.js'))
			},
			{
				id: "/api/clients/search",
				pattern: /^\/api\/clients\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/clients/search/_server.ts.js'))
			},
			{
				id: "/api/clients/[id]",
				pattern: /^\/api\/clients\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/clients/_id_/_server.ts.js'))
			},
			{
				id: "/api/company",
				pattern: /^\/api\/company\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/company/_server.ts.js'))
			},
			{
				id: "/api/config",
				pattern: /^\/api\/config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/config/_server.ts.js'))
			},
			{
				id: "/api/config/[key]",
				pattern: /^\/api\/config\/([^/]+?)\/?$/,
				params: [{"name":"key","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/config/_key_/_server.ts.js'))
			},
			{
				id: "/api/debug/policies-schema",
				pattern: /^\/api\/debug\/policies-schema\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/debug/policies-schema/_server.ts.js'))
			},
			{
				id: "/api/followups/[id]",
				pattern: /^\/api\/followups\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/followups/_id_/_server.ts.js'))
			},
			{
				id: "/api/insurance-companies",
				pattern: /^\/api\/insurance-companies\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/insurance-companies/_server.ts.js'))
			},
			{
				id: "/api/insurance-companies/[id]",
				pattern: /^\/api\/insurance-companies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/insurance-companies/_id_/_server.ts.js'))
			},
			{
				id: "/api/invitations",
				pattern: /^\/api\/invitations\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/invitations/_server.ts.js'))
			},
			{
				id: "/api/invitations/validate",
				pattern: /^\/api\/invitations\/validate\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/invitations/validate/_server.ts.js'))
			},
			{
				id: "/api/notifications",
				pattern: /^\/api\/notifications\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/notifications/_server.ts.js'))
			},
			{
				id: "/api/policies",
				pattern: /^\/api\/policies\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/policies/_server.ts.js'))
			},
			{
				id: "/api/policies/[id]",
				pattern: /^\/api\/policies\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/policies/_id_/_server.ts.js'))
			},
			{
				id: "/api/policies/[id]/followups",
				pattern: /^\/api\/policies\/([^/]+?)\/followups\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/policies/_id_/followups/_server.ts.js'))
			},
			{
				id: "/auth/callback",
				pattern: /^\/auth\/callback\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/auth/callback/_server.ts.js'))
			},
			{
				id: "/auth/login",
				pattern: /^\/auth\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/(app)/clientes",
				pattern: /^\/clientes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(app)/clientes/nuevo",
				pattern: /^\/clientes\/nuevo\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(app)/clientes/[id]",
				pattern: /^\/clientes\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(app)/clientes/[id]/editar",
				pattern: /^\/clientes\/([^/]+?)\/editar\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(app)/configuracion",
				pattern: /^\/configuracion\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(app)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(app)/polizas",
				pattern: /^\/polizas\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/(app)/polizas/nuevo",
				pattern: /^\/polizas\/nuevo\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

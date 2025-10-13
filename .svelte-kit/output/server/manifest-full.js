export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.Be_rappm.js",app:"_app/immutable/entry/app.Dy2DksG5.js",imports:["_app/immutable/entry/start.Be_rappm.js","_app/immutable/chunks/CdRlIqj1.js","_app/immutable/chunks/B5RiWETq.js","_app/immutable/chunks/T0dPp4D2.js","_app/immutable/entry/app.Dy2DksG5.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/T0dPp4D2.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B5RiWETq.js","_app/immutable/chunks/iIrk5DBN.js","_app/immutable/chunks/Bc04Jkhx.js","_app/immutable/chunks/DmV6kigd.js","_app/immutable/chunks/x5bn8cLp.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
			__memo(() => import('./nodes/13.js')),
			__memo(() => import('./nodes/14.js'))
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
				id: "/api/clients",
				pattern: /^\/api\/clients\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/clients/_server.ts.js'))
			},
			{
				id: "/api/clients/[id]",
				pattern: /^\/api\/clients\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/clients/_id_/_server.ts.js'))
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
				id: "/auth/signup",
				pattern: /^\/auth\/signup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/(app)/clientes",
				pattern: /^\/clientes\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/(app)/clientes/nuevo",
				pattern: /^\/clientes\/nuevo\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(app)/clientes/[id]",
				pattern: /^\/clientes\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(app)/clientes/[id]/editar",
				pattern: /^\/clientes\/([^/]+?)\/editar\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(app)/configuracion",
				pattern: /^\/configuracion\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(app)/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(app)/polizas",
				pattern: /^\/polizas\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(app)/polizas/nuevo",
				pattern: /^\/polizas\/nuevo\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(app)/polizas/[id]/editar",
				pattern: /^\/polizas\/([^/]+?)\/editar\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 11 },
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

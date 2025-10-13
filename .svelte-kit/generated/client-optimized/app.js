export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10'),
	() => import('./nodes/11'),
	() => import('./nodes/12'),
	() => import('./nodes/13'),
	() => import('./nodes/14')
];

export const server_loads = [0,2];

export const dictionary = {
		"/": [3],
		"/auth/login": [~13],
		"/auth/signup": [~14],
		"/(app)/clientes": [4,[2]],
		"/(app)/clientes/nuevo": [7,[2]],
		"/(app)/clientes/[id]": [~5,[2]],
		"/(app)/clientes/[id]/editar": [~6,[2]],
		"/(app)/configuracion": [~8,[2]],
		"/(app)/dashboard": [~9,[2]],
		"/(app)/polizas": [10,[2]],
		"/(app)/polizas/nuevo": [~12,[2]],
		"/(app)/polizas/[id]/editar": [~11,[2]]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
	
	reroute: (() => {}),
	transport: {}
};

export const decoders = Object.fromEntries(Object.entries(hooks.transport).map(([k, v]) => [k, v.decode]));

export const hash = false;

export const decode = (type, value) => decoders[type](value);

export { default as root } from '../root.js';
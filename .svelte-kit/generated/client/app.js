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
		"/(app)/actividades": [4,[2]],
		"/auth/login": [~14],
		"/(app)/clientes": [5,[2]],
		"/(app)/clientes/nuevo": [8,[2]],
		"/(app)/clientes/[id]": [~6,[2]],
		"/(app)/clientes/[id]/editar": [~7,[2]],
		"/(app)/configuracion": [~9,[2]],
		"/(app)/dashboard": [~10,[2]],
		"/(app)/polizas": [11,[2]],
		"/(app)/polizas/nuevo": [~12,[2]],
		"/(app)/seguimientos": [~13,[2]]
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
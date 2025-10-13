import * as server from '../entries/pages/(app)/dashboard/_page.server.ts.js';

export const index = 9;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/9.Dh5bEhGH.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/T0dPp4D2.js","_app/immutable/chunks/D_uDkMHU.js","_app/immutable/chunks/Bc04Jkhx.js","_app/immutable/chunks/BjbfY3vJ.js","_app/immutable/chunks/BqiCCWh5.js","_app/immutable/chunks/BIcU5xmk.js","_app/immutable/chunks/Ch5CQVJw.js","_app/immutable/chunks/iIrk5DBN.js","_app/immutable/chunks/x5bn8cLp.js","_app/immutable/chunks/BpcvKk5C.js","_app/immutable/chunks/CZE326ez.js","_app/immutable/chunks/Yaf_2f41.js","_app/immutable/chunks/BqsbIqZd.js","_app/immutable/chunks/C-YwpxQJ.js","_app/immutable/chunks/CxVX8zWa.js"];
export const stylesheets = ["_app/immutable/assets/Card.C-I70jqP.css","_app/immutable/assets/Button.CBghJH9S.css","_app/immutable/assets/9.BJph8LU6.css","_app/immutable/assets/Badge.DTOck518.css"];
export const fonts = [];

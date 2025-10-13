import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.9EeSzffr.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/B5RiWETq.js","_app/immutable/chunks/T0dPp4D2.js","_app/immutable/chunks/x5bn8cLp.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/CdRlIqj1.js","_app/immutable/chunks/iIrk5DBN.js","_app/immutable/chunks/D_uDkMHU.js","_app/immutable/chunks/BjbfY3vJ.js","_app/immutable/chunks/BqiCCWh5.js","_app/immutable/chunks/DmV6kigd.js","_app/immutable/chunks/OKJ9g5YP.js","_app/immutable/chunks/Bc04Jkhx.js","_app/immutable/chunks/Yaf_2f41.js","_app/immutable/chunks/C_IN3KhU.js"];
export const stylesheets = ["_app/immutable/assets/0.D9dLZKmk.css"];
export const fonts = [];

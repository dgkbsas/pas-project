import * as server from '../entries/pages/(app)/dashboard/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.DpLt1Vrg.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DXalFYC5.js","_app/immutable/chunks/DgS_HarA.js","_app/immutable/chunks/CCesXY4h.js","_app/immutable/chunks/CiAFSiaO.js","_app/immutable/chunks/2cUHOQ7Q.js","_app/immutable/chunks/CXQWPrWa.js","_app/immutable/chunks/DD2hwmqD.js","_app/immutable/chunks/BkTacmYQ.js","_app/immutable/chunks/ey38HHQe.js","_app/immutable/chunks/BtQN14_f.js","_app/immutable/chunks/D3fhBnoc.js","_app/immutable/chunks/Wd1UXAwi.js","_app/immutable/chunks/CDduCnYr.js","_app/immutable/chunks/B2p_ebVs.js"];
export const stylesheets = ["_app/immutable/assets/Card.BR8b92xV.css","_app/immutable/assets/Button.CBghJH9S.css","_app/immutable/assets/10.RCrddtiY.css","_app/immutable/assets/Badge.CZrn8nSr.css"];
export const fonts = [];

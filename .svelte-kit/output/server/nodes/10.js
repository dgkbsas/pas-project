import * as server from '../entries/pages/(app)/dashboard/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.17X4fB_c.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/dGHTYzhB.js","_app/immutable/chunks/_danfitL.js","_app/immutable/chunks/X3gEIfGK.js","_app/immutable/chunks/BZZkyLtE.js","_app/immutable/chunks/CfIVFlu0.js","_app/immutable/chunks/Ba6H9hDA.js","_app/immutable/chunks/D80h1qkp.js","_app/immutable/chunks/pnKjlpSc.js","_app/immutable/chunks/DOI_CNwM.js","_app/immutable/chunks/DaxW58Sj.js","_app/immutable/chunks/Bf0aZHXT.js","_app/immutable/chunks/DblrYRE4.js","_app/immutable/chunks/B-dffMKV.js","_app/immutable/chunks/BOk7XFuN.js"];
export const stylesheets = ["_app/immutable/assets/Card.BR8b92xV.css","_app/immutable/assets/Button.CBghJH9S.css","_app/immutable/assets/10.RCrddtiY.css","_app/immutable/assets/Badge.CZrn8nSr.css"];
export const fonts = [];

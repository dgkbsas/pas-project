import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.C4zK_q2n.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DFUbiISE.js","_app/immutable/chunks/BKJL6YfG.js","_app/immutable/chunks/B-WhYZDZ.js","_app/immutable/chunks/C1FmrZbK.js","_app/immutable/chunks/EB3MSLgs.js","_app/immutable/chunks/D-f8WZxc.js","_app/immutable/chunks/CX_YFbLR.js","_app/immutable/chunks/BpKyf_Cv.js","_app/immutable/chunks/Dk1W01op.js","_app/immutable/chunks/1cUr6nmd.js","_app/immutable/chunks/YpAcehqH.js","_app/immutable/chunks/CSW8TH0X.js","_app/immutable/chunks/DOky0DoK.js","_app/immutable/chunks/CV0I_qeG.js"];
export const stylesheets = ["_app/immutable/assets/0.CxbN_4Q4.css"];
export const fonts = [];

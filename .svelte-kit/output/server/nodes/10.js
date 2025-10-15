import * as server from '../entries/pages/(app)/dashboard/_page.server.ts.js';

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/dashboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/(app)/dashboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/10.BU0nYqjq.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BKJL6YfG.js","_app/immutable/chunks/CX_YFbLR.js","_app/immutable/chunks/BpKyf_Cv.js","_app/immutable/chunks/Dk1W01op.js","_app/immutable/chunks/CSW8TH0X.js","_app/immutable/chunks/BcoWetQX.js","_app/immutable/chunks/Dltoj_Hs.js","_app/immutable/chunks/B-WhYZDZ.js","_app/immutable/chunks/PkYitcBM.js","_app/immutable/chunks/ApxsD9uX.js","_app/immutable/chunks/DOky0DoK.js","_app/immutable/chunks/Cv8LfVAm.js","_app/immutable/chunks/BRqKrbZo.js","_app/immutable/chunks/Cb1H4-Fo.js"];
export const stylesheets = ["_app/immutable/assets/Card.BR8b92xV.css","_app/immutable/assets/Button.CBghJH9S.css","_app/immutable/assets/10.RCrddtiY.css","_app/immutable/assets/Badge.CZrn8nSr.css"];
export const fonts = [];

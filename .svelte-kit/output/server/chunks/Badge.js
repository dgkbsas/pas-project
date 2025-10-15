import { V as attr_class, a0 as stringify } from "./index2.js";
/* empty css                                    */
function Badge($$renderer, $$props) {
  let { variant = "default", class: className = "", children } = $$props;
  $$renderer.push(`<span${attr_class(`badge badge-${stringify(variant)} ${stringify(className)}`, "svelte-16wd81y")}>`);
  children?.($$renderer);
  $$renderer.push(`<!----></span>`);
}
export {
  Badge as B
};

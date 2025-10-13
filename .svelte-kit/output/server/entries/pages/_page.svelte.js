import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { V as attr_class, a0 as stringify } from "../../chunks/index2.js";
/* empty css                                                 */
function Spinner($$renderer, $$props) {
  let { size = "md", class: className = "" } = $$props;
  $$renderer.push(`<div${attr_class(`spinner spinner-${stringify(size)} ${stringify(className)}`, "svelte-7uvg3c")} role="status"><span class="sr-only">Cargando...</span></div>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    $$renderer2.push(`<div class="loading-container svelte-1uha8ag">`);
    Spinner($$renderer2, { size: "lg" });
    $$renderer2.push(`<!----> <p class="svelte-1uha8ag">Cargando...</p></div>`);
  });
}
export {
  _page as default
};

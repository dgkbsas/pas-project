import { V as attr_class, W as attr, Y as ensure_array_like, a4 as slot, a5 as bind_props } from "./index2.js";
import { k as fallback } from "./utils2.js";
import { e as escape_html } from "./context.js";
function Tabs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let tabs = fallback($$props["tabs"], () => [], true);
    let activeTab = fallback($$props["activeTab"], "");
    let variant = fallback($$props["variant"], "line");
    let size = fallback($$props["size"], "md");
    let fullWidth = fallback($$props["fullWidth"], false);
    $$renderer2.push(`<div${attr_class("tabs svelte-h216gr", void 0, { "full-width": fullWidth })}${attr("data-variant", variant)}${attr("data-size", size)}><div class="tabs-list svelte-h216gr" role="tablist"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button type="button" role="tab"${attr_class("tab svelte-h216gr", void 0, { "active": activeTab === tab.id, "disabled": tab.disabled })}${attr("aria-selected", activeTab === tab.id)}${attr("disabled", tab.disabled, true)}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="tabs-content svelte-h216gr" role="tabpanel"><!--[-->`);
    slot($$renderer2, $$props, "default", {});
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { tabs, activeTab, variant, size, fullWidth });
  });
}
export {
  Tabs as T
};

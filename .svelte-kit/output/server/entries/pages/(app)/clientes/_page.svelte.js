import { a6 as head, W as attr, Y as ensure_array_like } from "../../../../chunks/index2.js";
import { g as goto } from "../../../../chunks/client.js";
import { B as Button } from "../../../../chunks/Button.js";
/* empty css                                                     */
import { P as Plus } from "../../../../chunks/EmptyState.svelte_svelte_type_style_lang.js";
import { S as Search, a as Skeleton } from "../../../../chunks/Skeleton.js";
import "../../../../chunks/notifications.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let search = "";
    let showInactive = false;
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Clientes - PAS Manager</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-1hp9571"><div class="page-header svelte-1hp9571"><div><h1 class="svelte-1hp9571">Clientes</h1> <p class="svelte-1hp9571">Gestiona tus clientes y su información</p></div> `);
    Button($$renderer2, {
      variant: "primary",
      onclick: () => goto(),
      children: ($$renderer3) => {
        Plus($$renderer3, { size: 18 });
        $$renderer3.push(`<!----> Nuevo Cliente`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="filters svelte-1hp9571"><div class="search-box svelte-1hp9571">`);
    Search($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar clientes..."${attr("value", search)} class="svelte-1hp9571"/></div> <div class="filter-options svelte-1hp9571"><label class="checkbox-label svelte-1hp9571"><input type="checkbox"${attr("checked", showInactive, true)} class="svelte-1hp9571"/> <span class="svelte-1hp9571">Mostrar inactivos</span></label></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="skeleton-list svelte-1hp9571"><!--[-->`);
      const each_array = ensure_array_like(Array(5));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        Skeleton($$renderer2, { height: "60px" });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};

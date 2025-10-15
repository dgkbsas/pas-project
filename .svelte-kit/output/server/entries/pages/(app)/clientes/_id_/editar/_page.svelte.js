import { a1 as store_get, a6 as head, a2 as unsubscribe_stores } from "../../../../../../chunks/index2.js";
import { g as goto } from "../../../../../../chunks/client.js";
import { p as page } from "../../../../../../chunks/stores.js";
import { B as Button } from "../../../../../../chunks/Button.js";
/* empty css                                                           */
/* empty css                                                          */
/* empty css                                                                */
/* empty css                                                                         */
import "../../../../../../chunks/notifications.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.id;
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Editar Cliente - PAS Manager</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-tr29t"><div class="page-header svelte-tr29t"><div class="svelte-tr29t">`);
    Button($$renderer2, {
      variant: "ghost",
      size: "sm",
      onclick: () => goto(),
      children: ($$renderer3) => {
        Arrow_left($$renderer3, { size: 18 });
        $$renderer3.push(`<!----> Volver`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <h1 class="svelte-tr29t">Editar Cliente</h1> <p class="svelte-tr29t">Modifica los datos del cliente</p></div></div> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-state svelte-tr29t"><p class="svelte-tr29t">Cargando datos del cliente...</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};

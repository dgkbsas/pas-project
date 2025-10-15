import { a6 as head, V as attr_class, W as attr, Y as ensure_array_like } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { F as Funnel, S as Skeleton } from "../../../../chunks/Skeleton.js";
/* empty css                                                          */
/* empty css                                                      */
/* empty css                                                     */
import { X } from "../../../../chunks/x.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { A as Arrow_down } from "../../../../chunks/arrow-down.js";
import { e as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let activities = [];
    let total = 0;
    let appliedFilters = { types: [] };
    const activeFiltersCount = () => {
      let count = appliedFilters.types.length;
      return count;
    };
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Actividades - PAS Manager</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-wernd1"><div class="page-header svelte-wernd1"><div class="svelte-wernd1"><h1 class="svelte-wernd1">Actividades Recientes</h1> <p class="svelte-wernd1">Historial completo de actividad en el sistema</p></div></div> <div class="filters-toolbar svelte-wernd1"><div class="toolbar-actions svelte-wernd1"><button${attr_class("filter-btn svelte-wernd1", void 0, { "active": activeFiltersCount() > 0 })} title="Filtros">`);
    Funnel($$renderer2, { size: 18 });
    $$renderer2.push(`<!----> `);
    if (activeFiltersCount() > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="filter-badge svelte-wernd1">${escape_html(activeFiltersCount())}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    if (activeFiltersCount() > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="clear-filters-btn svelte-wernd1" title="Limpiar filtros">`);
      X($$renderer2, { size: 18 });
      $$renderer2.push(`<!----> Limpiar filtros</button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <button class="sort-btn svelte-wernd1"${attr("title", "Descendente")}>`);
    Calendar($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Fecha `);
    {
      $$renderer2.push("<!--[!-->");
      Arrow_down($$renderer2, { size: 16 });
    }
    $$renderer2.push(`<!--]--></button> <div class="results-count svelte-wernd1">`);
    if (activities.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="count-skeleton svelte-wernd1"></span>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="count-text svelte-wernd1">${escape_html(activities.length)}</span> <span class="count-separator svelte-wernd1">/</span> <span class="count-total svelte-wernd1">${escape_html(total)}</span>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="skeleton-list svelte-wernd1"><!--[-->`);
      const each_array = ensure_array_like(Array(10));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        Skeleton($$renderer2, { height: "80px" });
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};

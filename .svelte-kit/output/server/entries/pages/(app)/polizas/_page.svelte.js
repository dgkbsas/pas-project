import { a3 as sanitize_props, _ as spread_props, a4 as slot, V as attr_class, a5 as bind_props, a6 as head, W as attr, Y as ensure_array_like } from "../../../../chunks/index2.js";
import { g as goto } from "../../../../chunks/client.js";
import { B as Button } from "../../../../chunks/Button.js";
import { P as Plus } from "../../../../chunks/EmptyState.svelte_svelte_type_style_lang.js";
import { S as Search, a as Skeleton } from "../../../../chunks/Skeleton.js";
import { S as Select } from "../../../../chunks/Select.js";
/* empty css                                                     */
import { I as Icon } from "../../../../chunks/Icon.js";
import { X } from "../../../../chunks/x.js";
import { e as escape_html } from "../../../../chunks/context.js";
import "../../../../chunks/notifications.js";
function Funnel($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  /**
   * @license lucide-svelte v0.545.0 - ISC
   *
   * ISC License
   *
   * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2023 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2025.
   *
   * Permission to use, copy, modify, and/or distribute this software for any
   * purpose with or without fee is hereby granted, provided that the above
   * copyright notice and this permission notice appear in all copies.
   *
   * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
   * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
   * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
   * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
   * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
   * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
   * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
   *
   * ---
   *
   * The MIT License (MIT) (for portions derived from Feather)
   *
   * Copyright (c) 2013-2023 Cole Bemis
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   */
  const iconNode = [
    [
      "path",
      {
        "d": "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "funnel" },
    $$sanitized_props,
    {
      /**
       * @component @name Funnel
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMjBhMSAxIDAgMCAwIC41NTMuODk1bDIgMUExIDEgMCAwIDAgMTQgMjF2LTdhMiAyIDAgMCAxIC41MTctMS4zNDFMMjEuNzQgNC42N0ExIDEgMCAwIDAgMjEgM0gzYTEgMSAwIDAgMC0uNzQyIDEuNjdsNy4yMjUgNy45ODlBMiAyIDAgMCAxIDEwIDE0eiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/funnel
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function FilterPopup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = false, activeFiltersCount = 0, onClose, children } = $$props;
    $$renderer2.push(`<div class="filter-popup svelte-aysfzr"><button${attr_class("filter-trigger svelte-aysfzr", void 0, { "active": open || activeFiltersCount > 0 })} title="Filtros" aria-label="Abrir filtros">`);
    Funnel($$renderer2, { size: 18 });
    $$renderer2.push(`<!----> `);
    if (activeFiltersCount > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="filter-badge svelte-aysfzr">${escape_html(activeFiltersCount)}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    if (open) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="filter-dropdown svelte-aysfzr"><div class="filter-header svelte-aysfzr"><span class="filter-title svelte-aysfzr">Filtros</span> <button class="close-btn svelte-aysfzr" aria-label="Cerrar">`);
      X($$renderer2, { size: 16 });
      $$renderer2.push(`<!----></button></div> <div class="filter-content svelte-aysfzr">`);
      children?.($$renderer2);
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { open });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let search = "";
    let statusFilter = "all";
    let sortBy = "created_at";
    let sortOrder = "desc";
    let showInactive = false;
    let filterPopupOpen = false;
    const statusOptions = [
      { value: "all", label: "Todos los estados" },
      { value: "active", label: "Activa" },
      { value: "inactive", label: "Inactiva" },
      { value: "expiring_soon", label: "Por vencer" }
    ];
    const sortOptions = [
      { value: "created_at", label: "Fecha de creación" },
      { value: "expiry_date", label: "Fecha de vencimiento" },
      { value: "policy_number", label: "Número de póliza" },
      { value: "policy_type", label: "Tipo de póliza" }
    ];
    const activeFiltersCount = () => {
      let count = 0;
      if (statusFilter !== "all") count++;
      return count;
    };
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head($$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Pólizas - PAS Manager</title>`);
        });
      });
      $$renderer3.push(`<div class="page svelte-17pngxe"><div class="page-header svelte-17pngxe"><div class="svelte-17pngxe"><h1 class="svelte-17pngxe">Pólizas</h1> <p class="svelte-17pngxe">Gestiona todas las pólizas de seguros</p></div> `);
      Button($$renderer3, {
        variant: "primary",
        onclick: () => goto(),
        children: ($$renderer4) => {
          Plus($$renderer4, { size: 18 });
          $$renderer4.push(`<!----> Nueva Póliza`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> <div class="filters-toolbar svelte-17pngxe"><div class="search-box svelte-17pngxe">`);
      Search($$renderer3, { size: 20 });
      $$renderer3.push(`<!----> <input type="text" placeholder="Buscar pólizas..."${attr("value", search)} class="svelte-17pngxe"/></div> <div class="toolbar-actions svelte-17pngxe"><div class="filter-checkbox svelte-17pngxe"><label class="checkbox-label svelte-17pngxe"><input type="checkbox"${attr("checked", showInactive, true)} class="svelte-17pngxe"/> <span class="svelte-17pngxe">Mostrar inactivas</span></label></div> `);
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<div class="filter-group svelte-17pngxe"><div class="filter-label svelte-17pngxe">Estado</div> `);
          Select($$renderer4, {
            options: statusOptions,
            placeholder: "Todos",
            get value() {
              return statusFilter;
            },
            set value($$value) {
              statusFilter = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="filter-group svelte-17pngxe"><div class="filter-label svelte-17pngxe">Ordenar por</div> `);
          Select($$renderer4, {
            options: sortOptions,
            placeholder: "Seleccionar",
            get value() {
              return sortBy;
            },
            set value($$value) {
              sortBy = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="filter-group svelte-17pngxe"><div class="filter-label svelte-17pngxe">Dirección</div> <div class="sort-direction svelte-17pngxe"><button${attr_class("sort-btn svelte-17pngxe", void 0, { "active": sortOrder === "asc" })}>Ascendente</button> <button${attr_class("sort-btn svelte-17pngxe", void 0, { "active": sortOrder === "desc" })}>Descendente</button></div></div> `);
          if (activeFiltersCount() > 0) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<button class="clear-filters-btn svelte-17pngxe">Limpiar filtros</button>`);
          } else {
            $$renderer4.push("<!--[!-->");
          }
          $$renderer4.push(`<!--]-->`);
        };
        FilterPopup($$renderer3, {
          activeFiltersCount: activeFiltersCount(),
          get open() {
            return filterPopupOpen;
          },
          set open($$value) {
            filterPopupOpen = $$value;
            $$settled = false;
          },
          children,
          $$slots: { default: true }
        });
      }
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div></div> `);
      {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="skeleton-list svelte-17pngxe"><!--[-->`);
        const each_array = ensure_array_like(Array(5));
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          each_array[$$index];
          Skeleton($$renderer3, { height: "60px" });
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};

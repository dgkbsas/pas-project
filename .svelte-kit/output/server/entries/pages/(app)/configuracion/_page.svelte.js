import { a3 as sanitize_props, _ as spread_props, a4 as slot, Y as ensure_array_like, W as attr, V as attr_class, a0 as stringify, a6 as head } from "../../../../chunks/index2.js";
import { C as Card } from "../../../../chunks/Card.js";
import { T as Tabs } from "../../../../chunks/Tabs.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
import { B as Badge } from "../../../../chunks/Badge.js";
import { E as EmptyState, T as Table } from "../../../../chunks/Table.js";
import { s as showToast } from "../../../../chunks/notifications.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { F as File_text } from "../../../../chunks/file-text.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { X } from "../../../../chunks/x.js";
import { P as Pen } from "../../../../chunks/pen.js";
import { T as Trash } from "../../../../chunks/trash.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { e as escape_html } from "../../../../chunks/context.js";
import { U as User } from "../../../../chunks/user.js";
import { S as Square_pen } from "../../../../chunks/square-pen.js";
import { M as Mail } from "../../../../chunks/mail.js";
import { U as Users } from "../../../../chunks/users.js";
function Building_2($$renderer, $$props) {
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
    ["path", { "d": "M10 12h4" }],
    ["path", { "d": "M10 8h4" }],
    ["path", { "d": "M14 21v-3a2 2 0 0 0-4 0v3" }],
    [
      "path",
      {
        "d": "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"
      }
    ],
    ["path", { "d": "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" }]
  ];
  Icon($$renderer, spread_props([
    { name: "building-2" },
    $$sanitized_props,
    {
      /**
       * @component @name Building2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTAgMTJoNCIgLz4KICA8cGF0aCBkPSJNMTAgOGg0IiAvPgogIDxwYXRoIGQ9Ik0xNCAyMXYtM2EyIDIgMCAwIDAtNCAwdjMiIC8+CiAgPHBhdGggZD0iTTYgMTBINGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtMiIgLz4KICA8cGF0aCBkPSJNNiAyMVY1YTIgMiAwIDAgMSAyLTJoOGEyIDIgMCAwIDEgMiAydjE2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/building-2
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
function Check($$renderer, $$props) {
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
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  Icon($$renderer, spread_props([
    { name: "check" },
    $$sanitized_props,
    {
      /**
       * @component @name Check
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgNiA5IDE3bC01LTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/check
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
function Copy($$renderer, $$props) {
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
      "rect",
      {
        "width": "14",
        "height": "14",
        "x": "8",
        "y": "8",
        "rx": "2",
        "ry": "2"
      }
    ],
    [
      "path",
      {
        "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "copy" },
    $$sanitized_props,
    {
      /**
       * @component @name Copy
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHg9IjgiIHk9IjgiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNNCAxNmMtMS4xIDAtMi0uOS0yLTJWNGMwLTEuMS45LTIgMi0yaDEwYzEuMSAwIDIgLjkgMiAyIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/copy
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
function Dollar_sign($$renderer, $$props) {
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
    ["line", { "x1": "12", "x2": "12", "y1": "2", "y2": "22" }],
    [
      "path",
      { "d": "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "dollar-sign" },
    $$sanitized_props,
    {
      /**
       * @component @name DollarSign
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjIiIHkyPSIyMiIgLz4KICA8cGF0aCBkPSJNMTcgNUg5LjVhMy41IDMuNSAwIDAgMCAwIDdoNWEzLjUgMy41IDAgMCAxIDAgN0g2IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/dollar-sign
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
function ConfigurationManager($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let loading = false;
    let sections = [
      {
        key: "payment_modes",
        label: "Modos de Pago",
        icon: Dollar_sign,
        description: "Modalidades de pago disponibles para las pólizas",
        items: []
      },
      {
        key: "policy_types",
        label: "Tipos de Póliza",
        icon: File_text,
        description: "Tipos de pólizas de seguro que se pueden crear",
        items: []
      },
      {
        key: "followup_types",
        label: "Tipos de Seguimiento",
        icon: Calendar,
        description: "Categorías de seguimientos para las pólizas",
        items: []
      }
    ];
    let editingItem = null;
    let newItemLabel = "";
    let editItemLabel = "";
    let activeSectionKey = null;
    let showInactive = false;
    async function loadAllConfigurations() {
      loading = true;
      try {
        const response = await fetch("/api/config");
        const result = await response.json();
        if (response.ok && result.configs) {
          sections = sections.map((section) => {
            const config = result.configs.find((c) => c.config_key === section.key);
            if (config) {
              let items = [];
              if (Array.isArray(config.config_value)) {
                items = config.config_value.map((label) => ({ value: generateValue(label), label, active: true }));
              } else if (typeof config.config_value === "object" && config.config_value.items) {
                items = config.config_value.items;
              }
              return { ...section, items };
            }
            return section;
          });
        }
      } catch (err) {
        console.error("Error loading configurations:", err);
        showToast({ type: "error", message: "Error al cargar configuraciones" });
      } finally {
        loading = false;
      }
    }
    function generateValue(label) {
      return label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
    }
    async function addItem(sectionKey) {
      if (!newItemLabel.trim()) {
        showToast({ type: "error", message: "El nombre no puede estar vacío" });
        return;
      }
      const section = sections.find((s) => s.key === sectionKey);
      if (!section) return;
      if (section.items.some((item) => item.label.toLowerCase() === newItemLabel.trim().toLowerCase())) {
        showToast({ type: "error", message: "Este item ya existe" });
        return;
      }
      const newItem = {
        value: generateValue(newItemLabel),
        label: newItemLabel.trim(),
        active: true
      };
      const updatedItems = [...section.items, newItem];
      await saveConfiguration(sectionKey, updatedItems);
      newItemLabel = "";
      activeSectionKey = null;
    }
    async function saveConfiguration(sectionKey, items) {
      try {
        const config_value = {
          items: items.map((item) => ({
            value: item.value,
            label: item.label,
            active: item.active ?? true
          }))
        };
        const response = await fetch("/api/config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config_key: sectionKey, config_value })
        });
        if (response.ok) {
          showToast({ type: "success", message: "Configuración guardada" });
          await loadAllConfigurations();
        } else {
          const result = await response.json();
          showToast({ type: "error", message: result.message || "Error al guardar" });
        }
      } catch (err) {
        showToast({ type: "error", message: "Error al guardar configuración" });
      }
    }
    function getVisibleItems(items) {
      return items.filter((item) => item.active ?? true);
    }
    function getActiveCount(items) {
      return items.filter((item) => item.active ?? true).length;
    }
    function getInactiveCount(items) {
      return items.filter((item) => !(item.active ?? true)).length;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="config-manager svelte-131nf9n">`);
      if (loading) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="loading-state svelte-131nf9n"><p class="svelte-131nf9n">Cargando configuraciones...</p></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<div class="sections-grid svelte-131nf9n"><!--[-->`);
        const each_array = ensure_array_like(sections);
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let section = each_array[$$index_1];
          Card($$renderer3, {
            children: ($$renderer4) => {
              $$renderer4.push(`<div class="section-header svelte-131nf9n"><div class="section-title svelte-131nf9n"><div class="icon-wrapper svelte-131nf9n">`);
              if (section.icon) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<!---->`);
                section.icon($$renderer4, { size: 20 });
                $$renderer4.push(`<!---->`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--></div> <div class="svelte-131nf9n"><h3 class="svelte-131nf9n">${escape_html(section.label)}</h3> <p class="section-description svelte-131nf9n">${escape_html(section.description)}</p></div></div> <div style="display: flex; gap: var(--space-2); align-items: center;" class="svelte-131nf9n">`);
              Badge($$renderer4, {
                variant: "success",
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->${escape_html(getActiveCount(section.items))} activos`);
                }
              });
              $$renderer4.push(`<!----> `);
              if (getInactiveCount(section.items) > 0) {
                $$renderer4.push("<!--[-->");
                Badge($$renderer4, {
                  variant: "default",
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->${escape_html(getInactiveCount(section.items))} inactivos`);
                  }
                });
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--></div></div> `);
              if (getInactiveCount(section.items) > 0) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="show-inactive-toggle svelte-131nf9n"><label class="checkbox-label svelte-131nf9n"><input type="checkbox"${attr("checked", showInactive, true)} class="svelte-131nf9n"/> <span class="svelte-131nf9n">Mostrar items inactivos</span></label></div>`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> <div class="items-list svelte-131nf9n"><!--[-->`);
              const each_array_1 = ensure_array_like(getVisibleItems(section.items));
              for (let index = 0, $$length2 = each_array_1.length; index < $$length2; index++) {
                let item = each_array_1[index];
                const actualIndex = section.items.findIndex((it) => it.value === item.value);
                $$renderer4.push(`<div${attr_class("item-row svelte-131nf9n", void 0, { "inactive": !(item.active ?? true) })}>`);
                if (editingItem?.sectionKey === section.key && editingItem?.index === actualIndex) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div class="item-edit-form svelte-131nf9n">`);
                  Input($$renderer4, {
                    placeholder: "Nombre del item",
                    autofocus: true,
                    get value() {
                      return editItemLabel;
                    },
                    set value($$value) {
                      editItemLabel = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer4.push(`<!----> <div class="item-actions svelte-131nf9n"><button class="action-btn success svelte-131nf9n" title="Guardar">`);
                  Check($$renderer4, { size: 16 });
                  $$renderer4.push(`<!----></button> <button class="action-btn svelte-131nf9n" title="Cancelar">`);
                  X($$renderer4, { size: 16 });
                  $$renderer4.push(`<!----></button></div></div>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`<div class="item-content svelte-131nf9n"><div class="item-label-wrapper svelte-131nf9n"><span class="item-label svelte-131nf9n">${escape_html(item.label)}</span> `);
                  if (!(item.active ?? true)) {
                    $$renderer4.push("<!--[-->");
                    Badge($$renderer4, {
                      variant: "default",
                      children: ($$renderer5) => {
                        $$renderer5.push(`<!---->Inactivo`);
                      }
                    });
                  } else {
                    $$renderer4.push("<!--[!-->");
                  }
                  $$renderer4.push(`<!--]--></div> <code class="item-value svelte-131nf9n">${escape_html(item.value)}</code></div> <div class="item-actions svelte-131nf9n"><button class="action-btn svelte-131nf9n" title="Editar"${attr("disabled", !(item.active ?? true), true)}>`);
                  Pen($$renderer4, { size: 16 });
                  $$renderer4.push(`<!----></button> <button${attr_class(`action-btn ${stringify(item.active ?? true ? "warning" : "success")}`, "svelte-131nf9n")}${attr("title", item.active ?? true ? "Desactivar" : "Activar")}>`);
                  if (item.active ?? true) {
                    $$renderer4.push("<!--[-->");
                    Trash($$renderer4, { size: 16 });
                  } else {
                    $$renderer4.push("<!--[!-->");
                    Check($$renderer4, { size: 16 });
                  }
                  $$renderer4.push(`<!--]--></button></div>`);
                }
                $$renderer4.push(`<!--]--></div>`);
              }
              $$renderer4.push(`<!--]--> `);
              if (getVisibleItems(section.items).length === 0 && !showInactive) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="empty-state svelte-131nf9n"><p class="svelte-131nf9n">`);
                if (getInactiveCount(section.items) > 0) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`No hay items activos. Hay ${escape_html(getInactiveCount(section.items))} items
                    inactivos.`);
                } else {
                  $$renderer4.push("<!--[!-->");
                  $$renderer4.push(`No hay items configurados`);
                }
                $$renderer4.push(`<!--]--></p></div>`);
              } else {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--></div> <div class="add-item-form svelte-131nf9n">`);
              if (activeSectionKey === section.key) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`<div class="add-item-input svelte-131nf9n">`);
                Input($$renderer4, {
                  placeholder: "Nombre del nuevo item",
                  autofocus: true,
                  onkeydown: (e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(section.key);
                    } else if (e.key === "Escape") {
                      activeSectionKey = null;
                      newItemLabel = "";
                    }
                  },
                  get value() {
                    return newItemLabel;
                  },
                  set value($$value) {
                    newItemLabel = $$value;
                    $$settled = false;
                  }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  variant: "primary",
                  size: "sm",
                  onclick: () => addItem(section.key),
                  children: ($$renderer5) => {
                    Plus($$renderer5, { size: 16 });
                    $$renderer5.push(`<!----> Agregar`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----> `);
                Button($$renderer4, {
                  variant: "ghost",
                  size: "sm",
                  onclick: () => {
                    activeSectionKey = null;
                    newItemLabel = "";
                  },
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->Cancelar`);
                  },
                  $$slots: { default: true }
                });
                $$renderer4.push(`<!----></div>`);
              } else {
                $$renderer4.push("<!--[!-->");
                Button($$renderer4, {
                  variant: "outline",
                  size: "sm",
                  onclick: () => activeSectionKey = section.key,
                  children: ($$renderer5) => {
                    Plus($$renderer5, { size: 16 });
                    $$renderer5.push(`<!----> Agregar ${escape_html(section.label)}`);
                  },
                  $$slots: { default: true }
                });
              }
              $$renderer4.push(`<!--]--></div>`);
            }
          });
        }
        $$renderer3.push(`<!--]--></div> <div class="help-section svelte-131nf9n">`);
        Card($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="help-content svelte-131nf9n"><h4 class="svelte-131nf9n">💡 Acerca de la configuración</h4> <ul class="svelte-131nf9n"><li class="svelte-131nf9n"><strong class="svelte-131nf9n">Valor automático:</strong> Al agregar un item, se genera automáticamente
              un valor técnico (slug) sin espacios ni acentos para uso interno en
              la base de datos</li> <li class="svelte-131nf9n"><strong class="svelte-131nf9n">Edición del nombre:</strong> Puedes cambiar el nombre visible
              sin afectar el valor técnico, manteniendo la compatibilidad con datos
              existentes</li> <li class="svelte-131nf9n"><strong class="svelte-131nf9n">Desactivación:</strong> En lugar de eliminar, los items se
              desactivan para preservar el historial. Las pólizas existentes mantienen
              su referencia</li> <li class="svelte-131nf9n"><strong class="svelte-131nf9n">Items inactivos:</strong> Los items desactivados no aparecen
              en los formularios nuevos, pero puedes verlos activando el checkbox
              "Mostrar items inactivos"</li> <li class="svelte-131nf9n"><strong class="svelte-131nf9n">Reactivación:</strong> Puedes reactivar items desactivados
              en cualquier momento haciendo clic en el botón de activar (✓)</li></ul></div>`);
          }
        });
        $$renderer3.push(`<!----></div>`);
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let activeTab = "profile";
    let loadingProfile = false;
    let loadingCompany = false;
    let loadingInvite = false;
    const tabs = [
      { id: "profile", label: "Perfil" },
      { id: "company", label: "Empresa" },
      { id: "insurers", label: "Aseguradoras" },
      { id: "variables", label: "Variables" },
      { id: "invitations", label: "Invitaciones" },
      { id: "users", label: "Usuarios" }
    ];
    let profileData = {
      email: data.user.email || "",
      new_password: "",
      confirm_password: ""
    };
    let companyData = {
      name: data.company?.name || "",
      address: data.company?.address || "",
      city: data.company?.city || "",
      postal_code: data.company?.postal_code || "",
      phone: data.company?.phone || ""
    };
    let insurers = [];
    let insurerFormData = {
      name: "",
      code: "",
      contact_email: "",
      contact_phone: "",
      website: ""
    };
    let inviteEmail = "";
    function formatDate(date) {
      return new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
    }
    function getRoleBadge(role) {
      return role === "admin" ? "default" : "default";
    }
    function getRoleLabel(role) {
      return role === "admin" ? "Administrador" : "Usuario";
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head($$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Configuración - PAS Manager</title>`);
        });
      });
      $$renderer3.push(`<div class="page svelte-6qgtij"><div class="page-header svelte-6qgtij"><div class="svelte-6qgtij"><h1 class="svelte-6qgtij">Configuración</h1> <p class="svelte-6qgtij">Administra la configuración de tu empresa y perfil</p></div></div> `);
      Tabs($$renderer3, {
        tabs,
        get activeTab() {
          return activeTab;
        },
        set activeTab($$value) {
          activeTab = $$value;
          $$settled = false;
        },
        children: ($$renderer4) => {
          if (activeTab === "profile") {
            $$renderer4.push("<!--[-->");
            Card($$renderer4, {
              children: ($$renderer5) => {
                $$renderer5.push(`<div class="section-header svelte-6qgtij"><div class="icon-wrapper svelte-6qgtij">`);
                User($$renderer5, { size: 20 });
                $$renderer5.push(`<!----></div> <div class="svelte-6qgtij"><h2 class="svelte-6qgtij">Perfil de Usuario</h2> <p class="svelte-6qgtij">Actualiza tu información personal y contraseña</p></div></div> <form class="svelte-6qgtij"><div class="form-grid svelte-6qgtij"><div class="form-group double-width svelte-6qgtij"><label for="email" class="svelte-6qgtij">Email</label> `);
                Input($$renderer5, { value: profileData.email, disabled: true });
                $$renderer5.push(`<!----> <small class="help-text svelte-6qgtij">El email no se puede cambiar</small></div> <div class="form-group svelte-6qgtij"><label for="new_password" class="svelte-6qgtij">Nueva Contraseña</label> `);
                Input($$renderer5, {
                  type: "password",
                  placeholder: "Dejar en blanco para no cambiar",
                  get value() {
                    return profileData.new_password;
                  },
                  set value($$value) {
                    profileData.new_password = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label for="confirm_password" class="svelte-6qgtij">Confirmar Contraseña</label> `);
                Input($$renderer5, {
                  type: "password",
                  placeholder: "Confirmar nueva contraseña",
                  get value() {
                    return profileData.confirm_password;
                  },
                  set value($$value) {
                    profileData.confirm_password = $$value;
                    $$settled = false;
                  }
                });
                $$renderer5.push(`<!----></div></div> <div class="form-actions svelte-6qgtij">`);
                Button($$renderer5, {
                  type: "submit",
                  variant: "primary",
                  disabled: loadingProfile,
                  children: ($$renderer6) => {
                    $$renderer6.push(`<!---->${escape_html("Guardar Cambios")}`);
                  },
                  $$slots: { default: true }
                });
                $$renderer5.push(`<!----></div></form>`);
              }
            });
          } else {
            $$renderer4.push("<!--[!-->");
            if (activeTab === "company") {
              $$renderer4.push("<!--[-->");
              Card($$renderer4, {
                children: ($$renderer5) => {
                  $$renderer5.push(`<div class="section-header svelte-6qgtij"><div class="icon-wrapper svelte-6qgtij">`);
                  Building_2($$renderer5, { size: 20 });
                  $$renderer5.push(`<!----></div> <div class="svelte-6qgtij"><h2 class="svelte-6qgtij">Datos de la Empresa</h2> <p class="svelte-6qgtij">Información de tu empresa u organización</p></div></div> <form class="svelte-6qgtij"><div class="form-grid svelte-6qgtij"><div class="form-group double-width svelte-6qgtij"><label for="companyName" class="svelte-6qgtij">Nombre de la Empresa</label> `);
                  Input($$renderer5, {
                    placeholder: "Mi Empresa S.A.",
                    required: true,
                    get value() {
                      return companyData.name;
                    },
                    set value($$value) {
                      companyData.name = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> <div class="form-group double-width svelte-6qgtij"><label for="companyAddress" class="svelte-6qgtij">Dirección</label> `);
                  Input($$renderer5, {
                    placeholder: "Calle Principal 123",
                    get value() {
                      return companyData.address;
                    },
                    set value($$value) {
                      companyData.address = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label for="companyCity" class="svelte-6qgtij">Ciudad</label> `);
                  Input($$renderer5, {
                    placeholder: "Madrid",
                    get value() {
                      return companyData.city;
                    },
                    set value($$value) {
                      companyData.city = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label for="companyPostalCode" class="svelte-6qgtij">Código Postal</label> `);
                  Input($$renderer5, {
                    placeholder: "28001",
                    get value() {
                      return companyData.postal_code;
                    },
                    set value($$value) {
                      companyData.postal_code = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label for="companyPhone" class="svelte-6qgtij">Teléfono</label> `);
                  Input($$renderer5, {
                    type: "tel",
                    placeholder: "+34 900 000 000",
                    get value() {
                      return companyData.phone;
                    },
                    set value($$value) {
                      companyData.phone = $$value;
                      $$settled = false;
                    }
                  });
                  $$renderer5.push(`<!----></div></div> <div class="form-actions svelte-6qgtij">`);
                  Button($$renderer5, {
                    type: "submit",
                    variant: "primary",
                    disabled: loadingCompany,
                    children: ($$renderer6) => {
                      $$renderer6.push(`<!---->${escape_html("Guardar Cambios")}`);
                    },
                    $$slots: { default: true }
                  });
                  $$renderer5.push(`<!----></div></form>`);
                }
              });
            } else {
              $$renderer4.push("<!--[!-->");
              if (activeTab === "insurers") {
                $$renderer4.push("<!--[-->");
                Card($$renderer4, {
                  children: ($$renderer5) => {
                    $$renderer5.push(`<div class="section-header svelte-6qgtij"><div class="icon-wrapper svelte-6qgtij">`);
                    Building_2($$renderer5, { size: 20 });
                    $$renderer5.push(`<!----></div> <div class="svelte-6qgtij"><h2 class="svelte-6qgtij">Compañías de Seguros</h2> <p class="svelte-6qgtij">Gestiona las aseguradoras disponibles en el sistema</p></div></div> <form class="insurer-form svelte-6qgtij"><div class="form-grid svelte-6qgtij"><div class="form-group svelte-6qgtij"><label for="insurerName" class="svelte-6qgtij">Nombre *</label> `);
                    Input($$renderer5, {
                      placeholder: "Ej: Mapfre, AXA, Zurich...",
                      required: true,
                      get value() {
                        return insurerFormData.name;
                      },
                      set value($$value) {
                        insurerFormData.name = $$value;
                        $$settled = false;
                      }
                    });
                    $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label for="insurerCode" class="svelte-6qgtij">Código</label> `);
                    Input($$renderer5, {
                      placeholder: "Código corto",
                      get value() {
                        return insurerFormData.code;
                      },
                      set value($$value) {
                        insurerFormData.code = $$value;
                        $$settled = false;
                      }
                    });
                    $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label for="insurerContactEmail" class="svelte-6qgtij">Email de contacto</label> `);
                    Input($$renderer5, {
                      type: "email",
                      placeholder: "contacto@compania.com",
                      get value() {
                        return insurerFormData.contact_email;
                      },
                      set value($$value) {
                        insurerFormData.contact_email = $$value;
                        $$settled = false;
                      }
                    });
                    $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label for="insurerContactPhone" class="svelte-6qgtij">Teléfono</label> `);
                    Input($$renderer5, {
                      type: "tel",
                      placeholder: "+34 900 000 000",
                      get value() {
                        return insurerFormData.contact_phone;
                      },
                      set value($$value) {
                        insurerFormData.contact_phone = $$value;
                        $$settled = false;
                      }
                    });
                    $$renderer5.push(`<!----></div> <div class="form-group full-width svelte-6qgtij"><label for="insurerWebsite" class="svelte-6qgtij">Sitio web</label> `);
                    Input($$renderer5, {
                      type: "url",
                      placeholder: "https://www.compania.com",
                      get value() {
                        return insurerFormData.website;
                      },
                      set value($$value) {
                        insurerFormData.website = $$value;
                        $$settled = false;
                      }
                    });
                    $$renderer5.push(`<!----></div></div> <div class="form-actions svelte-6qgtij">`);
                    {
                      $$renderer5.push("<!--[!-->");
                    }
                    $$renderer5.push(`<!--]--> `);
                    Button($$renderer5, {
                      type: "submit",
                      variant: "primary",
                      children: ($$renderer6) => {
                        {
                          $$renderer6.push("<!--[!-->");
                          Plus($$renderer6, { size: 18 });
                          $$renderer6.push(`<!----> Crear Aseguradora`);
                        }
                        $$renderer6.push(`<!--]-->`);
                      },
                      $$slots: { default: true }
                    });
                    $$renderer5.push(`<!----></div></form> `);
                    {
                      $$renderer5.push("<!--[!-->");
                      if (insurers.length === 0) {
                        $$renderer5.push("<!--[-->");
                        EmptyState($$renderer5, {
                          icon: Building_2,
                          title: "No hay aseguradoras registradas",
                          description: "Comienza agregando tu primera compañía de seguros"
                        });
                      } else {
                        $$renderer5.push("<!--[!-->");
                        $$renderer5.push(`<div class="insurers-table svelte-6qgtij">`);
                        Table($$renderer5, {
                          children: ($$renderer6) => {
                            $$renderer6.push(`<thead class="svelte-6qgtij"><tr class="svelte-6qgtij"><th class="svelte-6qgtij">Nombre</th><th class="svelte-6qgtij">Código</th><th class="svelte-6qgtij">Contacto</th><th class="text-right svelte-6qgtij">Acciones</th></tr></thead> <tbody class="svelte-6qgtij"><!--[-->`);
                            const each_array = ensure_array_like(insurers);
                            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                              let insurer = each_array[$$index];
                              $$renderer6.push(`<tr class="svelte-6qgtij"><td class="svelte-6qgtij"><div class="insurer-name svelte-6qgtij">`);
                              Building_2($$renderer6, { size: 16 });
                              $$renderer6.push(`<!----> ${escape_html(insurer.name)}</div></td><td class="svelte-6qgtij">`);
                              if (insurer.code) {
                                $$renderer6.push("<!--[-->");
                                $$renderer6.push(`<span class="code-badge svelte-6qgtij">${escape_html(insurer.code)}</span>`);
                              } else {
                                $$renderer6.push("<!--[!-->");
                                $$renderer6.push(`<span class="text-muted svelte-6qgtij">-</span>`);
                              }
                              $$renderer6.push(`<!--]--></td><td class="svelte-6qgtij">`);
                              if (insurer.contact_email) {
                                $$renderer6.push("<!--[-->");
                                $$renderer6.push(`<span class="contact-info svelte-6qgtij">${escape_html(insurer.contact_email)}</span>`);
                              } else {
                                $$renderer6.push("<!--[!-->");
                                if (insurer.contact_phone) {
                                  $$renderer6.push("<!--[-->");
                                  $$renderer6.push(`<span class="contact-info svelte-6qgtij">${escape_html(insurer.contact_phone)}</span>`);
                                } else {
                                  $$renderer6.push("<!--[!-->");
                                  $$renderer6.push(`<span class="text-muted svelte-6qgtij">Sin contacto</span>`);
                                }
                                $$renderer6.push(`<!--]-->`);
                              }
                              $$renderer6.push(`<!--]--></td><td class="text-right svelte-6qgtij"><div class="table-actions svelte-6qgtij"><button class="action-btn svelte-6qgtij" title="Editar">`);
                              Square_pen($$renderer6, { size: 16 });
                              $$renderer6.push(`<!----></button> <button class="action-btn danger svelte-6qgtij" title="Eliminar">`);
                              Trash($$renderer6, { size: 16 });
                              $$renderer6.push(`<!----></button></div></td></tr>`);
                            }
                            $$renderer6.push(`<!--]--></tbody>`);
                          }
                        });
                        $$renderer5.push(`<!----></div>`);
                      }
                      $$renderer5.push(`<!--]-->`);
                    }
                    $$renderer5.push(`<!--]-->`);
                  }
                });
              } else {
                $$renderer4.push("<!--[!-->");
                if (activeTab === "variables") {
                  $$renderer4.push("<!--[-->");
                  ConfigurationManager($$renderer4);
                } else {
                  $$renderer4.push("<!--[!-->");
                  if (activeTab === "invitations") {
                    $$renderer4.push("<!--[-->");
                    Card($$renderer4, {
                      children: ($$renderer5) => {
                        $$renderer5.push(`<div class="section-header svelte-6qgtij"><div class="icon-wrapper svelte-6qgtij">`);
                        Mail($$renderer5, { size: 20 });
                        $$renderer5.push(`<!----></div> <div class="svelte-6qgtij"><h2 class="svelte-6qgtij">Invitaciones</h2> <p class="svelte-6qgtij">Invita a nuevos usuarios a unirse a tu empresa</p></div></div> <form class="invite-form svelte-6qgtij"><div class="invite-inputs svelte-6qgtij">`);
                        Input($$renderer5, {
                          type: "email",
                          placeholder: "correo@ejemplo.com",
                          required: true,
                          get value() {
                            return inviteEmail;
                          },
                          set value($$value) {
                            inviteEmail = $$value;
                            $$settled = false;
                          }
                        });
                        $$renderer5.push(`<!----> `);
                        Button($$renderer5, {
                          type: "submit",
                          variant: "primary",
                          disabled: loadingInvite,
                          children: ($$renderer6) => {
                            Plus($$renderer6, { size: 18 });
                            $$renderer6.push(`<!----> ${escape_html("Enviar Invitación")}`);
                          },
                          $$slots: { default: true }
                        });
                        $$renderer5.push(`<!----></div></form> `);
                        if (data.invitations.length === 0) {
                          $$renderer5.push("<!--[-->");
                          EmptyState($$renderer5, {
                            icon: Mail,
                            title: "Sin invitaciones",
                            description: "No hay invitaciones pendientes"
                          });
                        } else {
                          $$renderer5.push("<!--[!-->");
                          $$renderer5.push(`<div class="invitations-list svelte-6qgtij"><!--[-->`);
                          const each_array_1 = ensure_array_like(data.invitations);
                          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                            let invitation = each_array_1[$$index_1];
                            $$renderer5.push(`<div class="invitation-item svelte-6qgtij"><div class="invitation-info svelte-6qgtij"><div class="invitation-email svelte-6qgtij">${escape_html(invitation.email)}</div> <div class="invitation-meta svelte-6qgtij">Enviada ${escape_html(formatDate(invitation.created_at))}</div></div> <div class="invitation-actions svelte-6qgtij"><button class="action-btn svelte-6qgtij" title="Copiar link">`);
                            Copy($$renderer5, { size: 16 });
                            $$renderer5.push(`<!----></button> <button class="action-btn danger svelte-6qgtij" title="Eliminar">`);
                            Trash($$renderer5, { size: 16 });
                            $$renderer5.push(`<!----></button></div></div>`);
                          }
                          $$renderer5.push(`<!--]--></div>`);
                        }
                        $$renderer5.push(`<!--]-->`);
                      }
                    });
                  } else {
                    $$renderer4.push("<!--[!-->");
                    if (activeTab === "users") {
                      $$renderer4.push("<!--[-->");
                      Card($$renderer4, {
                        children: ($$renderer5) => {
                          $$renderer5.push(`<div class="section-header svelte-6qgtij"><div class="icon-wrapper svelte-6qgtij">`);
                          Users($$renderer5, { size: 20 });
                          $$renderer5.push(`<!----></div> <div class="svelte-6qgtij"><h2 class="svelte-6qgtij">Usuarios</h2> <p class="svelte-6qgtij">Usuarios con acceso a la empresa</p></div></div> `);
                          if (data.users.length === 0) {
                            $$renderer5.push("<!--[-->");
                            EmptyState($$renderer5, {
                              icon: Users,
                              title: "Sin usuarios",
                              description: "No hay usuarios registrados"
                            });
                          } else {
                            $$renderer5.push("<!--[!-->");
                            Table($$renderer5, {
                              children: ($$renderer6) => {
                                $$renderer6.push(`<thead class="svelte-6qgtij"><tr class="svelte-6qgtij"><th class="svelte-6qgtij">Email</th><th class="svelte-6qgtij">Rol</th><th class="svelte-6qgtij">Fecha de Registro</th></tr></thead> <tbody class="svelte-6qgtij"><!--[-->`);
                                const each_array_2 = ensure_array_like(data.users);
                                for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
                                  let user = each_array_2[$$index_2];
                                  $$renderer6.push(`<tr class="svelte-6qgtij"><td class="svelte-6qgtij">${escape_html(user.email)}</td><td class="svelte-6qgtij">`);
                                  Badge($$renderer6, {
                                    variant: getRoleBadge(user.role),
                                    children: ($$renderer7) => {
                                      $$renderer7.push(`<!---->${escape_html(getRoleLabel(user.role))}`);
                                    }
                                  });
                                  $$renderer6.push(`<!----></td><td class="svelte-6qgtij">${escape_html(formatDate(user.created_at))}</td></tr>`);
                                }
                                $$renderer6.push(`<!--]--></tbody>`);
                              }
                            });
                          }
                          $$renderer5.push(`<!--]-->`);
                        }
                      });
                    } else {
                      $$renderer4.push("<!--[!-->");
                    }
                    $$renderer4.push(`<!--]-->`);
                  }
                  $$renderer4.push(`<!--]-->`);
                }
                $$renderer4.push(`<!--]-->`);
              }
              $$renderer4.push(`<!--]-->`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div>`);
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

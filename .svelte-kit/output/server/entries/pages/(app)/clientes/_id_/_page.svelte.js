import { a3 as sanitize_props, _ as spread_props, a4 as slot, a6 as head, W as attr, Y as ensure_array_like } from "../../../../../chunks/index2.js";
import { g as goto } from "../../../../../chunks/client.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { C as Card } from "../../../../../chunks/Card.js";
import { B as Badge } from "../../../../../chunks/Badge.js";
import { T as Tabs } from "../../../../../chunks/Tabs.js";
import { E as EmptyState, T as Table } from "../../../../../chunks/Table.js";
import { P as Phone, i as isMobileNumber, g as getWhatsAppUrl, M as Message_circle } from "../../../../../chunks/phone.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { S as Square_pen } from "../../../../../chunks/square-pen.js";
import { M as Mail } from "../../../../../chunks/mail.js";
import { F as File_text } from "../../../../../chunks/file-text.js";
import { C as Calendar } from "../../../../../chunks/calendar.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
import { P as Plus } from "../../../../../chunks/plus.js";
import { e as escape_html } from "../../../../../chunks/context.js";
function Map_pin($$renderer, $$props) {
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
        "d": "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
      }
    ],
    ["circle", { "cx": "12", "cy": "10", "r": "3" }]
  ];
  Icon($$renderer, spread_props([
    { name: "map-pin" },
    $$sanitized_props,
    {
      /**
       * @component @name MapPin
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjAgMTBjMCA0Ljk5My01LjUzOSAxMC4xOTMtNy4zOTkgMTEuNzk5YTEgMSAwIDAgMS0xLjIwMiAwQzkuNTM5IDIwLjE5MyA0IDE0Ljk5MyA0IDEwYTggOCAwIDAgMSAxNiAwIiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/map-pin
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let activeTab = "info";
    let showInactivePolicies = false;
    const filteredPolicies = data.policies.filter((p) => p.active !== false);
    const tabs = [
      { id: "info", label: "Información" },
      { id: "policies", label: `Pólizas (${data.policies.length})` }
    ];
    function formatDate(date) {
      return new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
    }
    function formatCurrency(amount) {
      return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
    }
    function getStatusBadge(status) {
      const variants = { active: "success", cancelled: "error", expired: "warning" };
      const labels = { active: "Activa", cancelled: "Cancelada", expired: "Vencida" };
      return {
        variant: variants[status] || "default",
        label: labels[status] || status
      };
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head($$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html(data.client.first_name)} ${escape_html(data.client.last_name)} - PAS Manager</title>`);
        });
      });
      $$renderer3.push(`<div class="page svelte-q8hs85"><div class="page-header svelte-q8hs85"><div class="svelte-q8hs85">`);
      Button($$renderer3, {
        variant: "ghost",
        size: "sm",
        onclick: () => goto(),
        children: ($$renderer4) => {
          Arrow_left($$renderer4, { size: 18 });
          $$renderer4.push(`<!----> Volver`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> <h1 class="svelte-q8hs85">${escape_html(data.client.first_name)} ${escape_html(data.client.last_name)}</h1> <p class="svelte-q8hs85">Información detallada del cliente</p></div> `);
      Button($$renderer3, {
        variant: "primary",
        onclick: () => goto(`/clientes/${data.client.id}/editar`),
        children: ($$renderer4) => {
          Square_pen($$renderer4, { size: 18 });
          $$renderer4.push(`<!----> Editar Cliente`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div> `);
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
          if (activeTab === "info") {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="info-grid svelte-q8hs85">`);
            Card($$renderer4, {
              children: ($$renderer5) => {
                $$renderer5.push(`<div class="card-header svelte-q8hs85"><h2 class="svelte-q8hs85">Datos Personales</h2></div> <div class="info-list svelte-q8hs85">`);
                if (data.client.email_primary) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  Mail($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="svelte-q8hs85"><div class="label svelte-q8hs85">Email Principal</div> <div class="value svelte-q8hs85">${escape_html(data.client.email_primary)}</div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--> `);
                if (data.client.email_secondary) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  Mail($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="svelte-q8hs85"><div class="label svelte-q8hs85">Email Secundario</div> <div class="value svelte-q8hs85">${escape_html(data.client.email_secondary)}</div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--> <div class="info-row svelte-q8hs85">`);
                if (data.client.phone) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  Phone($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="phone-content svelte-q8hs85"><div class="label svelte-q8hs85">Celular</div> <div class="value phone-with-whatsapp svelte-q8hs85"><span class="svelte-q8hs85">${escape_html(data.client.phone)}</span> `);
                  if (isMobileNumber(data.client.phone)) {
                    $$renderer5.push("<!--[-->");
                    $$renderer5.push(`<a${attr("href", getWhatsAppUrl(data.client.phone))} target="_blank" rel="noopener noreferrer" class="whatsapp-btn svelte-q8hs85" title="Abrir en WhatsApp">`);
                    Message_circle($$renderer5, { size: 16 });
                    $$renderer5.push(`<!----></a>`);
                  } else {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--></div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--> `);
                if (data.client.phone_landline) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  Phone($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="svelte-q8hs85"><div class="label svelte-q8hs85">Teléfono</div> <div class="value svelte-q8hs85">${escape_html(data.client.phone_landline)}</div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--></div> `);
                if (data.client.document_number) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  File_text($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="svelte-q8hs85"><div class="label svelte-q8hs85">DNI/CUIT</div> <div class="value svelte-q8hs85">${escape_html(data.client.document_number)}</div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--> `);
                if (data.client.birth_date) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  Calendar($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="svelte-q8hs85"><div class="label svelte-q8hs85">Fecha de Nacimiento</div> <div class="value svelte-q8hs85">${escape_html(formatDate(data.client.birth_date))}</div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--></div>`);
              }
            });
            $$renderer4.push(`<!----> `);
            Card($$renderer4, {
              children: ($$renderer5) => {
                $$renderer5.push(`<div class="card-header svelte-q8hs85"><h2 class="svelte-q8hs85">Dirección</h2></div> <div class="info-list svelte-q8hs85">`);
                if (data.client.address || data.client.city || data.client.postal_code) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  Map_pin($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="svelte-q8hs85"><div class="label svelte-q8hs85">Ubicación</div> <div class="value svelte-q8hs85">`);
                  if (data.client.address) {
                    $$renderer5.push("<!--[-->");
                    $$renderer5.push(`<div class="svelte-q8hs85">${escape_html(data.client.address)}</div>`);
                  } else {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--> `);
                  if (data.client.city || data.client.postal_code) {
                    $$renderer5.push("<!--[-->");
                    $$renderer5.push(`<div class="svelte-q8hs85">${escape_html(data.client.postal_code || "")}
                        ${escape_html(data.client.city || "")}</div>`);
                  } else {
                    $$renderer5.push("<!--[!-->");
                  }
                  $$renderer5.push(`<!--]--></div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                  $$renderer5.push(`<div class="empty-info svelte-q8hs85">No hay dirección registrada</div>`);
                }
                $$renderer5.push(`<!--]--></div>`);
              }
            });
            $$renderer4.push(`<!----> `);
            Card($$renderer4, {
              class: "full-width",
              children: ($$renderer5) => {
                $$renderer5.push(`<div class="card-header svelte-q8hs85"><h2 class="svelte-q8hs85">Información Adicional</h2></div> <div class="info-list svelte-q8hs85">`);
                if (data.client.alias_pas) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  File_text($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="svelte-q8hs85"><div class="label svelte-q8hs85">Alias PAS</div> <div class="value svelte-q8hs85">${escape_html(data.client.alias_pas)}</div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--> `);
                if (data.client.referred_by) {
                  $$renderer5.push("<!--[-->");
                  $$renderer5.push(`<div class="info-item svelte-q8hs85">`);
                  File_text($$renderer5, { size: 18 });
                  $$renderer5.push(`<!----> <div class="svelte-q8hs85"><div class="label svelte-q8hs85">Referido Por</div> <div class="value svelte-q8hs85">${escape_html(data.client.referred_by)}</div></div></div>`);
                } else {
                  $$renderer5.push("<!--[!-->");
                }
                $$renderer5.push(`<!--]--></div>`);
              }
            });
            $$renderer4.push(`<!----> `);
            if (data.client.observations) {
              $$renderer4.push("<!--[-->");
              Card($$renderer4, {
                class: "full-width",
                children: ($$renderer5) => {
                  $$renderer5.push(`<div class="card-header svelte-q8hs85"><h2 class="svelte-q8hs85">Observaciones</h2></div> <p class="notes svelte-q8hs85">${escape_html(data.client.observations)}</p>`);
                }
              });
            } else {
              $$renderer4.push("<!--[!-->");
            }
            $$renderer4.push(`<!--]--></div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            if (activeTab === "policies") {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="policies-section svelte-q8hs85"><div class="policies-header svelte-q8hs85"><div class="svelte-q8hs85"><h2 class="svelte-q8hs85">Pólizas del Cliente</h2> <label class="checkbox-label svelte-q8hs85"><input type="checkbox"${attr("checked", showInactivePolicies, true)} class="svelte-q8hs85"/> <span class="svelte-q8hs85">Mostrar inactivas</span></label></div> `);
              Button($$renderer4, {
                variant: "primary",
                size: "sm",
                onclick: () => goto(`/polizas/nuevo?client_id=${data.client.id}`),
                children: ($$renderer5) => {
                  Plus($$renderer5, { size: 16 });
                  $$renderer5.push(`<!----> Nueva Póliza`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></div> `);
              if (filteredPolicies.length === 0 && !showInactivePolicies) {
                $$renderer4.push("<!--[-->");
                EmptyState($$renderer4, {
                  icon: File_text,
                  title: "Sin pólizas activas",
                  description: "Este cliente no tiene pólizas activas"
                });
              } else {
                $$renderer4.push("<!--[!-->");
                if (data.policies.length === 0) {
                  $$renderer4.push("<!--[-->");
                  EmptyState($$renderer4, {
                    icon: File_text,
                    title: "Sin pólizas",
                    description: "Este cliente no tiene pólizas registradas",
                    action: { label: "Crear Póliza", onclick: () => goto() }
                  });
                } else {
                  $$renderer4.push("<!--[!-->");
                  Table($$renderer4, {
                    children: ($$renderer5) => {
                      $$renderer5.push(`<thead class="svelte-q8hs85"><tr class="svelte-q8hs85"><th class="svelte-q8hs85">N° Póliza</th><th class="svelte-q8hs85">Tipo</th><th class="svelte-q8hs85">Aseguradora</th><th class="svelte-q8hs85">Estado</th><th class="svelte-q8hs85">Prima</th><th class="svelte-q8hs85">Vencimiento</th></tr></thead> <tbody class="svelte-q8hs85"><!--[-->`);
                      const each_array = ensure_array_like(filteredPolicies);
                      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                        let policy = each_array[$$index];
                        const statusBadge = getStatusBadge(policy.status);
                        $$renderer5.push(`<tr class="clickable-row svelte-q8hs85"><td class="svelte-q8hs85"><span class="policy-number svelte-q8hs85">${escape_html(policy.policy_number)}</span></td><td class="svelte-q8hs85">${escape_html(policy.policy_type)}</td><td class="svelte-q8hs85">${escape_html(policy.insurer)}</td><td class="svelte-q8hs85">`);
                        Badge($$renderer5, {
                          variant: statusBadge.variant,
                          children: ($$renderer6) => {
                            $$renderer6.push(`<!---->${escape_html(statusBadge.label)}`);
                          }
                        });
                        $$renderer5.push(`<!----></td><td class="svelte-q8hs85">${escape_html(formatCurrency(policy.premium))}</td><td class="svelte-q8hs85"><div class="date-cell svelte-q8hs85">`);
                        Calendar($$renderer5, { size: 14 });
                        $$renderer5.push(`<!----> ${escape_html(formatDate(policy.end_date))}</div></td></tr>`);
                      }
                      $$renderer5.push(`<!--]--></tbody>`);
                    }
                  });
                }
                $$renderer4.push(`<!--]-->`);
              }
              $$renderer4.push(`<!--]--></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
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

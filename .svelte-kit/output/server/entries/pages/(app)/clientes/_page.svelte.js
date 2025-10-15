import { a3 as sanitize_props, _ as spread_props, a4 as slot, a1 as store_get, a2 as unsubscribe_stores, W as attr, Y as ensure_array_like, V as attr_class, a6 as head } from "../../../../chunks/index2.js";
import { g as goto } from "../../../../chunks/client.js";
import { p as page } from "../../../../chunks/stores.js";
import { B as Button } from "../../../../chunks/Button.js";
/* empty css                                                     */
import { E as EmptyState, T as Table } from "../../../../chunks/Table.js";
import { F as Funnel, S as Skeleton } from "../../../../chunks/Skeleton.js";
import { I as InfiniteScroll } from "../../../../chunks/InfiniteScroll.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { I as Input } from "../../../../chunks/Input.js";
import { P as PhoneInputArgentina } from "../../../../chunks/PhoneInputArgentina.js";
import { s as showToast } from "../../../../chunks/notifications.js";
import { i as isMobileNumber, g as getWhatsAppUrl, M as Message_circle, P as Phone } from "../../../../chunks/phone.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { U as User } from "../../../../chunks/user.js";
import { P as Pen } from "../../../../chunks/pen.js";
import { X } from "../../../../chunks/x.js";
import { S as Save } from "../../../../chunks/save.js";
import { F as File_text } from "../../../../chunks/file-text.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { e as escape_html } from "../../../../chunks/context.js";
import "clsx";
/* empty css                                                      */
import { S as Search } from "../../../../chunks/search.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { U as Users } from "../../../../chunks/users.js";
import { M as Mail } from "../../../../chunks/mail.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { T as Trash } from "../../../../chunks/trash.js";
function Arrow_up($$renderer, $$props) {
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
    ["path", { "d": "m5 12 7-7 7 7" }],
    ["path", { "d": "M12 19V5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-up" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNSAxMiA3LTcgNyA3IiAvPgogIDxwYXRoIGQ9Ik0xMiAxOVY1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/arrow-up
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
function ClientModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { clientId, mode = "view", onClose } = $$props;
    let client = null;
    let loading = false;
    let saving = false;
    let isEditMode = mode === "edit";
    let formData = {
      first_name: "",
      last_name: "",
      document_number: "",
      birth_date: "",
      email_primary: "",
      email_secondary: "",
      phone: "",
      phone_landline: "",
      address: "",
      street: "",
      street_number: "",
      floor: "",
      apartment: "",
      postal_code: "",
      city: "",
      province: "",
      alias_pas: "",
      referred_by: "",
      observations: ""
    };
    let errors = {};
    async function loadClient() {
      if (!clientId) return;
      loading = true;
      try {
        const response = await fetch(`/api/clients/${clientId}`);
        const result = await response.json();
        if (response.ok) {
          client = result.client;
          formData = {
            first_name: client?.first_name || "",
            last_name: client?.last_name || "",
            document_number: client?.document_number || "",
            birth_date: client?.birth_date || "",
            email_primary: client?.email_primary || "",
            email_secondary: client?.email_secondary || "",
            phone: client?.phone || "",
            phone_landline: client?.phone_landline || "",
            address: client?.address || "",
            street: client?.street || "",
            street_number: client?.street_number || "",
            floor: client?.floor || "",
            apartment: client?.apartment || "",
            postal_code: client?.postal_code || "",
            city: client?.city || "",
            province: client?.province || "",
            alias_pas: client?.alias_pas || "",
            referred_by: client?.referred_by || "",
            observations: client?.observations || ""
          };
        } else {
          showToast({ type: "error", message: "Error loading client" });
          onClose();
        }
      } catch (err) {
        showToast({ type: "error", message: "Error loading client" });
        onClose();
      } finally {
        loading = false;
      }
    }
    async function handleSave() {
      if (!clientId) return;
      saving = true;
      errors = {};
      try {
        const response = await fetch(`/api/clients/${clientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (response.ok) {
          showToast({ type: "success", message: "Client updated successfully" });
          isEditMode = false;
          await loadClient();
          onClose(true);
        } else {
          if (result.errors) {
            errors = result.errors;
          }
          showToast({
            type: "error",
            message: result.message || "Error updating client"
          });
        }
      } catch (err) {
        showToast({ type: "error", message: "Error updating client" });
      } finally {
        saving = false;
      }
    }
    function toggleEdit() {
      isEditMode = !isEditMode;
      if (!isEditMode && client) {
        formData = {
          first_name: client.first_name || "",
          last_name: client.last_name || "",
          document_number: client.document_number || "",
          birth_date: client.birth_date || "",
          email_primary: client.email_primary || "",
          email_secondary: client.email_secondary || "",
          phone: client.phone || "",
          phone_landline: client.phone_landline || "",
          address: client.address || "",
          street: client.street || "",
          street_number: client.street_number || "",
          floor: client.floor || "",
          apartment: client.apartment || "",
          postal_code: client.postal_code || "",
          city: client.city || "",
          province: client.province || "",
          alias_pas: client.alias_pas || "",
          referred_by: client.referred_by || "",
          observations: client.observations || ""
        };
        errors = {};
      }
    }
    function formatDate(dateStr) {
      if (!dateStr) return "N/A";
      return new Date(dateStr).toLocaleDateString("es-ES");
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (clientId) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="backdrop svelte-mh26do"></div> <div class="modal-panel svelte-mh26do"><div class="modal-header svelte-mh26do"><div class="header-content svelte-mh26do">`);
        if (store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("from") === "policy") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button class="back-btn svelte-mh26do" title="Volver a póliza">`);
          Arrow_left($$renderer3, { size: 20 });
          $$renderer3.push(`<!----></button>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div class="icon-wrapper svelte-mh26do">`);
        User($$renderer3, { size: 24 });
        $$renderer3.push(`<!----></div> <div class="svelte-mh26do"><h2 class="svelte-mh26do">`);
        if (loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`Cargando...`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (client) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`${escape_html(client.first_name)} ${escape_html(client.last_name)}`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></h2> `);
        if (client && !loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="subtitle svelte-mh26do">${escape_html(client.email_primary || "No email")}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div></div> <div class="header-actions svelte-mh26do">`);
        if (!isEditMode && !loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button class="icon-btn svelte-mh26do" title="Edit client">`);
          Pen($$renderer3, { size: 18 });
          $$renderer3.push(`<!----></button>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <button class="icon-btn svelte-mh26do" title="Close">`);
        X($$renderer3, { size: 20 });
        $$renderer3.push(`<!----></button></div></div> <div class="modal-content svelte-mh26do">`);
        if (loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="loading-state svelte-mh26do"><p class="svelte-mh26do">Cargando datos del cliente...</p></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (client) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<form class="svelte-mh26do"><section class="form-section svelte-mh26do"><h3 class="svelte-mh26do">Información Personal</h3> <div class="form-row svelte-mh26do"><div class="form-field svelte-mh26do"><label for="first_name" class="svelte-mh26do">Nombre *</label> `);
            Input($$renderer3, {
              id: "first_name",
              error: errors.first_name,
              required: true,
              disabled: !isEditMode,
              get value() {
                return formData.first_name;
              },
              set value($$value) {
                formData.first_name = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="last_name" class="svelte-mh26do">Apellido *</label> `);
            Input($$renderer3, {
              id: "last_name",
              error: errors.last_name,
              required: true,
              disabled: !isEditMode,
              get value() {
                return formData.last_name;
              },
              set value($$value) {
                formData.last_name = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div></div> <div class="form-row svelte-mh26do"><div class="form-field svelte-mh26do"><label for="document_number" class="svelte-mh26do">DNI/CUIT</label> `);
            Input($$renderer3, {
              id: "document_number",
              error: errors.document_number,
              disabled: !isEditMode,
              get value() {
                return formData.document_number;
              },
              set value($$value) {
                formData.document_number = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="birth_date" class="svelte-mh26do">Fecha de Nacimiento</label> `);
            Input($$renderer3, {
              id: "birth_date",
              type: "date",
              error: errors.birth_date,
              disabled: !isEditMode,
              get value() {
                return formData.birth_date;
              },
              set value($$value) {
                formData.birth_date = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div></div></section> <section class="form-section svelte-mh26do"><h3 class="svelte-mh26do">Información de Contacto</h3> <div class="form-field svelte-mh26do"><label for="email_primary" class="svelte-mh26do">Email Principal</label> `);
            Input($$renderer3, {
              id: "email_primary",
              type: "email",
              error: errors.email_primary,
              disabled: !isEditMode,
              get value() {
                return formData.email_primary;
              },
              set value($$value) {
                formData.email_primary = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="email_secondary" class="svelte-mh26do">Email Secundario</label> `);
            Input($$renderer3, {
              id: "email_secondary",
              type: "email",
              error: errors.email_secondary,
              disabled: !isEditMode,
              get value() {
                return formData.email_secondary;
              },
              set value($$value) {
                formData.email_secondary = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-row svelte-mh26do"><div class="form-field svelte-mh26do"><label for="phone" class="svelte-mh26do">Celular</label> <div class="phone-input-wrapper svelte-mh26do">`);
            PhoneInputArgentina($$renderer3, {
              error: errors.phone,
              disabled: !isEditMode,
              get value() {
                return formData.phone;
              },
              set value($$value) {
                formData.phone = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----> `);
            if (!isEditMode && client.phone && isMobileNumber(client.phone)) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<a${attr("href", getWhatsAppUrl(client.phone))} target="_blank" rel="noopener noreferrer" class="whatsapp-btn svelte-mh26do" title="Abrir en WhatsApp">`);
              Message_circle($$renderer3, { size: 14 });
              $$renderer3.push(`<!----></a>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div></div> <div class="form-field svelte-mh26do"><label for="phone_landline" class="svelte-mh26do">Teléfono</label> `);
            Input($$renderer3, {
              id: "phone_landline",
              type: "tel",
              error: errors.phone_landline,
              disabled: !isEditMode,
              get value() {
                return formData.phone_landline;
              },
              set value($$value) {
                formData.phone_landline = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div></div></section> <section class="form-section svelte-mh26do"><h3 class="svelte-mh26do">Dirección</h3> <div class="form-row svelte-mh26do"><div class="form-field svelte-mh26do"><label for="street" class="svelte-mh26do">Calle</label> `);
            Input($$renderer3, {
              id: "street",
              error: errors.street,
              disabled: !isEditMode,
              placeholder: "Nombre de la calle",
              get value() {
                return formData.street;
              },
              set value($$value) {
                formData.street = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="street_number" class="svelte-mh26do">Número</label> `);
            Input($$renderer3, {
              id: "street_number",
              error: errors.street_number,
              disabled: !isEditMode,
              placeholder: "1234",
              get value() {
                return formData.street_number;
              },
              set value($$value) {
                formData.street_number = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="floor" class="svelte-mh26do">Piso</label> `);
            Input($$renderer3, {
              id: "floor",
              error: errors.floor,
              disabled: !isEditMode,
              placeholder: "5",
              get value() {
                return formData.floor;
              },
              set value($$value) {
                formData.floor = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="apartment" class="svelte-mh26do">Depto</label> `);
            Input($$renderer3, {
              id: "apartment",
              error: errors.apartment,
              disabled: !isEditMode,
              placeholder: "A",
              get value() {
                return formData.apartment;
              },
              set value($$value) {
                formData.apartment = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div></div> <div class="form-row svelte-mh26do"><div class="form-field svelte-mh26do"><label for="city" class="svelte-mh26do">Ciudad</label> `);
            Input($$renderer3, {
              id: "city",
              error: errors.city,
              disabled: !isEditMode,
              placeholder: "Ciudad",
              get value() {
                return formData.city;
              },
              set value($$value) {
                formData.city = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="province" class="svelte-mh26do">Provincia</label> `);
            Input($$renderer3, {
              id: "province",
              error: errors.province,
              disabled: !isEditMode,
              placeholder: "Provincia",
              get value() {
                return formData.province;
              },
              set value($$value) {
                formData.province = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="postal_code" class="svelte-mh26do">Código Postal</label> `);
            Input($$renderer3, {
              id: "postal_code",
              error: errors.postal_code,
              disabled: !isEditMode,
              placeholder: "1234",
              get value() {
                return formData.postal_code;
              },
              set value($$value) {
                formData.postal_code = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div></div></section> <section class="form-section svelte-mh26do"><h3 class="svelte-mh26do">Información Adicional</h3> <div class="form-field svelte-mh26do"><label for="alias_pas" class="svelte-mh26do">Alias PAS</label> `);
            Input($$renderer3, {
              id: "alias_pas",
              error: errors.alias_pas,
              disabled: !isEditMode,
              get value() {
                return formData.alias_pas;
              },
              set value($$value) {
                formData.alias_pas = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="referred_by" class="svelte-mh26do">Referido Por</label> `);
            Input($$renderer3, {
              id: "referred_by",
              error: errors.referred_by,
              disabled: !isEditMode,
              get value() {
                return formData.referred_by;
              },
              set value($$value) {
                formData.referred_by = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-mh26do"><label for="observations" class="svelte-mh26do">Observaciones</label> `);
            if (isEditMode) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<textarea id="observations" rows="4" placeholder="Additional notes..." class="svelte-mh26do">`);
              const $$body = escape_html(formData.observations);
              if ($$body) {
                $$renderer3.push(`${$$body}`);
              }
              $$renderer3.push(`</textarea>`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<p class="field-value preserve-whitespace svelte-mh26do">${escape_html(client.observations || "Sin observaciones")}</p>`);
            }
            $$renderer3.push(`<!--]--></div></section>  `);
            if (!isEditMode && !store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("from")) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<section class="form-section policies-section svelte-mh26do"><div class="section-header-row svelte-mh26do"><h3 class="svelte-mh26do">`);
              File_text($$renderer3, { size: 20 });
              $$renderer3.push(`<!----> Pólizas (${escape_html(client.policies?.length || 0)})</h3> <button type="button" class="add-policy-btn svelte-mh26do">`);
              Plus($$renderer3, { size: 16 });
              $$renderer3.push(`<!----> Nueva Póliza</button></div> `);
              if (client.policies && client.policies.length > 0) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="policies-list svelte-mh26do"><!--[-->`);
                const each_array = ensure_array_like(client.policies);
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let policy = each_array[$$index];
                  $$renderer3.push(`<button type="button" class="policy-card svelte-mh26do"><div class="policy-info svelte-mh26do"><div class="policy-header svelte-mh26do"><strong class="policy-number svelte-mh26do">${escape_html(policy.policy_number || "S/N")}</strong> <span${attr_class("policy-status svelte-mh26do", void 0, { "active": policy.active, "inactive": !policy.active })}>${escape_html(policy.active ? "Activa" : "Inactiva")}</span></div> <div class="policy-meta svelte-mh26do"><span class="policy-type svelte-mh26do">${escape_html(policy.policy_type)}</span> `);
                  if (policy.insurer) {
                    $$renderer3.push("<!--[-->");
                    $$renderer3.push(`<span class="policy-separator svelte-mh26do">•</span> <span class="policy-insurer svelte-mh26do">${escape_html(policy.insurer)}</span>`);
                  } else {
                    $$renderer3.push("<!--[!-->");
                  }
                  $$renderer3.push(`<!--]--></div> `);
                  if (policy.expiry_date) {
                    $$renderer3.push("<!--[-->");
                    $$renderer3.push(`<div class="policy-date svelte-mh26do">Vence: ${escape_html(formatDate(policy.expiry_date))}</div>`);
                  } else {
                    $$renderer3.push("<!--[!-->");
                  }
                  $$renderer3.push(`<!--]--></div> <div class="policy-arrow svelte-mh26do">→</div></button>`);
                }
                $$renderer3.push(`<!--]--></div>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<div class="no-policies svelte-mh26do">`);
                File_text($$renderer3, { size: 32 });
                $$renderer3.push(`<!----> <p class="svelte-mh26do">Este cliente no tiene pólizas registradas</p> <button type="button" class="create-first-btn svelte-mh26do">`);
                Plus($$renderer3, { size: 16 });
                $$renderer3.push(`<!----> Crear primera póliza</button></div>`);
              }
              $$renderer3.push(`<!--]--></section>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></form>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div> `);
        if (isEditMode && !loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="modal-footer svelte-mh26do">`);
          Button($$renderer3, {
            variant: "ghost",
            onclick: toggleEdit,
            disabled: saving,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Cancelar`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----> `);
          Button($$renderer3, {
            variant: "primary",
            onclick: handleSave,
            disabled: saving,
            children: ($$renderer4) => {
              if (saving) {
                $$renderer4.push("<!--[-->");
                $$renderer4.push(`Guardando...`);
              } else {
                $$renderer4.push("<!--[!-->");
                Save($$renderer4, { size: 18 });
                $$renderer4.push(`<!----> Guardar Cambios`);
              }
              $$renderer4.push(`<!--]-->`);
            },
            $$slots: { default: true }
          });
          $$renderer3.push(`<!----></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]-->`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function ClientFilters($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { initialFilters } = $$props;
    const defaultFilters = {
      cities: []
    };
    initialFilters?.cities || defaultFilters.cities;
    initialFilters?.hasEmail;
    initialFilters?.hasPhone;
    initialFilters?.dateFrom || "";
    initialFilters?.dateTo || "";
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let clients = [];
    let loading = true;
    let loadingMore = false;
    let search = "";
    let showInactive = false;
    let sortBy = "first_name";
    let sortOrder = "asc";
    let currentPage = 1;
    let limit = 30;
    let total = 0;
    let hasMore = true;
    let appliedFilters = {
      cities: [],
      hasEmail: void 0,
      hasPhone: void 0,
      dateFrom: "",
      dateTo: ""
    };
    let clientId = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("clientId");
    let modalMode = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("mode") || "view";
    async function loadClients(append = false) {
      if (append) {
        loadingMore = true;
      } else {
        loading = true;
      }
      try {
        const params = new URLSearchParams({ page: currentPage.toString(), limit: limit.toString() });
        if (search) ;
        if (!showInactive) {
          params.append("active_only", "true");
        }
        params.append("sort_by", sortBy);
        params.append("sort_order", sortOrder);
        appliedFilters.cities.forEach((city) => {
          params.append("city", city);
        });
        if (appliedFilters.hasEmail !== void 0) {
          params.append("has_email", appliedFilters.hasEmail.toString());
        }
        if (appliedFilters.hasPhone !== void 0) {
          params.append("has_phone", appliedFilters.hasPhone.toString());
        }
        if (appliedFilters.dateFrom) {
          params.append("date_from", appliedFilters.dateFrom);
        }
        if (appliedFilters.dateTo) {
          params.append("date_to", appliedFilters.dateTo);
        }
        console.log("Fetching clients:", `/api/clients?${params}`);
        const response = await fetch(`/api/clients?${params}`);
        console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Result:", result);
        if (response.ok) {
          if (append) {
            clients = [...clients, ...result.clients || []];
          } else {
            clients = result.clients || [];
          }
          total = result.pagination?.total || 0;
          hasMore = clients.length < total;
        } else {
          showToast({
            type: "error",
            message: result.message || "Error al cargar clientes"
          });
          clients = [];
        }
      } catch (err) {
        console.error("Error loading clients:", err);
        showToast({ type: "error", message: "Error al cargar clientes" });
        clients = [];
      } finally {
        loading = false;
        loadingMore = false;
      }
    }
    function loadMore() {
      if (!loading && !loadingMore && hasMore) {
        currentPage++;
        loadClients(true);
      }
    }
    function closeClientModal(saved) {
      const url = new URL(window.location.href);
      url.searchParams.delete("clientId");
      url.searchParams.delete("mode");
      goto(url.pathname + url.search, {});
      if (saved) {
        loadClients();
      }
    }
    const activeFiltersCount = () => {
      let count = appliedFilters.cities.length;
      if (appliedFilters.hasEmail !== void 0) count++;
      if (appliedFilters.hasPhone !== void 0) count++;
      if (appliedFilters.dateFrom) count++;
      if (appliedFilters.dateTo) count++;
      return count;
    };
    function formatAddress(client) {
      const parts = [];
      const streetParts = [];
      if (client.street) streetParts.push(client.street);
      if (client.street_number) streetParts.push(client.street_number);
      if (client.floor) streetParts.push(`Piso ${client.floor}`);
      if (client.apartment) streetParts.push(`Depto ${client.apartment}`);
      if (streetParts.length > 0) {
        parts.push(streetParts.join(" "));
      }
      if (client.city) {
        parts.push(client.city);
      }
      if (client.province) {
        parts.push(client.province);
      }
      if (client.postal_code) {
        parts.push(`(CP ${client.postal_code})`);
      }
      return parts.length > 0 ? parts.join(", ") : "-";
    }
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Clientes - PAS Manager</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-1hp9571"><div class="page-header svelte-1hp9571"><div class="svelte-1hp9571"><h1 class="svelte-1hp9571">Clientes</h1> <p class="svelte-1hp9571">Gestiona tus clientes y su información</p></div> `);
    Button($$renderer2, {
      variant: "primary",
      onclick: () => goto(),
      children: ($$renderer3) => {
        Plus($$renderer3, { size: 18 });
        $$renderer3.push(`<!----> Nuevo Cliente`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="filters-toolbar svelte-1hp9571"><div class="search-box svelte-1hp9571">`);
    Search($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar clientes..."${attr("value", search)} class="svelte-1hp9571"/></div> <div class="toolbar-actions svelte-1hp9571"><button${attr_class("filter-btn svelte-1hp9571", void 0, { "active": activeFiltersCount() > 0 })} title="Filtros">`);
    Funnel($$renderer2, { size: 18 });
    $$renderer2.push(`<!----> `);
    if (activeFiltersCount() > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="filter-badge svelte-1hp9571">${escape_html(activeFiltersCount())}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    if (activeFiltersCount() > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="clear-filters-btn svelte-1hp9571" title="Limpiar filtros">`);
      X($$renderer2, { size: 18 });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="filter-checkbox svelte-1hp9571"><label class="checkbox-label svelte-1hp9571"><input type="checkbox"${attr("checked", showInactive, true)} class="svelte-1hp9571"/> <span class="svelte-1hp9571">Mostrar inactivos</span></label></div> <div class="sort-select svelte-1hp9571"><label for="sort-by" class="svelte-1hp9571">Ordenar por:</label> `);
    $$renderer2.select(
      {
        id: "sort-by",
        value: sortBy,
        onchange: () => {
          currentPage = 1;
          clients = [];
          loadClients();
        },
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.option(
          { value: "first_name", class: "" },
          ($$renderer4) => {
            $$renderer4.push(`Nombre`);
          },
          "svelte-1hp9571"
        );
        $$renderer3.option(
          { value: "last_name", class: "" },
          ($$renderer4) => {
            $$renderer4.push(`Apellido`);
          },
          "svelte-1hp9571"
        );
        $$renderer3.option(
          { value: "policy_count", class: "" },
          ($$renderer4) => {
            $$renderer4.push(`Cantidad de pólizas`);
          },
          "svelte-1hp9571"
        );
        $$renderer3.option(
          { value: "created_at", class: "" },
          ($$renderer4) => {
            $$renderer4.push(`Fecha creación`);
          },
          "svelte-1hp9571"
        );
        $$renderer3.option(
          { value: "updated_at", class: "" },
          ($$renderer4) => {
            $$renderer4.push(`Última actualización`);
          },
          "svelte-1hp9571"
        );
      },
      "svelte-1hp9571"
    );
    $$renderer2.push(` <button class="sort-order-btn svelte-1hp9571"${attr("title", "Ascendente")}>`);
    {
      $$renderer2.push("<!--[-->");
      Arrow_up($$renderer2, { size: 16 });
    }
    $$renderer2.push(`<!--]--></button></div> <div class="results-count svelte-1hp9571">`);
    if (loading && clients.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="count-skeleton svelte-1hp9571"></span>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="count-text svelte-1hp9571">${escape_html(clients.length)}</span> <span class="count-separator svelte-1hp9571">/</span> <span class="count-total svelte-1hp9571">${escape_html(total)}</span>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    if (loading) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="skeleton-list svelte-1hp9571"><!--[-->`);
      const each_array = ensure_array_like(Array(5));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        Skeleton($$renderer2, { height: "60px" });
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (clients.length === 0) {
        $$renderer2.push("<!--[-->");
        EmptyState($$renderer2, {
          icon: Users,
          title: "No hay clientes",
          description: "Comienza agregando tu primer cliente",
          action: {
            label: "Nuevo Cliente",
            onclick: () => goto()
          }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        Table($$renderer2, {
          children: ($$renderer3) => {
            $$renderer3.push(`<thead class="svelte-1hp9571"><tr class="svelte-1hp9571"><th class="svelte-1hp9571">Nombre</th><th class="svelte-1hp9571">DNI/CUIT</th><th class="svelte-1hp9571">Email</th><th class="svelte-1hp9571">Celular</th><th class="svelte-1hp9571">Teléfono</th><th class="svelte-1hp9571">Domicilio</th><th class="svelte-1hp9571">Creado</th><th class="text-center svelte-1hp9571">Pólizas</th><th class="text-right svelte-1hp9571">Acciones</th></tr></thead> <tbody class="svelte-1hp9571"><!--[-->`);
            const each_array_1 = ensure_array_like(clients);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let client = each_array_1[$$index_1];
              $$renderer3.push(`<tr class="svelte-1hp9571"><td class="svelte-1hp9571"><button class="copyable-btn name-cell svelte-1hp9571" title="Click para copiar nombre">${escape_html(client.first_name)}
                ${escape_html(client.last_name)}</button></td><td class="svelte-1hp9571">`);
              if (client.document_number) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<button class="copyable-btn id-cell svelte-1hp9571" title="Click para copiar DNI/CUIT">${escape_html(client.document_number)}</button>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<span class="text-muted svelte-1hp9571">-</span>`);
              }
              $$renderer3.push(`<!--]--></td><td class="svelte-1hp9571">`);
              if (client.email_primary) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<button class="copyable-btn email svelte-1hp9571" title="Click para copiar">`);
                Mail($$renderer3, { size: 14 });
                $$renderer3.push(`<!----> ${escape_html(client.email_primary)}</button>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<span class="text-muted svelte-1hp9571">-</span>`);
              }
              $$renderer3.push(`<!--]--></td><td class="svelte-1hp9571">`);
              if (client.phone) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="phone-cell svelte-1hp9571"><button class="copyable-btn phone svelte-1hp9571" title="Click para copiar">`);
                Phone($$renderer3, { size: 14 });
                $$renderer3.push(`<!----> ${escape_html(client.phone)}</button> `);
                if (isMobileNumber(client.phone)) {
                  $$renderer3.push("<!--[-->");
                  $$renderer3.push(`<a${attr("href", getWhatsAppUrl(client.phone))} target="_blank" rel="noopener noreferrer" class="whatsapp-btn svelte-1hp9571" title="Abrir en WhatsApp">`);
                  Message_circle($$renderer3, { size: 20, fill: "#25d36690" });
                  $$renderer3.push(`<!----></a>`);
                } else {
                  $$renderer3.push("<!--[!-->");
                }
                $$renderer3.push(`<!--]--></div>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<span class="text-muted svelte-1hp9571">-</span>`);
              }
              $$renderer3.push(`<!--]--></td><td class="svelte-1hp9571">`);
              if (client.phone_landline) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<button class="copyable-btn phone svelte-1hp9571" title="Click para copiar">`);
                Phone($$renderer3, { size: 14 });
                $$renderer3.push(`<!----> ${escape_html(client.phone_landline)}</button>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<span class="text-muted svelte-1hp9571">-</span>`);
              }
              $$renderer3.push(`<!--]--></td><td class="svelte-1hp9571">`);
              if (formatAddress(client) !== "-") {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<button class="copyable-btn address-cell svelte-1hp9571" title="Click para copiar">${escape_html(formatAddress(client))}</button>`);
              } else {
                $$renderer3.push("<!--[!-->");
                $$renderer3.push(`<span class="text-muted svelte-1hp9571">-</span>`);
              }
              $$renderer3.push(`<!--]--></td><td class="text-nowrap svelte-1hp9571">${escape_html(new Date(client.created_at).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" }))}</td><td class="text-center svelte-1hp9571"><div class="policies-count svelte-1hp9571">`);
              File_text($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> <span class="svelte-1hp9571">${escape_html(client.active_policies_count || 0)}</span></div></td><td class="text-right svelte-1hp9571"><div class="actions svelte-1hp9571"><button class="action-btn view-btn svelte-1hp9571" title="Ver detalles">`);
              Eye($$renderer3, { size: 16 });
              $$renderer3.push(`<!----></button> <button class="action-btn danger svelte-1hp9571" title="Eliminar">`);
              Trash($$renderer3, { size: 16 });
              $$renderer3.push(`<!----></button></div></td></tr>`);
            }
            $$renderer3.push(`<!--]--></tbody>`);
          }
        });
        $$renderer2.push(`<!----> `);
        InfiniteScroll($$renderer2, { hasMore, onLoadMore: loadMore });
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    ClientModal($$renderer2, { clientId, mode: modalMode, onClose: closeClientModal });
    $$renderer2.push(`<!----> `);
    ClientFilters($$renderer2, {
      initialFilters: appliedFilters
    });
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};

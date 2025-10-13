import { a3 as sanitize_props, _ as spread_props, a4 as slot, a6 as head, Y as ensure_array_like } from "../../../../chunks/index2.js";
import { C as Card } from "../../../../chunks/Card.js";
import { T as Tabs, M as Mail, E as EmptyState, a as Table, B as Badge } from "../../../../chunks/Tabs.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
import "../../../../chunks/notifications.js";
import { U as User } from "../../../../chunks/user.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { P as Plus } from "../../../../chunks/EmptyState.svelte_svelte_type_style_lang.js";
import { U as Users } from "../../../../chunks/users.js";
import { e as escape_html } from "../../../../chunks/context.js";
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
function Trash($$renderer, $$props) {
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
    ["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }],
    ["path", { "d": "M3 6h18" }],
    ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trash" },
    $$sanitized_props,
    {
      /**
       * @component @name Trash
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkgNnYxNGEyIDIgMCAwIDEtMiAySDdhMiAyIDAgMCAxLTItMlY2IiAvPgogIDxwYXRoIGQ9Ik0zIDZoMTgiIC8+CiAgPHBhdGggZD0iTTggNlY0YTIgMiAwIDAgMSAyLTJoNGEyIDIgMCAwIDEgMiAydjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/trash
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
    let activeTab = "profile";
    let loadingProfile = false;
    let loadingCompany = false;
    let loadingInvite = false;
    const tabs = [
      { id: "profile", label: "Perfil" },
      { id: "company", label: "Empresa" },
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
                $$renderer5.push(`<!----></div> <div class="svelte-6qgtij"><h2 class="svelte-6qgtij">Perfil de Usuario</h2> <p class="svelte-6qgtij">Actualiza tu información personal y contraseña</p></div></div> <form class="svelte-6qgtij"><div class="form-grid svelte-6qgtij"><div class="form-group full-width svelte-6qgtij"><label class="svelte-6qgtij">Email</label> `);
                Input($$renderer5, { value: profileData.email, disabled: true });
                $$renderer5.push(`<!----> <small class="help-text svelte-6qgtij">El email no se puede cambiar</small></div> <div class="form-group svelte-6qgtij"><label class="svelte-6qgtij">Nueva Contraseña</label> `);
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
                $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label class="svelte-6qgtij">Confirmar Contraseña</label> `);
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
                  $$renderer5.push(`<!----></div> <div class="svelte-6qgtij"><h2 class="svelte-6qgtij">Datos de la Empresa</h2> <p class="svelte-6qgtij">Información de tu empresa u organización</p></div></div> <form class="svelte-6qgtij"><div class="form-grid svelte-6qgtij"><div class="form-group full-width svelte-6qgtij"><label class="svelte-6qgtij">Nombre de la Empresa</label> `);
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
                  $$renderer5.push(`<!----></div> <div class="form-group full-width svelte-6qgtij"><label class="svelte-6qgtij">Dirección</label> `);
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
                  $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label class="svelte-6qgtij">Ciudad</label> `);
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
                  $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label class="svelte-6qgtij">Código Postal</label> `);
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
                  $$renderer5.push(`<!----></div> <div class="form-group svelte-6qgtij"><label class="svelte-6qgtij">Teléfono</label> `);
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
                      const each_array = ensure_array_like(data.invitations);
                      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                        let invitation = each_array[$$index];
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
                            const each_array_1 = ensure_array_like(data.users);
                            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                              let user = each_array_1[$$index_1];
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

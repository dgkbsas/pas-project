import { a3 as sanitize_props, _ as spread_props, a4 as slot, a6 as head, Y as ensure_array_like, V as attr_class, a0 as stringify, W as attr } from "../../../../chunks/index2.js";
import { C as Card } from "../../../../chunks/Card.js";
import { B as Button } from "../../../../chunks/Button.js";
/* empty css                                                     */
import { U as Users } from "../../../../chunks/users.js";
import { F as File_text } from "../../../../chunks/file-text.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { e as escape_html } from "../../../../chunks/context.js";
function Circle_alert($$renderer, $$props) {
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
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }],
    [
      "line",
      { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "circle-alert" },
    $$sanitized_props,
    {
      /**
       * @component @name CircleAlert
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-alert
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
function Trending_up($$renderer, $$props) {
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
    ["path", { "d": "M16 7h6v6" }],
    ["path", { "d": "m22 7-8.5 8.5-5-5L2 17" }]
  ];
  Icon($$renderer, spread_props([
    { name: "trending-up" },
    $$sanitized_props,
    {
      /**
       * @component @name TrendingUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgN2g2djYiIC8+CiAgPHBhdGggZD0ibTIyIDctOC41IDguNS01LTVMMiAxNyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/trending-up
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
    function formatTimeAgo(date) {
      const now = /* @__PURE__ */ new Date();
      const then = new Date(date);
      const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1e3);
      if (diffInSeconds < 60) return "Hace un momento";
      if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
      if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
      if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
      return then.toLocaleDateString("es-ES", { month: "short", day: "numeric" });
    }
    const stats = [
      {
        title: "Clientes Activos",
        value: data.stats.clientsCount.toString(),
        icon: Users,
        color: "primary"
      },
      {
        title: "Pólizas Vigentes",
        value: data.stats.activePoliciesCount.toString(),
        icon: File_text,
        color: "success"
      },
      {
        title: "Por Vencer (30 días)",
        value: data.stats.expiringPoliciesCount.toString(),
        icon: Circle_alert,
        color: "warning"
      },
      {
        title: "Renovaciones Este Mes",
        value: data.stats.renewalsThisMonthCount.toString(),
        icon: Trending_up,
        color: "info"
      }
    ];
    const recentActivities = [
      ...data.recentActivity.clients.map((client) => ({
        type: "new_client",
        title: "Nuevo cliente registrado",
        description: `${client.first_name} ${client.last_name}`,
        time: formatTimeAgo(client.created_at),
        icon: Users
      })),
      ...data.recentActivity.policies.map((policy) => ({
        type: "new_policy",
        title: "Nueva póliza creada",
        description: `${policy.policy_type} - ${policy.clients?.first_name || ""} ${policy.clients?.last_name || ""}`.trim() || "Cliente",
        time: formatTimeAgo(policy.created_at),
        icon: File_text
      }))
    ].sort((a, b) => {
      const clientDescA = data.recentActivity.clients.find((c) => a.description === `${c.first_name} ${c.last_name}`);
      const policyDescA = data.recentActivity.policies.find((p) => a.description.includes(p.policy_type));
      const dateA = clientDescA?.created_at || policyDescA?.created_at || "";
      const clientDescB = data.recentActivity.clients.find((c) => b.description === `${c.first_name} ${c.last_name}`);
      const policyDescB = data.recentActivity.policies.find((p) => b.description.includes(p.policy_type));
      const dateB = clientDescB?.created_at || policyDescB?.created_at || "";
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    }).slice(0, 5);
    const quickActions = [
      { label: "Nuevo Cliente", href: "/clientes/nuevo", icon: Users },
      {
        label: "Nueva Póliza",
        href: "/polizas/nuevo",
        icon: File_text
      },
      { label: "Ver Pólizas", href: "/polizas", icon: Circle_alert }
    ];
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Dashboard - PAS Manager</title>`);
      });
    });
    $$renderer2.push(`<div class="dashboard svelte-1tyszyy"><div class="dashboard-header svelte-1tyszyy"><div class="svelte-1tyszyy"><h1 class="svelte-1tyszyy">Dashboard</h1> <p class="svelte-1tyszyy">Bienvenido de vuelta, ${escape_html(data.userProfile?.full_name || "Usuario")}</p></div></div> <div class="stats-grid svelte-1tyszyy"><!--[-->`);
    const each_array = ensure_array_like(stats);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let stat = each_array[i];
      stat.icon;
      $$renderer2.push(`<div class="svelte-1tyszyy">`);
      Card($$renderer2, {
        class: "stat-card",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="stat-content svelte-1tyszyy"><div${attr_class(`stat-icon stat-icon-${stringify(stat.color)}`, "svelte-1tyszyy")}>`);
          {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]--></div> <div class="stat-details svelte-1tyszyy"><div class="stat-label svelte-1tyszyy">${escape_html(stat.title)}</div> <div class="stat-value svelte-1tyszyy">${escape_html(stat.value)}</div></div></div>`);
        }
      });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="quick-actions svelte-1tyszyy"><h2 class="svelte-1tyszyy">Acciones Rápidas</h2> <div class="actions-grid svelte-1tyszyy"><!--[-->`);
    const each_array_1 = ensure_array_like(quickActions);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let action = each_array_1[$$index_1];
      action.icon;
      $$renderer2.push(`<a${attr("href", action.href)} class="action-card svelte-1tyszyy">`);
      {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <span class="svelte-1tyszyy">${escape_html(action.label)}</span></a>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="recent-section svelte-1tyszyy">`);
    {
      let header = function($$renderer3) {
        $$renderer3.push(`<h2 class="svelte-1tyszyy">Actividad Reciente</h2>`);
      }, footer = function($$renderer3) {
        $$renderer3.push(`<a href="/actividades" class="svelte-1tyszyy">`);
        Button($$renderer3, {
          variant: "ghost",
          size: "sm",
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Ver todas las actividades`);
          },
          $$slots: { default: true }
        });
        $$renderer3.push(`<!----></a>`);
      };
      Card($$renderer2, {
        header,
        footer,
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="activity-list svelte-1tyszyy"><!--[-->`);
          const each_array_2 = ensure_array_like(recentActivities);
          for (let i = 0, $$length = each_array_2.length; i < $$length; i++) {
            let activity = each_array_2[i];
            activity.icon;
            $$renderer3.push(`<div class="activity-item svelte-1tyszyy"><div class="activity-icon svelte-1tyszyy">`);
            {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div> <div class="activity-content svelte-1tyszyy"><div class="activity-title svelte-1tyszyy">${escape_html(activity.title)}</div> <div class="activity-description svelte-1tyszyy">${escape_html(activity.description)}</div></div> <div class="activity-time svelte-1tyszyy">${escape_html(activity.time)}</div></div>`);
          }
          $$renderer3.push(`<!--]--></div>`);
        }
      });
    }
    $$renderer2.push(`<!----></div></div>`);
  });
}
export {
  _page as default
};

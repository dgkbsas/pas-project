import { e as escape_html } from "../../../../chunks/context.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/notifications.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
import { C as Card } from "../../../../chunks/Card.js";
import { $ as attributes, a0 as stringify } from "../../../../chunks/index2.js";
function Label($$renderer, $$props) {
  let {
    required = false,
    class: className = "",
    children,
    $$slots,
    $$events,
    ...rest
  } = $$props;
  $$renderer.push(`<label${attributes({ class: `label ${stringify(className)}`, ...rest }, "svelte-1uz2vuh")}>`);
  children?.($$renderer);
  $$renderer.push(`<!----> `);
  if (required) {
    $$renderer.push("<!--[-->");
    $$renderer.push(`<span class="required svelte-1uz2vuh">*</span>`);
  } else {
    $$renderer.push("<!--[!-->");
  }
  $$renderer.push(`<!--]--></label>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data, form } = $$props;
    let email = "";
    let password = "";
    let loading = false;
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="auth-container fade-in svelte-1i2smtp">`);
      {
        let header = function($$renderer4) {
          $$renderer4.push(`<div class="header-content svelte-1i2smtp"><div class="logo svelte-1i2smtp"><span class="logo-icon svelte-1i2smtp">📋</span> <span class="logo-text svelte-1i2smtp">PAS Manager</span></div> <h1 class="svelte-1i2smtp">Iniciar Sesión</h1> <p class="subtitle svelte-1i2smtp">Accede a tu cuenta</p></div>`);
        };
        Card($$renderer3, {
          class: "auth-card",
          header,
          children: ($$renderer4) => {
            $$renderer4.push(`<form method="POST" action="?/login" class="form svelte-1i2smtp"><div class="form-group svelte-1i2smtp">`);
            Label($$renderer4, {
              for: "email",
              required: true,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Email`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Input($$renderer4, {
              id: "email",
              name: "email",
              type: "email",
              placeholder: "tu@email.com",
              disabled: loading,
              required: true,
              get value() {
                return email;
              },
              set value($$value) {
                email = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> <div class="form-group svelte-1i2smtp">`);
            Label($$renderer4, {
              for: "password",
              required: true,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Contraseña`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Input($$renderer4, {
              id: "password",
              name: "password",
              type: "password",
              placeholder: "••••••••",
              disabled: loading,
              required: true,
              get value() {
                return password;
              },
              set value($$value) {
                password = $$value;
                $$settled = false;
              }
            });
            $$renderer4.push(`<!----></div> `);
            Button($$renderer4, {
              type: "submit",
              class: "w-full",
              loading,
              disabled: loading,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html("Iniciar Sesión")}`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----></form> <div class="signup-link svelte-1i2smtp">¿No tienes cuenta? <a href="/auth/signup" class="svelte-1i2smtp">Regístrate aquí</a></div>`);
          }
        });
      }
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

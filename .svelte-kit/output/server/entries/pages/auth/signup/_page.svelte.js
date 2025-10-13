import { a6 as head } from "../../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "clsx";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { B as Button } from "../../../../chunks/Button.js";
import { I as Input } from "../../../../chunks/Input.js";
import { C as Card } from "../../../../chunks/Card.js";
/* empty css                                                       */
import "../../../../chunks/notifications.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let email = "";
    let password = "";
    let confirmPassword = "";
    let companyName = "";
    let fullName = "";
    let loading = false;
    let errors = {};
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head($$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Crear Cuenta - PAS Manager</title>`);
        });
      });
      $$renderer3.push(`<div class="signup-container svelte-ff5z5w"><div class="signup-wrapper svelte-ff5z5w"><div class="signup-header svelte-ff5z5w"><h1 class="svelte-ff5z5w">Crear Cuenta</h1> `);
      {
        $$renderer3.push("<!--[!-->");
        $$renderer3.push(`<p class="svelte-ff5z5w">Comienza a gestionar tus pólizas de seguros</p>`);
      }
      $$renderer3.push(`<!--]--></div> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          {
            $$renderer4.push("<!--[!-->");
            {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`<form class="svelte-ff5z5w">`);
              {
                $$renderer4.push("<!--[!-->");
              }
              $$renderer4.push(`<!--]--> `);
              Input($$renderer4, {
                type: "text",
                label: "Nombre Completo",
                placeholder: "Juan Pérez",
                error: errors.fullName,
                required: true,
                disabled: loading,
                get value() {
                  return fullName;
                },
                set value($$value) {
                  fullName = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----> `);
              Input($$renderer4, {
                type: "email",
                label: "Email",
                placeholder: "tu@email.com",
                error: errors.email,
                required: true,
                disabled: false,
                get value() {
                  return email;
                },
                set value($$value) {
                  email = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----> `);
              {
                $$renderer4.push("<!--[-->");
                Input($$renderer4, {
                  type: "text",
                  label: "Nombre de la Empresa",
                  placeholder: "Mi Empresa S.A.",
                  error: errors.companyName,
                  required: true,
                  disabled: loading,
                  get value() {
                    return companyName;
                  },
                  set value($$value) {
                    companyName = $$value;
                    $$settled = false;
                  }
                });
              }
              $$renderer4.push(`<!--]--> `);
              Input($$renderer4, {
                type: "password",
                label: "Contraseña",
                placeholder: "••••••••",
                error: errors.password,
                required: true,
                disabled: loading,
                get value() {
                  return password;
                },
                set value($$value) {
                  password = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----> `);
              Input($$renderer4, {
                type: "password",
                label: "Confirmar Contraseña",
                placeholder: "••••••••",
                error: errors.confirmPassword,
                required: true,
                disabled: loading,
                get value() {
                  return confirmPassword;
                },
                set value($$value) {
                  confirmPassword = $$value;
                  $$settled = false;
                }
              });
              $$renderer4.push(`<!----> `);
              Button($$renderer4, {
                type: "submit",
                variant: "primary",
                size: "lg",
                loading,
                class: "submit-button",
                children: ($$renderer5) => {
                  {
                    $$renderer5.push("<!--[!-->");
                    $$renderer5.push(`Crear Cuenta`);
                  }
                  $$renderer5.push(`<!--]-->`);
                },
                $$slots: { default: true }
              });
              $$renderer4.push(`<!----></form> <div class="divider svelte-ff5z5w"></div> <p class="login-link svelte-ff5z5w">¿Ya tienes una cuenta? <a href="/auth/login" class="link svelte-ff5z5w">Inicia sesión</a></p>`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        }
      });
      $$renderer3.push(`<!----></div></div>`);
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

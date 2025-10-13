import { a6 as head } from "../../../../../../chunks/index2.js";
import { g as goto } from "../../../../../../chunks/client.js";
import { B as Button } from "../../../../../../chunks/Button.js";
import { I as Input } from "../../../../../../chunks/Input.js";
import { C as Card } from "../../../../../../chunks/Card.js";
import "../../../../../../chunks/notifications.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { S as Save } from "../../../../../../chunks/save.js";
import { e as escape_html } from "../../../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let loading = false;
    let formData = {
      name: data.client.name || "",
      email: data.client.email || "",
      phone: data.client.phone || "",
      address: data.client.address || "",
      city: data.client.city || "",
      postal_code: data.client.postal_code || "",
      id_number: data.client.id_number || "",
      notes: data.client.notes || ""
    };
    let errors = {};
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head($$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Editar Cliente - PAS Manager</title>`);
        });
      });
      $$renderer3.push(`<div class="page svelte-tr29t"><div class="page-header svelte-tr29t"><div class="svelte-tr29t">`);
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
      $$renderer3.push(`<!----> <h1 class="svelte-tr29t">Editar Cliente</h1> <p class="svelte-tr29t">Modifica los datos del cliente</p></div></div> <form class="svelte-tr29t">`);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-tr29t"><h2 class="svelte-tr29t">Información Personal</h2></div> <div class="form-grid svelte-tr29t"><div class="form-group full-width svelte-tr29t"><label for="name" class="svelte-tr29t">Nombre completo <span class="required svelte-tr29t">*</span></label> `);
          Input($$renderer4, {
            id: "name",
            placeholder: "Ej: Juan Pérez García",
            error: errors.name,
            required: true,
            get value() {
              return formData.name;
            },
            set value($$value) {
              formData.name = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-tr29t"><label for="email" class="svelte-tr29t">Email</label> `);
          Input($$renderer4, {
            id: "email",
            type: "email",
            placeholder: "ejemplo@email.com",
            error: errors.email,
            get value() {
              return formData.email;
            },
            set value($$value) {
              formData.email = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-tr29t"><label for="phone" class="svelte-tr29t">Teléfono</label> `);
          Input($$renderer4, {
            id: "phone",
            type: "tel",
            placeholder: "+34 612 345 678",
            error: errors.phone,
            get value() {
              return formData.phone;
            },
            set value($$value) {
              formData.phone = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-tr29t"><label for="id_number" class="svelte-tr29t">DNI/NIE</label> `);
          Input($$renderer4, {
            id: "id_number",
            placeholder: "12345678X",
            error: errors.id_number,
            get value() {
              return formData.id_number;
            },
            set value($$value) {
              formData.id_number = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-tr29t"><h2 class="svelte-tr29t">Dirección</h2></div> <div class="form-grid svelte-tr29t"><div class="form-group full-width svelte-tr29t"><label for="address" class="svelte-tr29t">Dirección</label> `);
          Input($$renderer4, {
            id: "address",
            placeholder: "Calle, número, piso...",
            error: errors.address,
            get value() {
              return formData.address;
            },
            set value($$value) {
              formData.address = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-tr29t"><label for="city" class="svelte-tr29t">Ciudad</label> `);
          Input($$renderer4, {
            id: "city",
            placeholder: "Madrid",
            error: errors.city,
            get value() {
              return formData.city;
            },
            set value($$value) {
              formData.city = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-tr29t"><label for="postal_code" class="svelte-tr29t">Código Postal</label> `);
          Input($$renderer4, {
            id: "postal_code",
            placeholder: "28001",
            error: errors.postal_code,
            get value() {
              return formData.postal_code;
            },
            set value($$value) {
              formData.postal_code = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-tr29t"><h2 class="svelte-tr29t">Notas adicionales</h2></div> <div class="form-group svelte-tr29t"><label for="notes" class="svelte-tr29t">Notas</label> <textarea id="notes" placeholder="Información adicional sobre el cliente..." rows="4" class="svelte-tr29t">`);
          const $$body = escape_html(formData.notes);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div>`);
        }
      });
      $$renderer3.push(`<!----> <div class="form-actions svelte-tr29t">`);
      Button($$renderer3, {
        type: "button",
        variant: "outline",
        onclick: () => goto(),
        disabled: loading,
        children: ($$renderer4) => {
          $$renderer4.push(`<!---->Cancelar`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----> `);
      Button($$renderer3, {
        type: "submit",
        variant: "primary",
        disabled: loading,
        children: ($$renderer4) => {
          Save($$renderer4, { size: 18 });
          $$renderer4.push(`<!----> ${escape_html("Guardar Cambios")}`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></form></div>`);
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

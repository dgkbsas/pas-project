import { a6 as head } from "../../../../../chunks/index2.js";
import { g as goto } from "../../../../../chunks/client.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { I as Input } from "../../../../../chunks/Input.js";
import { S as Select } from "../../../../../chunks/Select.js";
import { C as Card } from "../../../../../chunks/Card.js";
import "../../../../../chunks/notifications.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
import { S as Save } from "../../../../../chunks/save.js";
import { e as escape_html } from "../../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let loading = false;
    let formData = {
      client_id: "",
      policy_number: "",
      policy_type: "",
      payment_mode: "",
      start_date: "",
      expiry_date: "",
      vehicle_plate: "",
      observations: ""
    };
    let errors = {};
    const policyTypeOptions = [
      { value: "Auto", label: "Auto" },
      { value: "Hogar", label: "Hogar" },
      { value: "Vida", label: "Vida" },
      { value: "Salud", label: "Salud" },
      { value: "Negocio", label: "Negocio" },
      { value: "Otro", label: "Otro" }
    ];
    const paymentModeOptions = [
      { value: "Mensual", label: "Mensual" },
      { value: "Trimestral", label: "Trimestral" },
      { value: "Semestral", label: "Semestral" },
      { value: "Anual", label: "Anual" }
    ];
    const clientOptions = data.clients.map((c) => ({ value: c.id, label: `${c.first_name} ${c.last_name}` }));
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head($$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Nueva Póliza - PAS Manager</title>`);
        });
      });
      $$renderer3.push(`<div class="page svelte-1py8aeq"><div class="page-header svelte-1py8aeq"><div class="svelte-1py8aeq">`);
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
      $$renderer3.push(`<!----> <h1 class="svelte-1py8aeq">Nueva Póliza</h1> <p class="svelte-1py8aeq">Completa los datos para registrar una nueva póliza</p></div></div> <form class="svelte-1py8aeq">`);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-1py8aeq"><h2 class="svelte-1py8aeq">Información General</h2></div> <div class="form-grid svelte-1py8aeq"><div class="form-group svelte-1py8aeq"><label for="client_id" class="svelte-1py8aeq">Cliente <span class="required svelte-1py8aeq">*</span></label> `);
          Select($$renderer4, {
            id: "client_id",
            options: clientOptions,
            placeholder: "Selecciona un cliente",
            error: errors.client_id,
            required: true,
            get value() {
              return formData.client_id;
            },
            set value($$value) {
              formData.client_id = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-1py8aeq"><label for="policy_number" class="svelte-1py8aeq">Número de Póliza <span class="required svelte-1py8aeq">*</span></label> `);
          Input($$renderer4, {
            id: "policy_number",
            placeholder: "POL-2024-001",
            error: errors.policy_number,
            required: true,
            get value() {
              return formData.policy_number;
            },
            set value($$value) {
              formData.policy_number = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-1py8aeq"><label for="policy_type" class="svelte-1py8aeq">Tipo de Seguro <span class="required svelte-1py8aeq">*</span></label> `);
          Select($$renderer4, {
            id: "policy_type",
            options: policyTypeOptions,
            placeholder: "Selecciona un tipo",
            error: errors.policy_type,
            required: true,
            get value() {
              return formData.policy_type;
            },
            set value($$value) {
              formData.policy_type = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-1py8aeq"><label for="payment_mode" class="svelte-1py8aeq">Modalidad de Pago</label> `);
          Select($$renderer4, {
            id: "payment_mode",
            options: paymentModeOptions,
            placeholder: "Selecciona modalidad",
            error: errors.payment_mode,
            get value() {
              return formData.payment_mode;
            },
            set value($$value) {
              formData.payment_mode = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-1py8aeq"><label for="vehicle_plate" class="svelte-1py8aeq">Matrícula (si aplica)</label> `);
          Input($$renderer4, {
            id: "vehicle_plate",
            placeholder: "ABC1234",
            error: errors.vehicle_plate,
            get value() {
              return formData.vehicle_plate;
            },
            set value($$value) {
              formData.vehicle_plate = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-1py8aeq"><h2 class="svelte-1py8aeq">Fechas</h2></div> <div class="form-grid svelte-1py8aeq"><div class="form-group svelte-1py8aeq"><label for="start_date" class="svelte-1py8aeq">Fecha de Inicio <span class="required svelte-1py8aeq">*</span></label> `);
          Input($$renderer4, {
            id: "start_date",
            type: "date",
            error: errors.start_date,
            required: true,
            get value() {
              return formData.start_date;
            },
            set value($$value) {
              formData.start_date = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-1py8aeq"><label for="expiry_date" class="svelte-1py8aeq">Fecha de Vencimiento <span class="required svelte-1py8aeq">*</span></label> `);
          Input($$renderer4, {
            id: "expiry_date",
            type: "date",
            error: errors.expiry_date,
            required: true,
            get value() {
              return formData.expiry_date;
            },
            set value($$value) {
              formData.expiry_date = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-1py8aeq"><h2 class="svelte-1py8aeq">Observaciones</h2></div> <div class="form-group svelte-1py8aeq"><label for="observations" class="svelte-1py8aeq">Observaciones</label> <textarea id="observations" placeholder="Información adicional sobre la póliza..." rows="4" class="svelte-1py8aeq">`);
          const $$body = escape_html(formData.observations);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div>`);
        }
      });
      $$renderer3.push(`<!----> <div class="form-actions svelte-1py8aeq">`);
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
          $$renderer4.push(`<!----> ${escape_html("Guardar Póliza")}`);
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

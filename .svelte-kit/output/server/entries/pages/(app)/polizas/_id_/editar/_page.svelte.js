import { a6 as head } from "../../../../../../chunks/index2.js";
import { g as goto } from "../../../../../../chunks/client.js";
import { B as Button } from "../../../../../../chunks/Button.js";
import { I as Input } from "../../../../../../chunks/Input.js";
import { S as Select } from "../../../../../../chunks/Select.js";
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
      client_id: data.policy.client_id || "",
      policy_number: data.policy.policy_number || "",
      policy_type: data.policy.policy_type || "",
      insurer: data.policy.insurer || "",
      start_date: data.policy.start_date || "",
      end_date: data.policy.end_date || "",
      premium: data.policy.premium?.toString() || "",
      coverage: data.policy.coverage?.toString() || "",
      status: data.policy.status || "active",
      notes: data.policy.notes || ""
    };
    let errors = {};
    const statusOptions = [
      { value: "active", label: "Activa" },
      { value: "cancelled", label: "Cancelada" },
      { value: "expired", label: "Vencida" }
    ];
    const policyTypeOptions = [
      { value: "Seguro de vida", label: "Seguro de vida" },
      { value: "Seguro de hogar", label: "Seguro de hogar" },
      { value: "Seguro de auto", label: "Seguro de auto" },
      { value: "Seguro de salud", label: "Seguro de salud" },
      { value: "Seguro de negocio", label: "Seguro de negocio" },
      { value: "Otro", label: "Otro" }
    ];
    const clientOptions = data.clients.map((c) => ({ value: c.id, label: `${c.first_name} ${c.last_name}` }));
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head($$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Editar Póliza - PAS Manager</title>`);
        });
      });
      $$renderer3.push(`<div class="page svelte-fvw11y"><div class="page-header svelte-fvw11y"><div class="svelte-fvw11y">`);
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
      $$renderer3.push(`<!----> <h1 class="svelte-fvw11y">Editar Póliza</h1> <p class="svelte-fvw11y">Modifica los datos de la póliza</p></div></div> <form class="svelte-fvw11y">`);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-fvw11y"><h2 class="svelte-fvw11y">Información General</h2></div> <div class="form-grid svelte-fvw11y"><div class="form-group svelte-fvw11y"><label for="client_id" class="svelte-fvw11y">Cliente <span class="required svelte-fvw11y">*</span></label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-fvw11y"><label for="policy_number" class="svelte-fvw11y">Número de Póliza <span class="required svelte-fvw11y">*</span></label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-fvw11y"><label for="policy_type" class="svelte-fvw11y">Tipo de Seguro <span class="required svelte-fvw11y">*</span></label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-fvw11y"><label for="insurer" class="svelte-fvw11y">Aseguradora <span class="required svelte-fvw11y">*</span></label> `);
          Input($$renderer4, {
            id: "insurer",
            placeholder: "Nombre de la aseguradora",
            error: errors.insurer,
            required: true,
            get value() {
              return formData.insurer;
            },
            set value($$value) {
              formData.insurer = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-fvw11y"><label for="status" class="svelte-fvw11y">Estado</label> `);
          Select($$renderer4, {
            id: "status",
            options: statusOptions,
            error: errors.status,
            get value() {
              return formData.status;
            },
            set value($$value) {
              formData.status = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-fvw11y"><h2 class="svelte-fvw11y">Fechas y Montos</h2></div> <div class="form-grid svelte-fvw11y"><div class="form-group svelte-fvw11y"><label for="start_date" class="svelte-fvw11y">Fecha de Inicio <span class="required svelte-fvw11y">*</span></label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-fvw11y"><label for="end_date" class="svelte-fvw11y">Fecha de Vencimiento <span class="required svelte-fvw11y">*</span></label> `);
          Input($$renderer4, {
            id: "end_date",
            type: "date",
            error: errors.end_date,
            required: true,
            get value() {
              return formData.end_date;
            },
            set value($$value) {
              formData.end_date = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-fvw11y"><label for="premium" class="svelte-fvw11y">Prima Anual (€) <span class="required svelte-fvw11y">*</span></label> `);
          Input($$renderer4, {
            id: "premium",
            type: "number",
            step: "0.01",
            placeholder: "0.00",
            error: errors.premium,
            required: true,
            get value() {
              return formData.premium;
            },
            set value($$value) {
              formData.premium = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-fvw11y"><label for="coverage" class="svelte-fvw11y">Cobertura (€)</label> `);
          Input($$renderer4, {
            id: "coverage",
            type: "number",
            step: "0.01",
            placeholder: "0.00",
            error: errors.coverage,
            get value() {
              return formData.coverage;
            },
            set value($$value) {
              formData.coverage = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-fvw11y"><h2 class="svelte-fvw11y">Notas adicionales</h2></div> <div class="form-group svelte-fvw11y"><label for="notes" class="svelte-fvw11y">Notas</label> <textarea id="notes" placeholder="Información adicional sobre la póliza..." rows="4" class="svelte-fvw11y">`);
          const $$body = escape_html(formData.notes);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div>`);
        }
      });
      $$renderer3.push(`<!----> <div class="form-actions svelte-fvw11y">`);
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

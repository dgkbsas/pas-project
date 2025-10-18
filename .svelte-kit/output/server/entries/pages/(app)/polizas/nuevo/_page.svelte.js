import { V as attr_class, W as attr, a5 as bind_props, a6 as head } from "../../../../../chunks/index2.js";
import { g as goto } from "../../../../../chunks/client.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { e as escape_html } from "../../../../../chunks/context.js";
import "clsx";
import { I as Input } from "../../../../../chunks/Input.js";
import { S as Select } from "../../../../../chunks/Select.js";
import { S as Search } from "../../../../../chunks/search.js";
import { C as Card } from "../../../../../chunks/Card.js";
import { s as showToast } from "../../../../../chunks/notifications.js";
import { S as Save } from "../../../../../chunks/save.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
function SearchableClientSelect($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      value = "",
      placeholder = "Buscar cliente...",
      error = "",
      required = false,
      disabled = false,
      onValueChange
    } = $$props;
    let searchQuery = "";
    $$renderer2.push(`<div${attr_class("searchable-select svelte-1kxtmwo", void 0, { "error": !!error, "disabled": disabled })}><div class="input-wrapper svelte-1kxtmwo"><div class="icon-left svelte-1kxtmwo">`);
    Search($$renderer2, { size: 18 });
    $$renderer2.push(`<!----></div> <input type="text"${attr("value", searchQuery)}${attr("placeholder", placeholder)}${attr("required", required, true)}${attr("disabled", disabled, true)} autocomplete="off" class="svelte-1kxtmwo"/> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="error-message svelte-1kxtmwo">${escape_html(error)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="help-text svelte-1kxtmwo">Si el cliente no existe, <a href="/clientes/nuevo" target="_blank" class="svelte-1kxtmwo">créalo primero</a></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { value });
  });
}
function PolicyForm($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      mode = "create",
      initialData = {},
      loading = false,
      errors = {},
      onCancel
    } = $$props;
    let insurers = [];
    let formData = {
      client_id: initialData.client_id || "",
      policy_number: initialData.policy_number || "",
      policy_type: initialData.policy_type || "",
      insurer_id: initialData.insurer_id || "",
      payment_mode: initialData.payment_mode || "",
      start_date: initialData.start_date || "",
      expiry_date: initialData.expiry_date || "",
      review_date: initialData.review_date || "",
      vehicle_plate: initialData.vehicle_plate || "",
      insured_sum: initialData.insured_sum || "",
      accessories: initialData.accessories || "",
      premium: initialData.premium || "",
      endorsement: initialData.endorsement || "",
      observations: initialData.observations || ""
    };
    const policyTypeOptions = [
      { value: "auto", label: "Auto" },
      { value: "home", label: "Hogar" },
      { value: "life", label: "Vida" },
      { value: "health", label: "Salud" },
      { value: "business", label: "Negocio" },
      { value: "other", label: "Otro" }
    ];
    const paymentModeOptions = [
      { value: "monthly", label: "Mensual" },
      { value: "quarterly", label: "Trimestral" },
      { value: "biannual", label: "Semestral" },
      { value: "annual", label: "Anual" }
    ];
    function suggestReviewDate() {
      if (!formData.expiry_date) {
        showToast({
          type: "error",
          message: "Primero ingresa la fecha de vencimiento"
        });
        return;
      }
      const expiryDate = new Date(formData.expiry_date);
      expiryDate.setDate(expiryDate.getDate() - 30);
      formData.review_date = expiryDate.toISOString().split("T")[0];
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<form class="svelte-107edav">`);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-107edav"><h2 class="svelte-107edav">Información General</h2></div> <div class="form-grid svelte-107edav"><div class="form-group svelte-107edav"><label for="client_id" class="svelte-107edav">Cliente <span class="required svelte-107edav">*</span></label> `);
          SearchableClientSelect($$renderer4, {
            placeholder: "Buscar cliente por nombre, email o documento...",
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-107edav"><label for="policy_number" class="svelte-107edav">Número de Póliza <span class="required svelte-107edav">*</span></label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-107edav"><label for="policy_type" class="svelte-107edav">Tipo de Seguro <span class="required svelte-107edav">*</span></label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-107edav"><label for="payment_mode" class="svelte-107edav">Modalidad de Pago</label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-107edav"><label for="insurer_id" class="svelte-107edav">Compañía Aseguradora</label> `);
          {
            $$renderer4.push("<!--[!-->");
            if (insurers.length === 0) {
              $$renderer4.push("<!--[-->");
              Input($$renderer4, { disabled: true, placeholder: "Sin compañías creadas" });
              $$renderer4.push(`<!----> <small class="help-text svelte-107edav">Crea aseguradoras en Configuración → Aseguradoras</small>`);
            } else {
              $$renderer4.push("<!--[!-->");
              Select($$renderer4, {
                id: "insurer_id",
                options: insurers.map((i) => ({ value: i.id, label: i.name })),
                placeholder: "Selecciona aseguradora",
                error: errors.insurer_id,
                get value() {
                  return formData.insurer_id;
                },
                set value($$value) {
                  formData.insurer_id = $$value;
                  $$settled = false;
                }
              });
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]--></div> <div class="form-group svelte-107edav"><label for="vehicle_plate" class="svelte-107edav">Matrícula (si aplica)</label> `);
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
          $$renderer4.push(`<div class="card-header svelte-107edav"><h2 class="svelte-107edav">Información Financiera</h2></div> <div class="form-grid svelte-107edav"><div class="form-group svelte-107edav"><label for="insured_sum" class="svelte-107edav">Suma Asegurada (ARS)</label> `);
          Input($$renderer4, {
            id: "insured_sum",
            type: "number",
            step: "0.01",
            placeholder: "0.00",
            error: errors.insured_sum,
            get value() {
              return formData.insured_sum;
            },
            set value($$value) {
              formData.insured_sum = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-107edav"><label for="premium" class="svelte-107edav">Premio (ARS)</label> `);
          Input($$renderer4, {
            id: "premium",
            type: "number",
            step: "0.01",
            placeholder: "0.00",
            error: errors.premium,
            get value() {
              return formData.premium;
            },
            set value($$value) {
              formData.premium = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group full-width svelte-107edav"><label for="accessories" class="svelte-107edav">Accesorios</label> <textarea id="accessories" placeholder="Descripción de accesorios incluidos..." rows="2" maxlength="2000" class="svelte-107edav">`);
          const $$body = escape_html(formData.accessories);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea> <small class="help-text svelte-107edav">${escape_html(formData.accessories?.length || 0)}/2000 caracteres</small></div> <div class="form-group full-width svelte-107edav"><label for="endorsement" class="svelte-107edav">Endoso</label> <textarea id="endorsement" placeholder="Detalles del endoso..." rows="2" maxlength="2000" class="svelte-107edav">`);
          const $$body_1 = escape_html(formData.endorsement);
          if ($$body_1) {
            $$renderer4.push(`${$$body_1}`);
          }
          $$renderer4.push(`</textarea> <small class="help-text svelte-107edav">${escape_html(formData.endorsement?.length || 0)}/2000 caracteres</small></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-107edav"><h2 class="svelte-107edav">Fechas</h2></div> <div class="form-grid svelte-107edav"><div class="form-group svelte-107edav"><label for="start_date" class="svelte-107edav">Fecha de Inicio <span class="required svelte-107edav">*</span></label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-107edav"><label for="expiry_date" class="svelte-107edav">Fecha de Vencimiento <span class="required svelte-107edav">*</span></label> `);
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
          $$renderer4.push(`<!----></div> <div class="form-group svelte-107edav"><label for="review_date" class="svelte-107edav">Fecha de Revisión</label> <div style="display: flex; gap: 8px;" class="svelte-107edav">`);
          Input($$renderer4, {
            id: "review_date",
            type: "date",
            error: errors.review_date,
            style: "flex: 1;",
            get value() {
              return formData.review_date;
            },
            set value($$value) {
              formData.review_date = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----> `);
          Button($$renderer4, {
            type: "button",
            variant: "outline",
            onclick: suggestReviewDate,
            disabled: !formData.expiry_date,
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Sugerir (30 días antes)`);
            },
            $$slots: { default: true }
          });
          $$renderer4.push(`<!----></div> <small class="help-text svelte-107edav">Fecha sugerida para revisar la póliza antes del vencimiento</small></div></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-107edav"><h2 class="svelte-107edav">Observaciones</h2></div> <div class="form-group svelte-107edav"><label for="observations" class="svelte-107edav">Observaciones</label> <textarea id="observations" placeholder="Información adicional sobre la póliza..." rows="4" maxlength="1000" class="svelte-107edav">`);
          const $$body_2 = escape_html(formData.observations);
          if ($$body_2) {
            $$renderer4.push(`${$$body_2}`);
          }
          $$renderer4.push(`</textarea> <small class="help-text svelte-107edav">${escape_html(formData.observations?.length || 0)}/1000 caracteres</small></div>`);
        }
      });
      $$renderer3.push(`<!----> `);
      if (mode === "create") {
        $$renderer3.push("<!--[-->");
        Card($$renderer3, {
          children: ($$renderer4) => {
            $$renderer4.push(`<div class="card-header svelte-107edav"><h2 class="svelte-107edav">Seguimientos</h2></div> <div class="info-message svelte-107edav"><p class="svelte-107edav">ℹ️ Los seguimientos se pueden agregar después de crear la póliza</p></div>`);
          }
        });
      } else {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--> <div class="form-actions svelte-107edav">`);
      Button($$renderer3, {
        type: "button",
        variant: "outline",
        onclick: onCancel,
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
          $$renderer4.push(`<!----> ${escape_html(loading ? "Guardando..." : mode === "create" ? "Guardar Póliza" : "Guardar Cambios")}`);
        },
        $$slots: { default: true }
      });
      $$renderer3.push(`<!----></div></form>`);
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
    let loading = false;
    let errors = {};
    let initialData = {};
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Nueva Póliza - PAS Manager</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-1py8aeq"><div class="page-header svelte-1py8aeq"><div class="svelte-1py8aeq">`);
    Button($$renderer2, {
      variant: "ghost",
      size: "sm",
      onclick: () => goto(),
      children: ($$renderer3) => {
        Arrow_left($$renderer3, { size: 18 });
        $$renderer3.push(`<!----> Volver`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <h1 class="svelte-1py8aeq">Nueva Póliza</h1> <p class="svelte-1py8aeq">Completa los datos para registrar una nueva póliza</p></div></div> `);
    PolicyForm($$renderer2, {
      mode: "create",
      initialData,
      loading,
      errors,
      onCancel: () => goto()
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};

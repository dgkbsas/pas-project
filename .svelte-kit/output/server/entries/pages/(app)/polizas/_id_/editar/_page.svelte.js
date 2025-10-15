import { a6 as head, Y as ensure_array_like } from "../../../../../../chunks/index2.js";
import { g as goto } from "../../../../../../chunks/client.js";
import { B as Button } from "../../../../../../chunks/Button.js";
import { I as Input } from "../../../../../../chunks/Input.js";
import { P as PolicyForm, S as Select } from "../../../../../../chunks/PolicyForm.js";
import { C as Card } from "../../../../../../chunks/Card.js";
import { s as showToast } from "../../../../../../chunks/notifications.js";
import { A as Arrow_left } from "../../../../../../chunks/arrow-left.js";
import { P as Plus } from "../../../../../../chunks/plus.js";
import { C as Calendar } from "../../../../../../chunks/calendar.js";
import { S as Square_pen } from "../../../../../../chunks/square-pen.js";
import { T as Trash } from "../../../../../../chunks/trash.js";
import { e as escape_html } from "../../../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let loading = false;
    let loadingFollowups = false;
    let followups = [];
    let followupTypes = [];
    let editingFollowupId = null;
    let errors = {};
    let initialData = {
      client_id: data.policy.client_id || "",
      policy_number: data.policy.policy_number || "",
      policy_type: data.policy.policy_type || "",
      insurer_id: data.policy.insurer_id || "",
      payment_mode: data.policy.payment_mode || "",
      start_date: data.policy.start_date || "",
      expiry_date: data.policy.expiry_date || "",
      review_date: data.policy.review_date || "",
      vehicle_plate: data.policy.vehicle_plate || "",
      insured_sum: data.policy.insured_sum?.toString() || "",
      accessories: data.policy.accessories || "",
      premium: data.policy.premium?.toString() || "",
      endorsement: data.policy.endorsement || "",
      observations: data.policy.observations || ""
    };
    let followupForm = {
      followup_type: "",
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      description: "",
      status: ""
    };
    async function loadFollowups() {
      loadingFollowups = true;
      try {
        const response = await fetch(`/api/policies/${data.policy.id}/followups`);
        const result = await response.json();
        if (response.ok) {
          followups = result.followups || [];
        }
      } catch (err) {
        console.error("Error loading followups:", err);
      } finally {
        loadingFollowups = false;
      }
    }
    async function handleSubmit(formData) {
      loading = true;
      errors = {};
      try {
        const response = await fetch(`/api/policies/${data.policy.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (response.ok) {
          showToast({ type: "success", message: "Póliza actualizada exitosamente" });
          goto("/polizas");
        } else {
          if (result.errors) {
            errors = result.errors;
          }
          showToast({
            type: "error",
            message: result.message || "Error al actualizar póliza"
          });
        }
      } catch (err) {
        showToast({ type: "error", message: "Error al actualizar póliza" });
      } finally {
        loading = false;
      }
    }
    async function handleCreateFollowup() {
      if (!followupForm.followup_type || !followupForm.date) {
        showToast({ type: "error", message: "Tipo y fecha son requeridos" });
        return;
      }
      try {
        const response = await fetch(`/api/policies/${data.policy.id}/followups`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(followupForm)
        });
        if (response.ok) {
          showToast({ type: "success", message: "Seguimiento creado" });
          resetFollowupForm();
          await loadFollowups();
        } else {
          const result = await response.json();
          showToast({
            type: "error",
            message: result.message || "Error al crear seguimiento"
          });
        }
      } catch (err) {
        showToast({ type: "error", message: "Error al crear seguimiento" });
      }
    }
    async function handleUpdateFollowup(id) {
      try {
        const response = await fetch(`/api/followups/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(followupForm)
        });
        if (response.ok) {
          showToast({ type: "success", message: "Seguimiento actualizado" });
          editingFollowupId = null;
          resetFollowupForm();
          await loadFollowups();
        } else {
          const result = await response.json();
          showToast({
            type: "error",
            message: result.message || "Error al actualizar seguimiento"
          });
        }
      } catch (err) {
        showToast({ type: "error", message: "Error al actualizar seguimiento" });
      }
    }
    function resetFollowupForm() {
      editingFollowupId = null;
      followupForm = {
        followup_type: "",
        date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        description: "",
        status: ""
      };
    }
    function formatDate(dateString) {
      return new Date(dateString).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
    }
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
      $$renderer3.push(`<!----> <h1 class="svelte-fvw11y">Editar Póliza</h1> <p class="svelte-fvw11y">Modifica los datos de la póliza y gestiona seguimientos</p></div></div> `);
      PolicyForm($$renderer3, {
        mode: "edit",
        initialData,
        loading,
        errors,
        onSubmit: handleSubmit,
        onCancel: () => goto()
      });
      $$renderer3.push(`<!----> `);
      Card($$renderer3, {
        children: ($$renderer4) => {
          $$renderer4.push(`<div class="card-header svelte-fvw11y"><h2 class="svelte-fvw11y">Seguimientos</h2> <p class="subtitle svelte-fvw11y">Historial de seguimientos y novedades de la póliza</p></div> <div class="followup-form svelte-fvw11y"><h3 class="svelte-fvw11y">${escape_html(editingFollowupId ? "Editar Seguimiento" : "Nuevo Seguimiento")}</h3> <div class="form-grid svelte-fvw11y"><div class="form-group svelte-fvw11y"><label for="followup_type" class="svelte-fvw11y">Tipo <span class="required svelte-fvw11y">*</span></label> `);
          if (followupTypes.length > 0) {
            $$renderer4.push("<!--[-->");
            Select($$renderer4, {
              id: "followup_type",
              options: followupTypes.map((t) => ({ value: t, label: t })),
              placeholder: "Selecciona tipo",
              required: true,
              get value() {
                return followupForm.followup_type;
              },
              set value($$value) {
                followupForm.followup_type = $$value;
                $$settled = false;
              }
            });
          } else {
            $$renderer4.push("<!--[!-->");
            Input($$renderer4, {
              placeholder: "Tipo de seguimiento",
              required: true,
              get value() {
                return followupForm.followup_type;
              },
              set value($$value) {
                followupForm.followup_type = $$value;
                $$settled = false;
              }
            });
          }
          $$renderer4.push(`<!--]--></div> <div class="form-group svelte-fvw11y"><label for="followup_date" class="svelte-fvw11y">Fecha <span class="required svelte-fvw11y">*</span></label> `);
          Input($$renderer4, {
            id: "followup_date",
            type: "date",
            required: true,
            get value() {
              return followupForm.date;
            },
            set value($$value) {
              followupForm.date = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group svelte-fvw11y"><label for="followup_status" class="svelte-fvw11y">Estado</label> `);
          Input($$renderer4, {
            id: "followup_status",
            placeholder: "Estado (opcional)",
            get value() {
              return followupForm.status;
            },
            set value($$value) {
              followupForm.status = $$value;
              $$settled = false;
            }
          });
          $$renderer4.push(`<!----></div> <div class="form-group full-width svelte-fvw11y"><label for="followup_description" class="svelte-fvw11y">Descripción</label> <textarea id="followup_description" placeholder="Describe el seguimiento..." rows="2" class="svelte-fvw11y">`);
          const $$body = escape_html(followupForm.description);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea></div></div> <div class="form-actions svelte-fvw11y">`);
          if (editingFollowupId) {
            $$renderer4.push("<!--[-->");
            Button($$renderer4, {
              variant: "ghost",
              onclick: resetFollowupForm,
              type: "button",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Cancelar`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              variant: "primary",
              onclick: () => handleUpdateFollowup(editingFollowupId),
              type: "button",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Actualizar Seguimiento`);
              },
              $$slots: { default: true }
            });
            $$renderer4.push(`<!---->`);
          } else {
            $$renderer4.push("<!--[!-->");
            Button($$renderer4, {
              variant: "primary",
              onclick: handleCreateFollowup,
              type: "button",
              children: ($$renderer5) => {
                Plus($$renderer5, { size: 18 });
                $$renderer5.push(`<!----> Agregar Seguimiento`);
              },
              $$slots: { default: true }
            });
          }
          $$renderer4.push(`<!--]--></div></div> `);
          if (loadingFollowups) {
            $$renderer4.push("<!--[-->");
            $$renderer4.push(`<div class="loading-text svelte-fvw11y">Cargando seguimientos...</div>`);
          } else {
            $$renderer4.push("<!--[!-->");
            if (followups.length === 0) {
              $$renderer4.push("<!--[-->");
              $$renderer4.push(`<div class="empty-state svelte-fvw11y">`);
              Calendar($$renderer4, { size: 48 });
              $$renderer4.push(`<!----> <p class="svelte-fvw11y">No hay seguimientos registrados</p> <small class="svelte-fvw11y">Agrega el primer seguimiento arriba</small></div>`);
            } else {
              $$renderer4.push("<!--[!-->");
              $$renderer4.push(`<div class="followups-list svelte-fvw11y"><!--[-->`);
              const each_array = ensure_array_like(followups);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let followup = each_array[$$index];
                $$renderer4.push(`<div class="followup-item svelte-fvw11y"><div class="followup-header svelte-fvw11y"><div class="followup-type-badge svelte-fvw11y">${escape_html(followup.followup_type)}</div> <div class="followup-date svelte-fvw11y">${escape_html(formatDate(followup.date))}</div> <div class="followup-actions svelte-fvw11y"><button class="action-btn svelte-fvw11y" title="Editar">`);
                Square_pen($$renderer4, { size: 16 });
                $$renderer4.push(`<!----></button> <button class="action-btn danger svelte-fvw11y" title="Eliminar">`);
                Trash($$renderer4, { size: 16 });
                $$renderer4.push(`<!----></button></div></div> `);
                if (followup.status) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div class="followup-status svelte-fvw11y">Estado: ${escape_html(followup.status)}</div>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--> `);
                if (followup.description) {
                  $$renderer4.push("<!--[-->");
                  $$renderer4.push(`<div class="followup-description svelte-fvw11y">${escape_html(followup.description)}</div>`);
                } else {
                  $$renderer4.push("<!--[!-->");
                }
                $$renderer4.push(`<!--]--></div>`);
              }
              $$renderer4.push(`<!--]--></div>`);
            }
            $$renderer4.push(`<!--]-->`);
          }
          $$renderer4.push(`<!--]-->`);
        }
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

import { a1 as store_get, a2 as unsubscribe_stores, Y as ensure_array_like, a6 as head, W as attr, V as attr_class } from "../../../../chunks/index2.js";
import { g as goto } from "../../../../chunks/client.js";
import { p as page } from "../../../../chunks/stores.js";
import { B as Button } from "../../../../chunks/Button.js";
import { E as EmptyState, T as Table } from "../../../../chunks/Table.js";
import { F as Funnel, S as Skeleton } from "../../../../chunks/Skeleton.js";
import { I as InfiniteScroll } from "../../../../chunks/InfiniteScroll.js";
/* empty css                                                      */
import { B as Badge } from "../../../../chunks/Badge.js";
import { e as escape_html } from "../../../../chunks/context.js";
import "clsx";
import { U as User } from "../../../../chunks/user.js";
import { C as Calendar } from "../../../../chunks/calendar.js";
import { E as Eye } from "../../../../chunks/eye.js";
import { T as Trash } from "../../../../chunks/trash.js";
/* empty css                                                      */
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import { I as Input } from "../../../../chunks/Input.js";
import { s as showToast } from "../../../../chunks/notifications.js";
import { A as Arrow_left } from "../../../../chunks/arrow-left.js";
import { F as File_text } from "../../../../chunks/file-text.js";
import { P as Pen } from "../../../../chunks/pen.js";
import { X } from "../../../../chunks/x.js";
import { S as Save } from "../../../../chunks/save.js";
import { P as Plus } from "../../../../chunks/plus.js";
import { S as Search } from "../../../../chunks/search.js";
import { A as Arrow_down } from "../../../../chunks/arrow-down.js";
function PolicyCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { policy, index } = $$props;
    function getStatusBadge(active, expiryDate) {
      if (!active) {
        return { variant: "error", label: "Inactiva" };
      }
      const expiry = new Date(expiryDate);
      const today = /* @__PURE__ */ new Date();
      if (expiry < today) {
        return { variant: "warning", label: "Vencida" };
      }
      return { variant: "success", label: "Activa" };
    }
    function getDaysUntilExpiry(expiryDate) {
      const today = /* @__PURE__ */ new Date();
      const expiry = new Date(expiryDate);
      const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
      return diff;
    }
    function formatDate(date) {
      return new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
    }
    const statusBadge = getStatusBadge(policy.active, policy.expiry_date);
    const daysUntil = getDaysUntilExpiry(policy.expiry_date);
    const clientName = policy.client ? `${policy.client.first_name} ${policy.client.last_name}` : "Cliente no disponible";
    $$renderer2.push(`<div class="policy-card svelte-1jbgj2g"><div class="card-header svelte-1jbgj2g"><span class="card-number svelte-1jbgj2g">#${escape_html(index + 1)}</span> `);
    Badge($$renderer2, {
      variant: statusBadge.variant,
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->${escape_html(statusBadge.label)}`);
      }
    });
    $$renderer2.push(`<!----></div> <div class="card-body svelte-1jbgj2g"><div class="policy-number svelte-1jbgj2g">${escape_html(policy.policy_number || "S/N")}</div> <div class="policy-type svelte-1jbgj2g">${escape_html(policy.policy_type)}</div> <div class="card-info svelte-1jbgj2g"><div class="info-item svelte-1jbgj2g">`);
    User($$renderer2, { size: 14 });
    $$renderer2.push(`<!----> <span>${escape_html(clientName)}</span></div> <div class="info-item svelte-1jbgj2g">`);
    Calendar($$renderer2, { size: 14 });
    $$renderer2.push(`<!----> <span>${escape_html(formatDate(policy.expiry_date))}</span> `);
    if (daysUntil <= 30 && daysUntil > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="expiry-badge svelte-1jbgj2g">${escape_html(daysUntil)}d</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="card-actions svelte-1jbgj2g"><button class="action-btn svelte-1jbgj2g" title="Ver">`);
    Eye($$renderer2, { size: 16 });
    $$renderer2.push(`<!----></button> <button class="action-btn danger svelte-1jbgj2g" title="Eliminar">`);
    Trash($$renderer2, { size: 16 });
    $$renderer2.push(`<!----></button></div></div>`);
  });
}
function PolicyFilters($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { initialFilters } = $$props;
    const defaultFilters = {
      policyTypes: [],
      paymentModes: [],
      insurers: [],
      statuses: []
    };
    initialFilters?.policyTypes || defaultFilters.policyTypes;
    initialFilters?.paymentModes || defaultFilters.paymentModes;
    initialFilters?.insurers || defaultFilters.insurers;
    initialFilters?.statuses || defaultFilters.statuses;
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function PolicyModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { policyId, mode = "view", onClose } = $$props;
    let policy = null;
    let loading = false;
    let saving = false;
    let isEditMode = mode === "edit";
    let insurers = [];
    let loadingInsurers = false;
    let formData = {
      policy_number: "",
      policy_type: "auto",
      insurer: "",
      payment_mode: "monthly",
      start_date: "",
      expiry_date: "",
      vehicle_plate: "",
      vehicle_brand: "",
      vehicle_model: "",
      observations: ""
    };
    let errors = {};
    async function loadPolicy() {
      if (!policyId) return;
      loading = true;
      try {
        const response = await fetch(`/api/policies/${policyId}`);
        const result = await response.json();
        if (response.ok) {
          policy = result.policy;
          formData = {
            policy_number: policy?.policy_number || "",
            policy_type: policy?.policy_type || "auto",
            insurer: policy?.insurer || "",
            payment_mode: policy?.payment_mode || "monthly",
            start_date: policy?.start_date || "",
            expiry_date: policy?.expiry_date || "",
            vehicle_plate: policy?.vehicle_plate || "",
            vehicle_brand: policy?.vehicle_brand || "",
            vehicle_model: policy?.vehicle_model || "",
            observations: policy?.observations || ""
          };
        } else {
          showToast({ type: "error", message: "Error loading policy" });
          onClose();
        }
      } catch (err) {
        showToast({ type: "error", message: "Error loading policy" });
        onClose();
      } finally {
        loading = false;
      }
    }
    async function handleSave() {
      if (!policyId) return;
      saving = true;
      errors = {};
      try {
        const response = await fetch(`/api/policies/${policyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (response.ok) {
          showToast({ type: "success", message: "Policy updated successfully" });
          isEditMode = false;
          await loadPolicy();
          onClose(true);
        } else {
          if (result.errors) {
            errors = result.errors;
          }
          showToast({
            type: "error",
            message: result.message || "Error updating policy"
          });
        }
      } catch (err) {
        showToast({ type: "error", message: "Error updating policy" });
      } finally {
        saving = false;
      }
    }
    function toggleEdit() {
      isEditMode = !isEditMode;
      if (!isEditMode && policy) {
        formData = {
          policy_number: policy.policy_number || "",
          policy_type: policy.policy_type || "auto",
          insurer: policy.insurer || "",
          payment_mode: policy.payment_mode || "monthly",
          start_date: policy.start_date || "",
          expiry_date: policy.expiry_date || "",
          vehicle_plate: policy.vehicle_plate || "",
          vehicle_brand: policy.vehicle_brand || "",
          vehicle_model: policy.vehicle_model || "",
          observations: policy.observations || ""
        };
        errors = {};
      }
    }
    const policyTypeLabels = {
      auto: "Auto",
      home: "Hogar",
      life: "Vida",
      health: "Salud",
      business: "Empresa",
      other: "Otro"
    };
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      if (policyId) {
        $$renderer3.push("<!--[-->");
        $$renderer3.push(`<div class="backdrop svelte-1yt9re3"></div> <div class="modal-panel svelte-1yt9re3"><div class="modal-header svelte-1yt9re3"><div class="header-content svelte-1yt9re3">`);
        if (store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("from") === "client") {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button class="back-btn svelte-1yt9re3" title="Volver a cliente">`);
          Arrow_left($$renderer3, { size: 20 });
          $$renderer3.push(`<!----></button>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <div class="icon-wrapper svelte-1yt9re3">`);
        File_text($$renderer3, { size: 24 });
        $$renderer3.push(`<!----></div> <div class="svelte-1yt9re3"><h2 class="svelte-1yt9re3">`);
        if (loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`Cargando...`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (policy) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`${escape_html(policy.policy_number || "Sin número")}`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></h2> `);
        if (policy && !loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<p class="subtitle svelte-1yt9re3">${escape_html(policyTypeLabels[policy.policy_type])}</p>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div></div> <div class="header-actions svelte-1yt9re3">`);
        if (!isEditMode && !loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<button class="icon-btn svelte-1yt9re3" title="Edit policy">`);
          Pen($$renderer3, { size: 18 });
          $$renderer3.push(`<!----></button>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> <button class="icon-btn svelte-1yt9re3" title="Close">`);
        X($$renderer3, { size: 20 });
        $$renderer3.push(`<!----></button></div></div> <div class="modal-content svelte-1yt9re3">`);
        if (loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="loading-state svelte-1yt9re3"><p class="svelte-1yt9re3">Cargando detalles de póliza...</p></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (policy) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`<form class="svelte-1yt9re3"><section class="form-section svelte-1yt9re3"><h3 class="svelte-1yt9re3">Información de la Póliza</h3> <div class="form-row svelte-1yt9re3"><div class="form-field svelte-1yt9re3"><label for="policy_number" class="svelte-1yt9re3">Número de Póliza</label> `);
            Input($$renderer3, {
              id: "policy_number",
              error: errors.policy_number,
              disabled: !isEditMode,
              get value() {
                return formData.policy_number;
              },
              set value($$value) {
                formData.policy_number = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-1yt9re3"><label for="policy_type" class="svelte-1yt9re3">Tipo de Póliza</label> `);
            $$renderer3.select(
              {
                id: "policy_type",
                value: formData.policy_type,
                disabled: !isEditMode,
                class: ""
              },
              ($$renderer4) => {
                $$renderer4.option(
                  { value: "auto", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Auto`);
                  },
                  "svelte-1yt9re3"
                );
                $$renderer4.option(
                  { value: "home", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Hogar`);
                  },
                  "svelte-1yt9re3"
                );
                $$renderer4.option(
                  { value: "life", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Vida`);
                  },
                  "svelte-1yt9re3"
                );
                $$renderer4.option(
                  { value: "health", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Salud`);
                  },
                  "svelte-1yt9re3"
                );
                $$renderer4.option(
                  { value: "business", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Empresa`);
                  },
                  "svelte-1yt9re3"
                );
                $$renderer4.option(
                  { value: "other", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Otro`);
                  },
                  "svelte-1yt9re3"
                );
              },
              "svelte-1yt9re3"
            );
            $$renderer3.push(`</div></div> <div class="form-row svelte-1yt9re3"><div class="form-field svelte-1yt9re3"><label for="insurer" class="svelte-1yt9re3">Aseguradora</label> `);
            $$renderer3.select(
              {
                id: "insurer",
                value: formData.insurer,
                disabled: !isEditMode || loadingInsurers,
                class: ""
              },
              ($$renderer4) => {
                {
                  $$renderer4.push("<!--[!-->");
                  if (insurers.length === 0) {
                    $$renderer4.push("<!--[-->");
                    $$renderer4.option(
                      { value: "", class: "" },
                      ($$renderer5) => {
                        $$renderer5.push(`No hay aseguradoras disponibles`);
                      },
                      "svelte-1yt9re3"
                    );
                  } else {
                    $$renderer4.push("<!--[!-->");
                    $$renderer4.option(
                      { value: "", class: "" },
                      ($$renderer5) => {
                        $$renderer5.push(`Seleccionar aseguradora`);
                      },
                      "svelte-1yt9re3"
                    );
                    $$renderer4.push(` <!--[-->`);
                    const each_array = ensure_array_like(insurers);
                    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                      let insurer = each_array[$$index];
                      $$renderer4.option(
                        { value: insurer.name, class: "" },
                        ($$renderer5) => {
                          $$renderer5.push(`${escape_html(insurer.name)}`);
                        },
                        "svelte-1yt9re3"
                      );
                    }
                    $$renderer4.push(`<!--]-->`);
                  }
                  $$renderer4.push(`<!--]-->`);
                }
                $$renderer4.push(`<!--]-->`);
              },
              "svelte-1yt9re3"
            );
            $$renderer3.push(` `);
            if (errors.insurer) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<span class="error-text svelte-1yt9re3">${escape_html(errors.insurer)}</span>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--></div> <div class="form-field svelte-1yt9re3"><label for="payment_mode" class="svelte-1yt9re3">Forma de Pago</label> `);
            $$renderer3.select(
              {
                id: "payment_mode",
                value: formData.payment_mode,
                disabled: !isEditMode,
                class: ""
              },
              ($$renderer4) => {
                $$renderer4.option(
                  { value: "monthly", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Mensual`);
                  },
                  "svelte-1yt9re3"
                );
                $$renderer4.option(
                  { value: "quarterly", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Trimestral`);
                  },
                  "svelte-1yt9re3"
                );
                $$renderer4.option(
                  { value: "semi-annual", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Semestral`);
                  },
                  "svelte-1yt9re3"
                );
                $$renderer4.option(
                  { value: "annual", class: "" },
                  ($$renderer5) => {
                    $$renderer5.push(`Anual`);
                  },
                  "svelte-1yt9re3"
                );
              },
              "svelte-1yt9re3"
            );
            $$renderer3.push(`</div></div> <div class="form-row svelte-1yt9re3"><div class="form-field svelte-1yt9re3"><label for="start_date" class="svelte-1yt9re3">Fecha de Inicio</label> `);
            Input($$renderer3, {
              id: "start_date",
              type: "date",
              error: errors.start_date,
              disabled: !isEditMode,
              get value() {
                return formData.start_date;
              },
              set value($$value) {
                formData.start_date = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div> <div class="form-field svelte-1yt9re3"><label for="expiry_date" class="svelte-1yt9re3">Fecha de Vencimiento</label> `);
            Input($$renderer3, {
              id: "expiry_date",
              type: "date",
              error: errors.expiry_date,
              disabled: !isEditMode,
              get value() {
                return formData.expiry_date;
              },
              set value($$value) {
                formData.expiry_date = $$value;
                $$settled = false;
              }
            });
            $$renderer3.push(`<!----></div></div></section> `);
            if (policy.policy_type === "auto" || isEditMode) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<section class="form-section svelte-1yt9re3"><h3 class="svelte-1yt9re3">Información del Vehículo</h3> <div class="form-field svelte-1yt9re3"><label for="vehicle_plate" class="svelte-1yt9re3">Patente</label> `);
              Input($$renderer3, {
                id: "vehicle_plate",
                error: errors.vehicle_plate,
                disabled: !isEditMode,
                get value() {
                  return formData.vehicle_plate;
                },
                set value($$value) {
                  formData.vehicle_plate = $$value;
                  $$settled = false;
                }
              });
              $$renderer3.push(`<!----></div> <div class="form-row svelte-1yt9re3"><div class="form-field svelte-1yt9re3"><label for="vehicle_brand" class="svelte-1yt9re3">Marca</label> `);
              Input($$renderer3, {
                id: "vehicle_brand",
                error: errors.vehicle_brand,
                disabled: !isEditMode,
                get value() {
                  return formData.vehicle_brand;
                },
                set value($$value) {
                  formData.vehicle_brand = $$value;
                  $$settled = false;
                }
              });
              $$renderer3.push(`<!----></div> <div class="form-field svelte-1yt9re3"><label for="vehicle_model" class="svelte-1yt9re3">Modelo</label> `);
              Input($$renderer3, {
                id: "vehicle_model",
                error: errors.vehicle_model,
                disabled: !isEditMode,
                get value() {
                  return formData.vehicle_model;
                },
                set value($$value) {
                  formData.vehicle_model = $$value;
                  $$settled = false;
                }
              });
              $$renderer3.push(`<!----></div></div></section>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]-->  `);
            if (!isEditMode && policy.client && !store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("from")) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<section class="form-section svelte-1yt9re3"><h3 class="svelte-1yt9re3">Cliente</h3> <div class="client-card svelte-1yt9re3"><div class="client-icon svelte-1yt9re3">`);
              User($$renderer3, { size: 20 });
              $$renderer3.push(`<!----></div> <div class="client-info svelte-1yt9re3"><div class="client-name svelte-1yt9re3">${escape_html(policy.client_full_name || "Sin nombre")}</div> <button type="button" class="link-btn svelte-1yt9re3">Ver cliente →</button></div></div></section>`);
            } else {
              $$renderer3.push("<!--[!-->");
            }
            $$renderer3.push(`<!--]--> <section class="form-section svelte-1yt9re3"><h3 class="svelte-1yt9re3">Observaciones</h3> <div class="form-field svelte-1yt9re3">`);
            if (isEditMode) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<textarea id="observations" rows="4" placeholder="Observaciones adicionales..." class="svelte-1yt9re3">`);
              const $$body = escape_html(formData.observations);
              if ($$body) {
                $$renderer3.push(`${$$body}`);
              }
              $$renderer3.push(`</textarea>`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<p class="field-value preserve-whitespace svelte-1yt9re3">${escape_html(policy.observations || "Sin observaciones")}</p>`);
            }
            $$renderer3.push(`<!--]--></div></section></form>`);
          } else {
            $$renderer3.push("<!--[!-->");
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]--></div> `);
        if (isEditMode && !loading) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="modal-footer svelte-1yt9re3">`);
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let policies = [];
    let loading = true;
    let loadingMore = false;
    let search = "";
    let sortBy = "created_at";
    let sortOrder = "desc";
    let showInactive = false;
    let currentPage = 1;
    let limit = 30;
    let total = 0;
    let hasMore = true;
    let appliedFilters = {
      policyTypes: [],
      paymentModes: [],
      insurers: [],
      statuses: []
    };
    let policyId = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("policyId");
    let modalMode = store_get($$store_subs ??= {}, "$page", page).url.searchParams.get("mode") || "view";
    const sortOptions = [
      { value: "created_at", label: "Fecha de creación" },
      { value: "expiry_date", label: "Fecha de vencimiento" },
      { value: "policy_number", label: "Número de póliza" },
      { value: "policy_type", label: "Tipo de póliza" },
      { value: "insurer", label: "Aseguradora" },
      { value: "payment_mode", label: "Forma de pago" }
    ];
    async function loadPolicies(append = false) {
      if (append) {
        loadingMore = true;
      } else {
        loading = true;
      }
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder
        });
        if (search) ;
        if (!showInactive) {
          params.append("active_only", "true");
        }
        appliedFilters.policyTypes.forEach((type) => {
          params.append("policy_type", type);
        });
        appliedFilters.paymentModes.forEach((mode) => {
          params.append("payment_mode", mode);
        });
        appliedFilters.insurers.forEach((insurer) => {
          params.append("insurer", insurer);
        });
        appliedFilters.statuses.forEach((status) => {
          params.append("status", status);
        });
        const response = await fetch(`/api/policies?${params}`);
        console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Result:", result);
        if (response.ok) {
          if (append) {
            policies = [...policies, ...result.policies || []];
          } else {
            policies = result.policies || [];
          }
          total = result.pagination?.total || 0;
          hasMore = policies.length < total;
        } else {
          showToast({
            type: "error",
            message: result.message || "Error al cargar pólizas"
          });
          policies = [];
        }
      } catch (err) {
        console.error("Error loading policies:", err);
        showToast({ type: "error", message: "Error al cargar pólizas" });
        policies = [];
      } finally {
        loading = false;
        loadingMore = false;
      }
    }
    function loadMore() {
      if (!loading && !loadingMore && hasMore) {
        currentPage++;
        loadPolicies(true);
      }
    }
    function formatDate(date) {
      return new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
    }
    function getStatusBadge(active, expiryDate) {
      if (!active) {
        return { variant: "error", label: "Inactiva" };
      }
      const expiry = new Date(expiryDate);
      const today = /* @__PURE__ */ new Date();
      if (expiry < today) {
        return { variant: "warning", label: "Vencida" };
      }
      return { variant: "success", label: "Activa" };
    }
    function getDaysUntilExpiry(expiryDate) {
      const today = /* @__PURE__ */ new Date();
      const expiry = new Date(expiryDate);
      const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1e3 * 60 * 60 * 24));
      return diff;
    }
    const activeFiltersCount = () => {
      let count = 0;
      count += appliedFilters.policyTypes.length;
      count += appliedFilters.paymentModes.length;
      count += appliedFilters.insurers.length;
      count += appliedFilters.statuses.length;
      return count;
    };
    function closePolicyModal(saved) {
      const url = new URL(window.location.href);
      url.searchParams.delete("policyId");
      url.searchParams.delete("mode");
      goto(url.pathname + url.search, {});
      if (saved) {
        currentPage = 1;
        policies = [];
        loadPolicies();
      }
    }
    head($$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Pólizas - PAS Manager</title>`);
      });
    });
    $$renderer2.push(`<div class="page svelte-17pngxe"><div class="page-header svelte-17pngxe"><div class="svelte-17pngxe"><h1 class="svelte-17pngxe">Pólizas</h1> <p class="svelte-17pngxe">Gestiona todas las pólizas de seguros</p></div> `);
    Button($$renderer2, {
      variant: "primary",
      onclick: () => goto(),
      children: ($$renderer3) => {
        Plus($$renderer3, { size: 18 });
        $$renderer3.push(`<!----> Nueva Póliza`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div> <div class="filters-toolbar svelte-17pngxe"><div class="search-box svelte-17pngxe">`);
    Search($$renderer2, { size: 20 });
    $$renderer2.push(`<!----> <input type="text" placeholder="Buscar pólizas..."${attr("value", search)} class="svelte-17pngxe"/></div> <div class="toolbar-actions svelte-17pngxe"><div class="filter-checkbox svelte-17pngxe"><label class="checkbox-label svelte-17pngxe"><input type="checkbox"${attr("checked", showInactive, true)} class="svelte-17pngxe"/> <span class="svelte-17pngxe">Mostrar inactivas</span></label></div> <button${attr_class("filter-btn svelte-17pngxe", void 0, { "active": activeFiltersCount() > 0 })} title="Filtros">`);
    Funnel($$renderer2, { size: 18 });
    $$renderer2.push(`<!----> `);
    if (activeFiltersCount() > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="filter-badge svelte-17pngxe">${escape_html(activeFiltersCount())}</span>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    if (activeFiltersCount() > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<button class="clear-filters-btn svelte-17pngxe" title="Limpiar filtros">`);
      X($$renderer2, { size: 18 });
      $$renderer2.push(`<!----></button>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="sort-select svelte-17pngxe"><label for="sort-by" class="svelte-17pngxe">Ordenar por:</label> `);
    $$renderer2.select(
      {
        id: "sort-by",
        value: sortBy,
        onchange: () => {
          currentPage = 1;
          policies = [];
          loadPolicies();
        },
        class: ""
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(sortOptions);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let option = each_array[$$index];
          $$renderer3.option(
            { value: option.value, class: "" },
            ($$renderer4) => {
              $$renderer4.push(`${escape_html(option.label)}`);
            },
            "svelte-17pngxe"
          );
        }
        $$renderer3.push(`<!--]-->`);
      },
      "svelte-17pngxe"
    );
    $$renderer2.push(` <button class="sort-order-btn svelte-17pngxe"${attr("title", "Descendente")}>`);
    {
      $$renderer2.push("<!--[!-->");
      Arrow_down($$renderer2, { size: 16 });
    }
    $$renderer2.push(`<!--]--></button></div> <div class="results-count svelte-17pngxe">`);
    if (loading && policies.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<span class="count-skeleton svelte-17pngxe"></span>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<span class="count-text svelte-17pngxe">${escape_html(policies.length)}</span> <span class="count-separator svelte-17pngxe">/</span> <span class="count-total svelte-17pngxe">${escape_html(total)}</span>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    if (loading) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="skeleton-list svelte-17pngxe"><!--[-->`);
      const each_array_1 = ensure_array_like(Array(5));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        each_array_1[$$index_1];
        Skeleton($$renderer2, { height: "60px" });
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (policies.length === 0) {
        $$renderer2.push("<!--[-->");
        EmptyState($$renderer2, {
          icon: File_text,
          title: "No hay pólizas",
          description: activeFiltersCount() > 0 ? "No se encontraron resultados" : "Comienza agregando tu primera póliza",
          action: activeFiltersCount() > 0 ? void 0 : { label: "Nueva Póliza", onclick: () => goto() }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="cards-grid svelte-17pngxe"><!--[-->`);
        const each_array_2 = ensure_array_like(policies);
        for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
          let policy = each_array_2[index];
          PolicyCard($$renderer2, {
            policy,
            index
          });
        }
        $$renderer2.push(`<!--]--></div> <div class="table-container svelte-17pngxe">`);
        Table($$renderer2, {
          children: ($$renderer3) => {
            $$renderer3.push(`<thead class="sticky-header svelte-17pngxe"><tr class="svelte-17pngxe"><th style="width: 60px" class="svelte-17pngxe">#</th><th class="svelte-17pngxe">N° Póliza</th><th class="svelte-17pngxe">Cliente</th><th class="svelte-17pngxe">Aseguradora</th><th class="svelte-17pngxe">Tipo</th><th class="svelte-17pngxe">Estado</th><th class="svelte-17pngxe">Vencimiento</th><th class="svelte-17pngxe">Creado</th><th class="text-right svelte-17pngxe">Acciones</th></tr></thead> <tbody class="svelte-17pngxe"><!--[-->`);
            const each_array_3 = ensure_array_like(policies);
            for (let index = 0, $$length = each_array_3.length; index < $$length; index++) {
              let policy = each_array_3[index];
              const statusBadge = getStatusBadge(policy.active, policy.expiry_date);
              const daysUntil = getDaysUntilExpiry(policy.expiry_date);
              const clientName = policy.client ? `${policy.client.first_name} ${policy.client.last_name}` : "Cliente no disponible";
              $$renderer3.push(`<tr class="svelte-17pngxe"><td class="row-number svelte-17pngxe">${escape_html(index + 1)}</td><td class="svelte-17pngxe"><button class="policy-number-btn svelte-17pngxe">${escape_html(policy.policy_number || "S/N")}</button></td><td class="svelte-17pngxe"><div class="client-info svelte-17pngxe">`);
              User($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> <button class="client-link-btn svelte-17pngxe">${escape_html(clientName)}</button></div></td><td class="svelte-17pngxe"><span class="insurer-name svelte-17pngxe">${escape_html(policy.insurer || "-")}</span></td><td class="svelte-17pngxe">${escape_html(policy.policy_type)}</td><td class="svelte-17pngxe">`);
              Badge($$renderer3, {
                variant: statusBadge.variant,
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(statusBadge.label)}`);
                }
              });
              $$renderer3.push(`<!----></td><td class="svelte-17pngxe"><div class="expiry-info svelte-17pngxe">`);
              Calendar($$renderer3, { size: 14 });
              $$renderer3.push(`<!----> <span${attr_class("svelte-17pngxe", void 0, { "warning": daysUntil <= 30 && daysUntil > 0 })}>${escape_html(formatDate(policy.expiry_date))}</span> `);
              if (daysUntil <= 30 && daysUntil > 0) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<span class="expiry-badge svelte-17pngxe">${escape_html(daysUntil)}d</span>`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--></div></td><td class="text-nowrap svelte-17pngxe">${escape_html(formatDate(policy.created_at))}</td><td class="text-right svelte-17pngxe"><div class="actions svelte-17pngxe"><button class="action-btn svelte-17pngxe" title="Ver">`);
              Eye($$renderer3, { size: 16 });
              $$renderer3.push(`<!----></button> <button class="action-btn danger svelte-17pngxe" title="Eliminar">`);
              Trash($$renderer3, { size: 16 });
              $$renderer3.push(`<!----></button></div></td></tr>`);
            }
            $$renderer3.push(`<!--]--></tbody>`);
          }
        });
        $$renderer2.push(`<!----></div> `);
        InfiniteScroll($$renderer2, { hasMore, onLoadMore: loadMore });
        $$renderer2.push(`<!---->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> `);
    PolicyFilters($$renderer2, {
      initialFilters: appliedFilters
    });
    $$renderer2.push(`<!----> `);
    PolicyModal($$renderer2, { policyId, mode: modalMode, onClose: closePolicyModal });
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};

import { a6 as head } from "../../../../../chunks/index2.js";
import { g as goto } from "../../../../../chunks/client.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { P as PolicyForm } from "../../../../../chunks/PolicyForm.js";
import { s as showToast } from "../../../../../chunks/notifications.js";
import { A as Arrow_left } from "../../../../../chunks/arrow-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let loading = false;
    let errors = {};
    let initialData = {};
    async function handleSubmit(formData) {
      loading = true;
      errors = {};
      try {
        const response = await fetch("/api/policies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (response.ok) {
          showToast({ type: "success", message: "Póliza creada exitosamente" });
          goto("/polizas");
        } else {
          if (result.errors) {
            errors = result.errors;
          }
          showToast({
            type: "error",
            message: result.message || "Error al crear póliza"
          });
        }
      } catch (err) {
        showToast({ type: "error", message: "Error al crear póliza" });
      } finally {
        loading = false;
      }
    }
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
      onSubmit: handleSubmit,
      onCancel: () => goto()
    });
    $$renderer2.push(`<!----></div>`);
  });
}
export {
  _page as default
};

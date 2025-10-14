<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import ClientForm from "$lib/components/form/ClientForm.svelte";
  import { showToast } from "$lib/stores/notifications";
  import { ArrowLeft } from "lucide-svelte";

  let loading = $state(false);
  let errors = $state({});

  async function handleSubmit(formData: any) {
    loading = true;
    errors = {};

    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({ type: "success", message: "Cliente creado exitosamente" });
        goto("/clientes");
      } else {
        if (result.errors) {
          errors = result.errors;
        }
        showToast({
          type: "error",
          message: result.message || "Error al crear cliente",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al crear cliente" });
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Nuevo Cliente - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <Button variant="ghost" size="sm" onclick={() => goto("/clientes")}>
        <ArrowLeft size={18} />
        Volver
      </Button>
      <h1>Nuevo Cliente</h1>
      <p>Completa los datos para registrar un nuevo cliente</p>
    </div>
  </div>

  <ClientForm
    mode="create"
    {loading}
    {errors}
    onSubmit={handleSubmit}
    onCancel={() => goto("/clientes")}
  />
</div>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  .page {
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: var(--space-6);

    h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin: var(--space-4) 0 var(--space-2);
    }

    p {
      color: var(--text-secondary);
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: var(--text-2xl);
    }
  }
</style>

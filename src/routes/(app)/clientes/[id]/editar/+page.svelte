<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import ClientForm from "$lib/components/form/ClientForm.svelte";
  import { showToast } from "$lib/stores/notifications";
  import { ArrowLeft } from "lucide-svelte";
  import type { Client } from "$lib/types/database.types";

  let clientId = $derived($page.params.id);
  let loading = $state(false);
  let loadingClient = $state(true);
  let errors = $state({});
  let client = $state<Client | null>(null);

  onMount(async () => {
    await loadClient();
  });

  async function loadClient() {
    loadingClient = true;
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      const result = await response.json();

      if (response.ok) {
        client = result.client;
      } else {
        showToast({
          type: "error",
          message: result.message || "Error al cargar cliente",
        });
        goto("/clientes");
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al cargar cliente" });
      goto("/clientes");
    } finally {
      loadingClient = false;
    }
  }

  async function handleSubmit(formData: any) {
    loading = true;
    errors = {};

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({
          type: "success",
          message: "Cliente actualizado exitosamente",
        });
        goto("/clientes");
      } else {
        if (result.errors) {
          errors = result.errors;
        }
        showToast({
          type: "error",
          message: result.message || "Error al actualizar cliente",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al actualizar cliente" });
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Editar Cliente - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <Button variant="ghost" size="sm" onclick={() => goto("/clientes")}>
        <ArrowLeft size={18} />
        Volver
      </Button>
      <h1>Editar Cliente</h1>
      <p>Modifica los datos del cliente</p>
    </div>
  </div>

  {#if loadingClient}
    <div class="loading-state">
      <p>Cargando datos del cliente...</p>
    </div>
  {:else if client}
    <ClientForm
      mode="edit"
      initialData={client as any}
      {loading}
      {errors}
      onSubmit={handleSubmit}
      onCancel={() => goto("/clientes")}
    />
  {/if}
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

  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-8);

    p {
      color: var(--text-secondary);
      font-size: var(--text-base);
    }
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: var(--text-2xl);
    }
  }
</style>

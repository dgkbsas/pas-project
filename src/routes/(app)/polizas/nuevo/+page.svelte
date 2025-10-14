<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import PolicyForm from "$lib/components/form/PolicyForm.svelte";
  import { showToast } from "$lib/stores/notifications";
  import { ArrowLeft } from "lucide-svelte";

  let loading = $state(false);
  let errors = $state({});
  let initialData = $state<any>({});

  // Check for client_id in URL query params
  onMount(() => {
    const clientId = $page.url.searchParams.get('client_id');
    if (clientId) {
      initialData.client_id = clientId;
    }
  });

  async function handleSubmit(formData: any) {
    loading = true;
    errors = {};

    try {
      const response = await fetch("/api/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          message: result.message || "Error al crear póliza",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al crear póliza" });
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Nueva Póliza - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <Button variant="ghost" size="sm" onclick={() => goto("/polizas")}>
        <ArrowLeft size={18} />
        Volver
      </Button>
      <h1>Nueva Póliza</h1>
      <p>Completa los datos para registrar una nueva póliza</p>
    </div>
  </div>

  <PolicyForm
    mode="create"
    initialData={initialData}
    {loading}
    {errors}
    onSubmit={handleSubmit}
    onCancel={() => goto("/polizas")}
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

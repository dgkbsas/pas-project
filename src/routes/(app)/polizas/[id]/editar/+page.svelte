<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import PolicyForm from "$lib/components/form/PolicyForm.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import { showToast } from "$lib/stores/notifications";
  import { ArrowLeft, Plus, Edit, Trash, Calendar } from "lucide-svelte";
  import type { PolicyFollowup } from "$lib/types/database.types";

  type PageData = {
    policy: any;
  };

  let { data } = $props<{ data: PageData }>();

  let loading = $state(false);
  let loadingFollowups = $state(false);
  let followups = $state<PolicyFollowup[]>([]);
  let followupTypes = $state<string[]>([]);
  let editingFollowupId = $state<string | null>(null);
  let errors = $state({});

  let initialData = $state({
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
    observations: data.policy.observations || "",
  });

  let followupForm = $state({
    followup_type: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    status: "",
  });

  onMount(async () => {
    await Promise.all([
      loadFollowups(),
      loadFollowupTypes()
    ]);
  });

  async function loadFollowups() {
    loadingFollowups = true;
    try {
      const response = await fetch(`/api/policies/${data.policy.id}/followups`);
      const result = await response.json();
      if (response.ok) {
        followups = result.followups || [];
      }
    } catch (err) {
      console.error('Error loading followups:', err);
    } finally {
      loadingFollowups = false;
    }
  }

  async function loadFollowupTypes() {
    try {
      const response = await fetch('/api/config');
      const result = await response.json();
      if (response.ok) {
        const config = result.configs.find((c: any) => c.config_key === 'followup_types');
        if (config?.config_value) {
          followupTypes = Array.isArray(config.config_value) ? config.config_value : [];
        }
      }
    } catch (err) {
      console.error('Error loading followup types:', err);
      followupTypes = ["Seguimiento", "Reclamo", "Siniestro", "Renovación", "Otro"];
    }
  }

  async function handleSubmit(formData: any) {
    loading = true;
    errors = {};

    try {
      const response = await fetch(`/api/policies/${data.policy.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
          message: result.message || "Error al actualizar póliza",
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
      showToast({ type: 'error', message: 'Tipo y fecha son requeridos' });
      return;
    }

    try {
      const response = await fetch(`/api/policies/${data.policy.id}/followups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(followupForm),
      });

      if (response.ok) {
        showToast({ type: 'success', message: 'Seguimiento creado' });
        resetFollowupForm();
        await loadFollowups();
      } else {
        const result = await response.json();
        showToast({ type: 'error', message: result.message || 'Error al crear seguimiento' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al crear seguimiento' });
    }
  }

  async function handleUpdateFollowup(id: string) {
    try {
      const response = await fetch(`/api/followups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(followupForm),
      });

      if (response.ok) {
        showToast({ type: 'success', message: 'Seguimiento actualizado' });
        editingFollowupId = null;
        resetFollowupForm();
        await loadFollowups();
      } else {
        const result = await response.json();
        showToast({ type: 'error', message: result.message || 'Error al actualizar seguimiento' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al actualizar seguimiento' });
    }
  }

  async function handleDeleteFollowup(id: string) {
    if (!confirm('¿Seguro que deseas eliminar este seguimiento?')) return;

    try {
      const response = await fetch(`/api/followups/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({ type: 'success', message: 'Seguimiento eliminado' });
        await loadFollowups();
      } else {
        const result = await response.json();
        showToast({ type: 'error', message: result.message || 'Error al eliminar seguimiento' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al eliminar seguimiento' });
    }
  }

  function editFollowup(followup: PolicyFollowup) {
    editingFollowupId = followup.id;
    followupForm = {
      followup_type: followup.followup_type,
      date: followup.date,
      description: followup.description || "",
      status: followup.status || "",
    };
  }

  function resetFollowupForm() {
    editingFollowupId = null;
    followupForm = {
      followup_type: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      status: "",
    };
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
</script>

<svelte:head>
  <title>Editar Póliza - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <Button variant="ghost" size="sm" onclick={() => goto("/polizas")}>
        <ArrowLeft size={18} />
        Volver
      </Button>
      <h1>Editar Póliza</h1>
      <p>Modifica los datos de la póliza y gestiona seguimientos</p>
    </div>
  </div>

  <PolicyForm
    mode="edit"
    initialData={initialData}
    {loading}
    {errors}
    onSubmit={handleSubmit}
    onCancel={() => goto("/polizas")}
  />

  <!-- Seguimientos Section -->
  <Card>
    <div class="card-header">
      <h2>Seguimientos</h2>
      <p class="subtitle">Historial de seguimientos y novedades de la póliza</p>
    </div>

    <div class="followup-form">
      <h3>{editingFollowupId ? 'Editar Seguimiento' : 'Nuevo Seguimiento'}</h3>
      <div class="form-grid">
        <div class="form-group">
          <label for="followup_type">Tipo <span class="required">*</span></label>
          {#if followupTypes.length > 0}
            <Select
              id="followup_type"
              options={followupTypes.map(t => ({ value: t, label: t }))}
              bind:value={followupForm.followup_type}
              placeholder="Selecciona tipo"
              required
            />
          {:else}
            <Input bind:value={followupForm.followup_type} placeholder="Tipo de seguimiento" required />
          {/if}
        </div>

        <div class="form-group">
          <label for="followup_date">Fecha <span class="required">*</span></label>
          <Input
            id="followup_date"
            type="date"
            bind:value={followupForm.date}
            required
          />
        </div>

        <div class="form-group">
          <label for="followup_status">Estado</label>
          <Input
            id="followup_status"
            bind:value={followupForm.status}
            placeholder="Estado (opcional)"
          />
        </div>

        <div class="form-group full-width">
          <label for="followup_description">Descripción</label>
          <textarea
            id="followup_description"
            bind:value={followupForm.description}
            placeholder="Describe el seguimiento..."
            rows="2"
          ></textarea>
        </div>
      </div>

      <div class="form-actions">
        {#if editingFollowupId}
          <Button variant="ghost" onclick={resetFollowupForm} type="button">
            Cancelar
          </Button>
          <Button variant="primary" onclick={() => handleUpdateFollowup(editingFollowupId)} type="button">
            Actualizar Seguimiento
          </Button>
        {:else}
          <Button variant="primary" onclick={handleCreateFollowup} type="button">
            <Plus size={18} />
            Agregar Seguimiento
          </Button>
        {/if}
      </div>
    </div>

    {#if loadingFollowups}
      <div class="loading-text">Cargando seguimientos...</div>
    {:else if followups.length === 0}
      <div class="empty-state">
        <Calendar size={48} />
        <p>No hay seguimientos registrados</p>
        <small>Agrega el primer seguimiento arriba</small>
      </div>
    {:else}
      <div class="followups-list">
        {#each followups as followup}
          <div class="followup-item">
            <div class="followup-header">
              <div class="followup-type-badge">{followup.followup_type}</div>
              <div class="followup-date">{formatDate(followup.date)}</div>
              <div class="followup-actions">
                <button
                  class="action-btn"
                  onclick={() => editFollowup(followup)}
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  class="action-btn danger"
                  onclick={() => handleDeleteFollowup(followup.id)}
                  title="Eliminar"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            {#if followup.status}
              <div class="followup-status">Estado: {followup.status}</div>
            {/if}
            {#if followup.description}
              <div class="followup-description">{followup.description}</div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </Card>
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

  form {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
    margin-bottom: var(--space-6);
  }

  .card-header {
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-primary);

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .subtitle {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: var(--space-1) 0 0;
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    &.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);

      .required {
        color: var(--error-600);
      }
    }

    textarea {
      padding: var(--space-3);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-family: inherit;
      background: var(--bg-primary);
      color: var(--text-primary);
      resize: vertical;
      transition: all var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
      }

      &::placeholder {
        color: var(--text-tertiary);
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding-top: var(--space-4);
  }

  .help-text {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    margin-top: var(--space-1);
    display: block;
  }

  .followup-form {
    padding: var(--space-6);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-6);

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
    }
  }

  .followups-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .followup-item {
    padding: var(--space-4);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    transition: all var(--transition-fast);

    &:hover {
      border-color: var(--primary-200);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
  }

  .followup-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-2);
  }

  .followup-type-badge {
    padding: var(--space-1) var(--space-3);
    background: var(--primary-100);
    color: var(--primary-700);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    border-radius: var(--radius-sm);
  }

  .followup-date {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .followup-actions {
    margin-left: auto;
    display: flex;
    gap: var(--space-2);
  }

  .followup-status {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-2);
    font-style: italic;
  }

  .followup-description {
    font-size: var(--text-sm);
    color: var(--text-primary);
    line-height: 1.5;
  }

  .action-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
      color: var(--primary-600);
    }

    &.danger:hover {
      background: var(--error-50);
      color: var(--error-600);
    }
  }

  .empty-state {
    padding: var(--space-8) var(--space-4);
    text-align: center;
    color: var(--text-tertiary);

    :global(svg) {
      margin: 0 auto var(--space-4);
      color: var(--text-tertiary);
      opacity: 0.5;
    }

    p {
      margin: 0 0 var(--space-2);
      font-size: var(--text-base);
      color: var(--text-secondary);
    }

    small {
      font-size: var(--text-sm);
    }
  }

  .loading-text {
    padding: var(--space-4);
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: var(--text-2xl);
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column-reverse;

      :global(button) {
        width: 100%;
      }
    }

    .followup-header {
      flex-wrap: wrap;
    }

    .followup-actions {
      flex-basis: 100%;
      justify-content: flex-end;
    }
  }
</style>

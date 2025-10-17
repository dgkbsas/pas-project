<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Textarea from "$lib/components/ui/Textarea.svelte";
  import Dialog from "$lib/components/ui/Dialog.svelte";
  import { X, Save, Bell } from "lucide-svelte";
  import type { PolicyFollowup } from "$lib/types/database.types";

  interface Props {
    open: boolean;
    followup?: PolicyFollowup | null;
    followupTypes: string[];
    policyId: string;
  }

  let { open = $bindable(false), followup = null, followupTypes, policyId }: Props = $props();

  const dispatch = createEventDispatcher();

  let formData = $state({
    followup_type: followup?.followup_type || "",
    date: followup?.date || new Date().toISOString().split("T")[0],
    description: followup?.description || "",
    status: followup?.status || "",
    alert_date: followup?.alert_date || "",
  });

  let isLoading = $state(false);
  let error = $state<string | null>(null);

  async function handleSubmit() {
    error = null;
    isLoading = true;

    try {
      const method = followup ? "PUT" : "POST";
      const url = followup
        ? `/api/followups/${followup.id}`
        : `/api/policies/${policyId}/followups`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al guardar seguimiento");
      }

      dispatch("success", data.followup);
      open = false;
    } catch (err: any) {
      error = err.message || "Error al guardar seguimiento";
    } finally {
      isLoading = false;
    }
  }

  function handleClose() {
    open = false;
  }
</script>

<Dialog bind:open title={followup ? "Editar Seguimiento" : "Nuevo Seguimiento"}>
  <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div class="form-content">
      {#if error}
        <div class="error-message">{error}</div>
      {/if}

      <div class="form-row">
        <Select
          label="Tipo de Seguimiento"
          bind:value={formData.followup_type}
          required
        >
          <option value="">Seleccionar tipo</option>
          {#each followupTypes as type}
            <option value={type}>{type}</option>
          {/each}
        </Select>
      </div>

      <div class="form-row">
        <Input
          type="date"
          label="Fecha del Seguimiento"
          bind:value={formData.date}
          required
        />
      </div>

      <div class="form-row">
        <Input
          label="Estado"
          bind:value={formData.status}
          placeholder="Ej: Pendiente, Completado, En proceso..."
        />
      </div>

      <div class="form-row">
        <Textarea
          label="Descripción"
          bind:value={formData.description}
          placeholder="Detalles del seguimiento..."
          rows={4}
        />
      </div>

      <div class="alert-section">
        <div class="alert-header">
          <Bell size={18} />
          <h3>Alerta (Opcional)</h3>
        </div>
        <div class="form-field">
          <Input
            type="date"
            label="Fecha de Alerta"
            bind:value={formData.alert_date}
            placeholder="Selecciona una fecha para recibir alerta"
          />
          <span class="help-text">Si seleccionas una fecha, recibirás una notificación</span>
        </div>
      </div>
    </div>

    <div class="modal-actions">
      <Button type="button" variant="ghost" onclick={handleClose} disabled={isLoading}>
        <X size={18} />
        Cancelar
      </Button>
      <Button type="submit" variant="primary" disabled={isLoading}>
        <Save size={18} />
        {isLoading ? "Guardando..." : followup ? "Actualizar" : "Crear"}
      </Button>
    </div>
  </form>
</Dialog>

<style lang="scss">
  .form-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-4) 0;
  }

  .form-row {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .help-text {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .alert-section {
    margin-top: var(--space-4);
    padding: var(--space-4);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-primary);

    .alert-header {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin-bottom: var(--space-3);

      :global(svg) {
        color: var(--primary-600);
      }

      h3 {
        margin: 0;
        font-size: var(--text-sm);
        font-weight: var(--font-semibold);
        color: var(--text-primary);
      }
    }
  }

  .error-message {
    padding: var(--space-3);
    background: var(--error-50);
    border: 1px solid var(--error-200);
    border-radius: var(--radius-md);
    color: var(--error-700);
    font-size: var(--text-sm);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding-top: var(--space-4);
    border-top: 1px solid var(--border-primary);
    margin-top: var(--space-4);
  }
</style>

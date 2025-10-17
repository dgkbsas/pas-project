<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import { Calendar, FileText, Plus, Edit, Trash2, Bell } from "lucide-svelte";
  import type { PolicyFollowup } from "$lib/types/database.types";

  interface Props {
    followups: PolicyFollowup[];
    loading?: boolean;
  }

  let { followups, loading = false }: Props = $props();

  const dispatch = createEventDispatcher();

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function handleEdit(followup: PolicyFollowup) {
    dispatch("edit", followup);
  }

  async function handleDelete(followup: PolicyFollowup) {
    if (!confirm("¿Estás seguro de eliminar este seguimiento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/followups/${followup.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al eliminar seguimiento");
      }

      dispatch("delete", followup.id);
    } catch (err: any) {
      alert(err.message || "Error al eliminar seguimiento");
    }
  }

  function handleCreate() {
    dispatch("create");
  }

  function getStatusBadgeVariant(status: string | null): 'success' | 'warning' | 'error' | 'info' | 'default' {
    if (!status) return 'default';

    const statusLower = status.toLowerCase();
    if (statusLower.includes('completado') || statusLower.includes('resuelto')) return 'success';
    if (statusLower.includes('pendiente')) return 'warning';
    if (statusLower.includes('cancelado')) return 'error';
    return 'info';
  }

  function hasActiveAlert(followup: PolicyFollowup): boolean {
    if (!followup.alert_date) return false;
    const alertDate = new Date(followup.alert_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return alertDate >= today;
  }
</script>

<div class="followups-container">
  <div class="followups-header">
    <h2>Seguimientos</h2>
    <Button variant="primary" size="sm" onclick={handleCreate}>
      <Plus size={16} />
      Nuevo Seguimiento
    </Button>
  </div>

  {#if loading}
    <div class="loading">Cargando seguimientos...</div>
  {:else if followups.length === 0}
    <EmptyState
      icon={FileText}
      title="Sin seguimientos"
      description="No hay seguimientos registrados para esta póliza"
      action={{
        label: "Crear Seguimiento",
        onclick: handleCreate,
      }}
    />
  {:else}
    <div class="followups-list">
      {#each followups as followup}
        <div class="followup-card">
          <div class="followup-header">
            <div class="followup-type">
              <FileText size={18} />
              <span>{followup.followup_type}</span>
            </div>
            <div class="followup-actions">
              <Button variant="ghost" size="sm" onclick={() => handleEdit(followup)}>
                <Edit size={16} />
              </Button>
              <Button variant="ghost" size="sm" onclick={() => handleDelete(followup)}>
                <Trash2 size={16} />
              </Button>
            </div>
          </div>

          <div class="followup-content">
            <div class="followup-date">
              <Calendar size={14} />
              <span>{formatDate(followup.date)}</span>
            </div>

            {#if followup.status}
              <div class="followup-status">
                <Badge variant={getStatusBadgeVariant(followup.status)}>
                  {followup.status}
                </Badge>
              </div>
            {/if}

            {#if followup.description}
              <p class="followup-description">{followup.description}</p>
            {/if}

            {#if hasActiveAlert(followup)}
              <div class="followup-alert">
                <Bell size={14} />
                <span>Alerta: {formatDate(followup.alert_date!)}</span>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .followups-container {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .followups-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }
  }

  .loading {
    text-align: center;
    padding: var(--space-8);
    color: var(--text-tertiary);
  }

  .followups-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .followup-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    transition: all var(--transition-fast);

    &:hover {
      border-color: var(--primary-300);
      box-shadow: var(--shadow-sm);
    }
  }

  .followup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
  }

  .followup-type {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--font-semibold);
    color: var(--text-primary);

    :global(svg) {
      color: var(--primary-600);
    }
  }

  .followup-actions {
    display: flex;
    gap: var(--space-1);
  }

  .followup-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .followup-date {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--text-secondary);

    :global(svg) {
      color: var(--text-tertiary);
    }
  }

  .followup-status {
    display: inline-block;
    width: fit-content;
  }

  .followup-description {
    margin: var(--space-2) 0 0 0;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    line-height: 1.5;
    white-space: pre-wrap;
  }

  .followup-alert {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--warning-50);
    border: 1px solid var(--warning-200);
    border-radius: var(--radius-sm);
    font-size: var(--text-sm);
    color: var(--warning-700);
    margin-top: var(--space-2);

    :global(svg) {
      color: var(--warning-600);
    }
  }

  @media (max-width: 768px) {
    .followups-header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
    }
  }
</style>

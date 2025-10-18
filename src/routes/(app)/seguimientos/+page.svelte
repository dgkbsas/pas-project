<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Table from "$lib/components/ui/Table.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import { showToast } from "$lib/stores/notifications";
  import {
    Calendar,
    FileText,
    Filter,
    X,
    ChevronDown,
    Search,
    Edit,
    Trash2,
    Bell,
  } from "lucide-svelte";
  import FollowupForm from "$lib/components/FollowupForm.svelte";

  type PageData = {
    clients: Array<{ id: string; first_name: string; last_name: string }>;
    followupTypes: string[];
    statuses: string[];
  };

  let { data } = $props<{ data: PageData }>();

  let followups = $state<any[]>([]);
  let loading = $state(false);
  let showFilters = $state(false);
  let showFollowupModal = $state(false);
  let editingFollowup = $state<any>(null);

  // Filters
  let filters = $state({
    search: "",
    client_id: "",
    followup_type: "",
    status: "",
    date_from: "",
    date_to: "",
    sortBy: "date",
    sortOrder: "desc" as "asc" | "desc",
  });

  // Pagination
  let pagination = $state({
    page: 1,
    limit: 30,
    total: 0,
    total_pages: 0,
  });

  onMount(() => {
    loadFollowups();
  });

  async function loadFollowups() {
    loading = true;
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      if (filters.search) params.append("search", filters.search);
      if (filters.client_id) params.append("client_id", filters.client_id);
      if (filters.followup_type)
        params.append("followup_type", filters.followup_type);
      if (filters.status) params.append("status", filters.status);
      if (filters.date_from) params.append("date_from", filters.date_from);
      if (filters.date_to) params.append("date_to", filters.date_to);

      const response = await fetch(`/api/followups?${params}`);
      const result = await response.json();

      if (response.ok) {
        followups = result.followups || [];
        pagination = result.pagination;
      } else {
        showToast({ type: "error", message: result.message });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al cargar seguimientos" });
    } finally {
      loading = false;
    }
  }

  function applyFilters() {
    pagination.page = 1;
    loadFollowups();
  }

  function clearFilters() {
    filters = {
      search: "",
      client_id: "",
      followup_type: "",
      status: "",
      date_from: "",
      date_to: "",
      sortBy: "date",
      sortOrder: "desc",
    };
    applyFilters();
  }

  function handleSort(field: string) {
    if (filters.sortBy === field) {
      filters.sortOrder = filters.sortOrder === "asc" ? "desc" : "asc";
    } else {
      filters.sortBy = field;
      filters.sortOrder = "asc";
    }
    loadFollowups();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusBadgeVariant(status: string | null): "success" | "warning" | "error" | "info" | "default" {
    if (!status) return "default";

    const statusLower = status.toLowerCase();
    if (statusLower.includes("completado") || statusLower.includes("resuelto"))
      return "success";
    if (statusLower.includes("pendiente")) return "warning";
    if (statusLower.includes("cancelado")) return "error";
    return "info";
  }

  function hasActiveAlert(followup: any): boolean {
    if (!followup.alert_date) return false;
    const alertDate = new Date(followup.alert_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return alertDate >= today;
  }

  function openFollowupModal(followup: any | null = null) {
    editingFollowup = followup;
    showFollowupModal = true;
  }

  function closeFollowupModal() {
    showFollowupModal = false;
    editingFollowup = null;
  }

  async function handleFollowupSaved() {
    closeFollowupModal();
    await loadFollowups();
  }

  async function deleteFollowup(id: string) {
    if (!confirm("¿Estás seguro de eliminar este seguimiento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/followups/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        showToast({ type: "success", message: "Seguimiento eliminado" });
        await loadFollowups();
      } else {
        showToast({ type: "error", message: result.message });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al eliminar seguimiento" });
    }
  }

  function getClientName(followup: any): string {
    if (followup.policy?.client) {
      const client = followup.policy.client;
      return `${client.first_name} ${client.last_name}`;
    }
    return "-";
  }

  function getPolicyNumber(followup: any): string {
    return followup.policy?.policy_number || "-";
  }

  // Pagination
  function goToPage(page: number) {
    pagination.page = page;
    loadFollowups();
  }

  function nextPage() {
    if (pagination.page < pagination.total_pages) {
      goToPage(pagination.page + 1);
    }
  }

  function previousPage() {
    if (pagination.page > 1) {
      goToPage(pagination.page - 1);
    }
  }

  // Check if filters are active
  let hasActiveFilters = $derived(
    filters.search ||
      filters.client_id ||
      filters.followup_type ||
      filters.status ||
      filters.date_from ||
      filters.date_to
  );
</script>

<svelte:head>
  <title>Seguimientos - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <h1>Seguimientos</h1>
      <p>Gestiona los seguimientos de pólizas</p>
    </div>
    <div class="header-actions">
      <Button
        variant={showFilters ? "primary" : "outline"}
        onclick={() => (showFilters = !showFilters)}
      >
        <Filter size={18} />
        Filtros
        {#if hasActiveFilters}
          <Badge variant="default">●</Badge>
        {/if}
      </Button>
    </div>
  </div>

  <!-- Filters Panel -->
  {#if showFilters}
    <Card>
      <div class="filters-panel">
        <div class="filters-header">
          <h3>Filtros</h3>
          <button class="close-btn" onclick={() => (showFilters = false)}>
            <X size={20} />
          </button>
        </div>

        <div class="filters-grid">
          <div class="filter-group">
            <label for="search">Buscar</label>
            <Input
              id="search"
              bind:value={filters.search}
              placeholder="Buscar en tipo, descripción o estado..."
              onkeydown={(e) => e.key === "Enter" && applyFilters()}
            />
          </div>

          <div class="filter-group">
            <label for="client">Cliente</label>
            <select id="client" bind:value={filters.client_id}>
              <option value="">Todos los clientes</option>
              {#each data.clients as client}
                <option value={client.id}>
                  {client.first_name} {client.last_name}
                </option>
              {/each}
            </select>
          </div>

          <div class="filter-group">
            <label for="followup_type">Tipo de Seguimiento</label>
            <select id="followup_type" bind:value={filters.followup_type}>
              <option value="">Todos los tipos</option>
              {#each data.followupTypes as type}
                <option value={type}>{type}</option>
              {/each}
            </select>
          </div>

          <div class="filter-group">
            <label for="status">Estado</label>
            <select id="status" bind:value={filters.status}>
              <option value="">Todos los estados</option>
              {#each data.statuses as status}
                <option value={status}>{status}</option>
              {/each}
            </select>
          </div>

          <div class="filter-group">
            <label for="date_from">Fecha desde</label>
            <Input
              id="date_from"
              type="date"
              bind:value={filters.date_from}
            />
          </div>

          <div class="filter-group">
            <label for="date_to">Fecha hasta</label>
            <Input id="date_to" type="date" bind:value={filters.date_to} />
          </div>
        </div>

        <div class="filters-actions">
          <Button variant="ghost" onclick={clearFilters}>Limpiar</Button>
          <Button variant="primary" onclick={applyFilters}>
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </Card>
  {/if}

  <!-- Results -->
  {#if loading}
    <Card>
      <div class="loading-state">Cargando seguimientos...</div>
    </Card>
  {:else if followups.length === 0}
    <EmptyState
      icon={FileText}
      title="No hay seguimientos"
      description={hasActiveFilters
        ? "No se encontraron seguimientos con los filtros aplicados"
        : "Aún no hay seguimientos registrados"}
      action={
        hasActiveFilters
          ? { label: "Limpiar filtros", onclick: clearFilters }
          : undefined
      }
    />
  {:else}
    <Card>
      <!-- Desktop Table View -->
      <div class="desktop-view">
        <Table>
          <thead>
            <tr>
              <th>
                <button
                  class="sort-btn"
                  onclick={() => handleSort("date")}
                >
                  Fecha
                  {#if filters.sortBy === "date"}
                    <ChevronDown
                      size={14}
                      class={filters.sortOrder === "asc" ? "rotate-180" : ""}
                    />
                  {/if}
                </button>
              </th>
              <th>
                <button
                  class="sort-btn"
                  onclick={() => handleSort("followup_type")}
                >
                  Tipo
                  {#if filters.sortBy === "followup_type"}
                    <ChevronDown
                      size={14}
                      class={filters.sortOrder === "asc" ? "rotate-180" : ""}
                    />
                  {/if}
                </button>
              </th>
              <th>Cliente</th>
              <th>Póliza</th>
              <th>Estado</th>
              <th>Descripción</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {#each followups as followup}
              <tr>
                <td>
                  <div class="date-cell">
                    <Calendar size={14} />
                    {formatDate(followup.date)}
                  </div>
                </td>
                <td>
                  <div class="type-cell">
                    <FileText size={14} />
                    {followup.followup_type}
                  </div>
                </td>
                <td>{getClientName(followup)}</td>
                <td>
                  <code class="policy-number">{getPolicyNumber(followup)}</code>
                </td>
                <td>
                  {#if followup.status}
                    <Badge variant={getStatusBadgeVariant(followup.status)}>
                      {followup.status}
                    </Badge>
                  {:else}
                    <span class="text-muted">-</span>
                  {/if}
                </td>
                <td>
                  <div class="description-cell">
                    {#if followup.description}
                      <span class="description-text">
                        {followup.description}
                      </span>
                    {:else}
                      <span class="text-muted">Sin descripción</span>
                    {/if}
                    {#if hasActiveAlert(followup)}
                      <div class="alert-indicator">
                        <Bell size={12} />
                        <span>{formatDate(followup.alert_date)}</span>
                      </div>
                    {/if}
                  </div>
                </td>
                <td class="text-right">
                  <div class="table-actions">
                    <button
                      class="action-btn"
                      onclick={() => openFollowupModal(followup)}
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      class="action-btn danger"
                      onclick={() => deleteFollowup(followup.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </div>

      <!-- Mobile Card View -->
      <div class="mobile-view">
        <div class="followups-cards">
          {#each followups as followup}
            <div class="followup-card" onclick={() => openFollowupModal(followup)}>
              <div class="card-header">
                <div class="followup-type">
                  <FileText size={18} />
                  <span>{followup.followup_type}</span>
                </div>
                <div class="card-actions">
                  <button
                    class="action-btn"
                    onclick={(e) => {
                      e.stopPropagation();
                      openFollowupModal(followup);
                    }}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    class="action-btn danger"
                    onclick={(e) => {
                      e.stopPropagation();
                      deleteFollowup(followup.id);
                    }}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div class="card-body">
                <div class="card-row">
                  <span class="label">
                    <Calendar size={14} />
                    Fecha:
                  </span>
                  <span class="value">{formatDate(followup.date)}</span>
                </div>

                {#if followup.status}
                  <div class="card-row">
                    <span class="label">Estado:</span>
                    <Badge variant={getStatusBadgeVariant(followup.status)}>
                      {followup.status}
                    </Badge>
                  </div>
                {/if}

                <div class="card-row">
                  <span class="label">Cliente:</span>
                  <span class="value">{getClientName(followup)}</span>
                </div>

                <div class="card-row">
                  <span class="label">Póliza:</span>
                  <code class="policy-number">{getPolicyNumber(followup)}</code>
                </div>

                {#if followup.description}
                  <div class="card-description">
                    {followup.description}
                  </div>
                {/if}

                {#if hasActiveAlert(followup)}
                  <div class="alert-indicator">
                    <Bell size={14} />
                    <span>Alerta: {formatDate(followup.alert_date)}</span>
                  </div>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Pagination -->
      {#if pagination.total_pages > 1}
        <div class="pagination">
          <Button
            variant="ghost"
            size="sm"
            onclick={previousPage}
            disabled={pagination.page === 1}
          >
            Anterior
          </Button>
          <span class="pagination-info">
            Página {pagination.page} de {pagination.total_pages} ({pagination.total} total)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onclick={nextPage}
            disabled={pagination.page === pagination.total_pages}
          >
            Siguiente
          </Button>
        </div>
      {/if}
    </Card>
  {/if}
</div>

<!-- Followup Form Modal -->
<FollowupForm
  bind:open={showFollowupModal}
  followup={editingFollowup}
  followupTypes={data.followupTypes}
  policyId={editingFollowup?.policy_id || ""}
  on:success={handleFollowupSaved}
/>

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-4);

    h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    p {
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .header-actions {
    display: flex;
    gap: var(--space-3);
  }

  .filters-panel {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .close-btn {
      padding: var(--space-2);
      border: none;
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }
    }
  }

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4);

    @media (max-width: 968px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);
    }

    select {
      padding: var(--space-3);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: var(--text-sm);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--border-hover);
      }

      &:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px var(--primary-100);
      }
    }
  }

  .filters-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding-top: var(--space-4);
    border-top: 1px solid var(--border-primary);
  }

  .loading-state {
    text-align: center;
    padding: var(--space-8);
    color: var(--text-tertiary);
  }

  .desktop-view {
    display: block;
  }

  .mobile-view {
    display: none;
  }

  @media (max-width: 968px) {
    .desktop-view {
      display: none;
    }

    .mobile-view {
      display: block;
    }

    .page-header {
      flex-direction: column;
    }
  }

  .sort-btn {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    border: none;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
    padding: 0;

    &:hover {
      color: var(--primary-600);
    }
  }

  .date-cell,
  .type-cell {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);

    :global(svg) {
      color: var(--text-tertiary);
    }
  }

  .policy-number {
    font-size: var(--text-xs);
    font-family: "Monaco", "Courier New", monospace;
    background: var(--bg-secondary);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
  }

  .description-cell {
    max-width: 300px;

    .description-text {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: 1.4;
    }
  }

  .alert-indicator {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    background: var(--warning-50);
    border: 1px solid var(--warning-200);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    color: var(--warning-700);
    margin-top: var(--space-1);

    :global(svg) {
      color: var(--warning-600);
      flex-shrink: 0;
    }
  }

  .table-actions {
    display: flex;
    gap: var(--space-2);
    justify-content: flex-end;
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

  .text-muted {
    color: var(--text-tertiary);
  }

  /* Mobile Card Styles */
  .followups-cards {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .followup-card {
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      border-color: var(--primary-300);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-3);
      padding-bottom: var(--space-3);
      border-bottom: 1px solid var(--border-primary);
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

    .card-actions {
      display: flex;
      gap: var(--space-2);
    }

    .card-body {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .card-row {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-size: var(--text-sm);

      .label {
        color: var(--text-tertiary);
        font-weight: var(--font-medium);
        display: flex;
        align-items: center;
        gap: var(--space-1);

        :global(svg) {
          color: inherit;
        }
      }

      .value {
        color: var(--text-secondary);
      }
    }

    .card-description {
      margin-top: var(--space-2);
      padding: var(--space-3);
      background: var(--bg-secondary);
      border-radius: var(--radius-sm);
      font-size: var(--text-sm);
      color: var(--text-secondary);
      line-height: 1.5;
      white-space: pre-wrap;
    }
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--space-4);
    margin-top: var(--space-4);
    border-top: 1px solid var(--border-primary);

    .pagination-info {
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }

    @media (max-width: 640px) {
      flex-direction: column;
      gap: var(--space-3);

      .pagination-info {
        order: -1;
      }
    }
  }

  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-4);
  }

  .modal-content {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }
</style>

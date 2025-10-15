<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import Table from "$lib/components/ui/Table.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import Skeleton from "$lib/components/ui/Skeleton.svelte";
  import InfiniteScroll from "$lib/components/ui/InfiniteScroll.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import PolicyCard from "$lib/components/PolicyCard.svelte";
  import PolicyFilters from "$lib/components/PolicyFilters.svelte";
  import PolicyModal from "$lib/components/PolicyModal.svelte";
  import type { FilterValues } from "$lib/components/PolicyFilters.svelte";
  import type { PolicyType, PaymentMode } from "$lib/types";
  import { showToast } from "$lib/stores/notifications";
  import {
    FileText,
    Plus,
    Search,
    Eye,
    Trash,
    Calendar,
    User,
    ArrowUpDown,
    Filter,
    X,
    ArrowUp,
    ArrowDown,
  } from "lucide-svelte";
  import { debounce } from "$lib/utils";
  import type { Policy, Client } from "$lib/types/database.types";

  type PolicyWithClient = Policy & {
    client?: Client;
  };

  let { data } = $props();

  let policies = $state<PolicyWithClient[]>([]);
  let loading = $state(true);
  let loadingMore = $state(false);
  let search = $state("");
  let sortBy = $state("created_at");
  let sortOrder = $state<"asc" | "desc">("desc");
  let showInactive = $state(false);
  let currentPage = $state(1);
  let limit = $state(30);
  let total = $state(0);
  let hasMore = $state(true);
  let filtersOpen = $state(false);
  let appliedFilters = $state<FilterValues>({
    policyTypes: [],
    paymentModes: [],
    insurers: [],
    statuses: [],
  });

  // Modal state from URL
  let policyId = $derived($page.url.searchParams.get("policyId"));
  let modalMode = $derived(
    ($page.url.searchParams.get("mode") as "view" | "edit") || "view"
  );

  const sortOptions = [
    { value: "created_at", label: "Fecha de creación" },
    { value: "expiry_date", label: "Fecha de vencimiento" },
    { value: "policy_number", label: "Número de póliza" },
    { value: "policy_type", label: "Tipo de póliza" },
    { value: "insurer", label: "Aseguradora" },
    { value: "payment_mode", label: "Forma de pago" },
  ];

  onMount(() => {
    // Cargar preferencia de localStorage
    const savedPref = localStorage.getItem("policies_show_inactive");
    if (savedPref !== null) {
      showInactive = savedPref === "true";
    }
    loadPolicies();
  });

  const debouncedSearch = debounce(() => {
    currentPage = 1;
    policies = [];
    loadPolicies();
  }, 300);

  // Reaccionar a cambios en search
  $effect(() => {
    if (search !== undefined) {
      debouncedSearch();
    }
  });

  // Note: Sort changes are handled directly in toggleSort() and select onchange
  // to avoid triggering on scroll (currentPage changes)

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
        sortOrder,
      });

      if (search) {
        params.append("search", search);
      }

      if (!showInactive) {
        params.append("active_only", "true");
      }

      // Add multiple filter values
      appliedFilters.policyTypes.forEach((type) => {
        params.append("policy_type", type);
      });

      appliedFilters.paymentModes.forEach((mode) => {
        params.append("payment_mode", mode);
      });

      appliedFilters.insurers.forEach((insurer) => {
        params.append("insurer", insurer);
      });

      // Only send statuses from appliedFilters (from the filter panel)
      appliedFilters.statuses.forEach((status) => {
        params.append("status", status);
      });

      const response = await fetch(`/api/policies?${params}`);
      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Result:", result);

      if (response.ok) {
        if (append) {
          policies = [...policies, ...(result.policies || [])];
        } else {
          policies = result.policies || [];
        }
        total = result.pagination?.total || 0;
        hasMore = policies.length < total;
      } else {
        showToast({
          type: "error",
          message: result.message || "Error al cargar pólizas",
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

  function toggleSort() {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    // Explicitly reload when sort order changes
    currentPage = 1;
    policies = [];
    loadPolicies();
  }

  async function deletePolicy(id: string, policyNumber: string) {
    if (!confirm(`¿Seguro que deseas eliminar la póliza ${policyNumber}?`))
      return;

    try {
      const response = await fetch(`/api/policies/${id}`, { method: "DELETE" });

      if (response.ok) {
        showToast({ type: "success", message: "Póliza eliminada" });
        loadPolicies();
      } else {
        const result = await response.json();
        showToast({ type: "error", message: result.message });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al eliminar" });
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getStatusBadge(
    active: boolean,
    expiryDate: string
  ): {
    variant: "error" | "success" | "info" | "warning" | "default";
    label: string;
  } {
    if (!active) {
      return { variant: "error" as const, label: "Inactiva" };
    }

    const expiry = new Date(expiryDate);
    const today = new Date();

    if (expiry < today) {
      return { variant: "warning" as const, label: "Vencida" };
    }

    return { variant: "success" as const, label: "Activa" };
  }

  function getDaysUntilExpiry(expiryDate: string) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  }

  // Count active filters
  const activeFiltersCount = $derived(() => {
    let count = 0;
    count += appliedFilters.policyTypes.length;
    count += appliedFilters.paymentModes.length;
    count += appliedFilters.insurers.length;
    count += appliedFilters.statuses.length;
    return count;
  });

  function clearFilters() {
    appliedFilters = {
      policyTypes: [],
      paymentModes: [],
      insurers: [],
      statuses: [],
    };
    currentPage = 1;
    policies = [];
    loadPolicies();
  }

  function handleApplyFilters(filters: FilterValues) {
    appliedFilters = filters;
    currentPage = 1;
    policies = [];
    loadPolicies();
  }

  function openPolicyModal(id: string, mode: "view" | "edit" = "view") {
    const url = new URL(window.location.href);
    url.searchParams.set("policyId", id);
    url.searchParams.set("mode", mode);
    goto(url.pathname + url.search, { replaceState: false, noScroll: true });
  }

  function closePolicyModal(saved?: boolean) {
    const url = new URL(window.location.href);
    url.searchParams.delete("policyId");
    url.searchParams.delete("mode");
    goto(url.pathname + url.search, { replaceState: false, noScroll: true });
    // Only refresh if changes were saved
    if (saved) {
      currentPage = 1;
      policies = [];
      loadPolicies();
    }
  }
</script>

<svelte:head>
  <title>Pólizas - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <h1>Pólizas</h1>
      <p>Gestiona todas las pólizas de seguros</p>
    </div>
    <Button variant="primary" onclick={() => goto("/polizas/nuevo")}>
      <Plus size={18} />
      Nueva Póliza
    </Button>
  </div>

  <div class="filters-toolbar">
    <div class="search-box">
      <Search size={20} />
      <input type="text" placeholder="Buscar pólizas..." bind:value={search} />
    </div>

    <div class="toolbar-actions">
      <div class="filter-checkbox">
        <label class="checkbox-label">
          <input
            type="checkbox"
            bind:checked={showInactive}
            onchange={() => {
              localStorage.setItem(
                "policies_show_inactive",
                showInactive.toString()
              );
              currentPage = 1;
              policies = [];
              loadPolicies();
            }}
          />
          <span>Mostrar inactivas</span>
        </label>
      </div>

      <button
        class="filter-btn"
        class:active={filtersOpen || activeFiltersCount() > 0}
        onclick={() => (filtersOpen = !filtersOpen)}
        title="Filtros"
      >
        <Filter size={18} />
        {#if activeFiltersCount() > 0}
          <span class="filter-badge">{activeFiltersCount()}</span>
        {/if}
      </button>

      {#if activeFiltersCount() > 0}
        <button
          class="clear-filters-btn"
          onclick={clearFilters}
          title="Limpiar filtros"
        >
          <X size={18} />
        </button>
      {/if}

      <div class="sort-select">
        <label for="sort-by">Ordenar por:</label>
        <select 
          id="sort-by" 
          bind:value={sortBy}
          onchange={() => {
            currentPage = 1;
            policies = [];
            loadPolicies();
          }}
        >
          {#each sortOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        <button
          class="sort-order-btn"
          onclick={toggleSort}
          title={sortOrder === "asc" ? "Ascendente" : "Descendente"}
        >
          {#if sortOrder === "asc"}
            <ArrowUp size={16} />
          {:else}
            <ArrowDown size={16} />
          {/if}
        </button>
      </div>
      <div class="results-count">
        {#if loading && policies.length === 0}
          <span class="count-skeleton"></span>
        {:else}
          <span class="count-text">{policies.length}</span>
          <span class="count-separator">/</span>
          <span class="count-total">{total}</span>
        {/if}
      </div>
    </div>
  </div>

  {#if loading}
    <div class="skeleton-list">
      {#each Array(5) as _}
        <Skeleton height="60px" />
      {/each}
    </div>
  {:else if policies.length === 0}
    <EmptyState
      icon={FileText}
      title="No hay pólizas"
      description={search || activeFiltersCount() > 0
        ? "No se encontraron resultados"
        : "Comienza agregando tu primera póliza"}
      action={search || activeFiltersCount() > 0
        ? undefined
        : { label: "Nueva Póliza", onclick: () => goto("/polizas/nuevo") }}
    />
  {:else}
    <!-- Vista de tarjetas para mobile/tablet -->
    <div class="cards-grid">
      {#each policies as policy, index}
        <PolicyCard
          {policy}
          {index}
          onView={(id) => openPolicyModal(id, "view")}
          onDelete={deletePolicy}
        />
      {/each}
    </div>

    <!-- Vista de tabla para desktop -->
    <div class="table-container">
      <Table>
        <thead class="sticky-header">
          <tr>
            <th style="width: 60px">#</th>
            <th>N° Póliza</th>
            <th>Cliente</th>
            <th>Aseguradora</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Vencimiento</th>
            <th>Creado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {#each policies as policy, index}
            {@const statusBadge = getStatusBadge(
              policy.active,
              policy.expiry_date
            )}
            {@const daysUntil = getDaysUntilExpiry(policy.expiry_date)}
            {@const clientName = policy.client
              ? `${policy.client.first_name} ${policy.client.last_name}`
              : "Cliente no disponible"}
            <tr>
              <td class="row-number">{index + 1}</td>
              <td>
                <button
                  class="policy-number-btn"
                  onclick={() => openPolicyModal(policy.id, "view")}
                >
                  {policy.policy_number || "S/N"}
                </button>
              </td>
              <td>
                <div class="client-info">
                  <User size={14} />
                  <button
                    class="client-link-btn"
                    onclick={() =>
                      goto(`/clientes?clientId=${policy.client_id}&mode=view&from=policy&fromId=${policy.id}`)}
                  >
                    {clientName}
                  </button>
                </div>
              </td>
              <td>
                <span class="insurer-name">{policy.insurer || '-'}</span>
              </td>
              <td>{policy.policy_type}</td>
              <td>
                <Badge variant={statusBadge.variant}>
                  {statusBadge.label}
                </Badge>
              </td>
              <td>
                <div class="expiry-info">
                  <Calendar size={14} />
                  <span class:warning={daysUntil <= 30 && daysUntil > 0}>
                    {formatDate(policy.expiry_date)}
                  </span>
                  {#if daysUntil <= 30 && daysUntil > 0}
                    <span class="expiry-badge">
                      {daysUntil}d
                    </span>
                  {/if}
                </div>
              </td>
              <td class="text-nowrap">
                {formatDate(policy.created_at)}
              </td>
              <td class="text-right">
                <div class="actions">
                  <button
                    class="action-btn"
                    onclick={() => openPolicyModal(policy.id, "view")}
                    title="Ver"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    class="action-btn danger"
                    onclick={() =>
                      deletePolicy(
                        policy.id,
                        policy.policy_number || "esta póliza"
                      )}
                    title="Eliminar"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </Table>
    </div>

    <InfiniteScroll {hasMore} onLoadMore={loadMore} />
  {/if}
</div>

<!-- Policy Filters Modal -->
<PolicyFilters
  open={filtersOpen}
  onClose={() => (filtersOpen = false)}
  onApply={handleApplyFilters}
  initialFilters={appliedFilters}
/>

<!-- Policy Modal -->
<PolicyModal {policyId} mode={modalMode} onClose={closePolicyModal} />

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  .page {
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-6);
    flex-wrap: wrap;
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

  .filters-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
    flex-wrap: wrap;
  }

  .filter-checkbox {
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      user-select: none;
      padding: var(--space-2) var(--space-3);
      border-radius: var(--radius-md);
      transition: background var(--transition-fast);

      &:hover {
        background: var(--bg-secondary);
      }

      input[type="checkbox"] {
        width: 18px;
        height: 18px;
        cursor: pointer;
      }

      span {
        font-size: var(--text-sm);
        color: var(--text-primary);
        font-weight: var(--font-medium);
      }
    }
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .filter-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-1);
    padding: var(--space-2);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    height: 38px;
    width: 38px;

    &:hover {
      background: var(--bg-secondary);
      border-color: var(--border-hover);
      color: var(--text-primary);
    }

    &.active {
      background: var(--primary-light);
      border-color: var(--primary);
      color: var(--primary);
    }
  }

  .filter-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    background: var(--primary);
    color: white;
    font-size: 10px;
    font-weight: var(--font-bold);
    border-radius: 9px;
    line-height: 1;
  }

  .clear-filters-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    height: 38px;
    width: 38px;

    &:hover {
      background: var(--danger-light);
      border-color: var(--danger);
      color: var(--danger);
    }
  }

  .sort-select {
    display: flex;
    align-items: center;
    gap: var(--space-2);

    label {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      font-weight: var(--font-medium);
    }

    select {
      @include select-base;
      width: auto;
    }
  }

  .sort-order-btn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-primary);
    background: var(--bg-primary);
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
      border-color: var(--primary-500);
      color: var(--primary-600);
    }
  }

  .results-count {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    white-space: nowrap;
    min-width: 60px;

    .count-text {
      color: var(--text-primary);
      font-weight: var(--font-semibold);
    }

    .count-separator {
      color: var(--text-tertiary);
    }

    .count-total {
      color: var(--text-secondary);
    }

    .count-skeleton {
      display: inline-block;
      width: 40px;
      height: 14px;
      background: linear-gradient(
        90deg,
        var(--border-primary) 0%,
        var(--bg-tertiary) 50%,
        var(--border-primary) 100%
      );
      background-size: 200% 100%;
      border-radius: var(--radius-sm);
      animation: skeleton-pulse 1.5s ease-in-out infinite;
    }
  }

  @keyframes skeleton-pulse {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .search-box {
    position: relative;
    flex: 1;
    min-width: 240px;

    :global(svg) {
      position: absolute;
      left: var(--space-3);
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-tertiary);
      pointer-events: none;
    }

    input {
      width: 100%;
      padding: var(--space-2) var(--space-3) var(--space-2) var(--space-10);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      background: var(--bg-primary);
      color: var(--text-primary);
      transition: all var(--transition-fast);

      &::placeholder {
        color: var(--text-tertiary);
      }

      &:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
      }
    }
  }

  // Estilos para el contenido del FilterPopup
  :global(.filter-group) {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  :global(.filter-label) {
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.025em;
  }

  :global(.sort-direction) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2);
  }

  :global(.sort-btn) {
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
    border: 1px solid var(--border-primary);
    background: var(--bg-primary);
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-weight: var(--font-medium);

    &:hover {
      background: var(--bg-secondary);
      border-color: var(--border-hover);
      color: var(--text-primary);
    }

    &:global(.active) {
      background: var(--primary);
      border-color: var(--primary);
      color: white;

      &:hover {
        background: var(--primary-600);
        border-color: var(--primary-600);
      }
    }
  }

  :global(.clear-filters-btn) {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    border: 1px solid var(--border-primary);
    background: var(--bg-primary);
    color: var(--text-secondary);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    margin-top: var(--space-2);

    &:hover {
      background: var(--error-50);
      border-color: var(--error-500);
      color: var(--error-600);
    }
  }

  .cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);

    @include responsive(md-up) {
      display: none;
    }
  }

  .table-container {
    position: relative;
    overflow-x: auto;
    display: none;

    @include responsive(md-up) {
      display: block;
    }
  }

  :global(.table-container .sticky-header) {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--bg-primary);
    box-shadow: 0 1px 0 var(--border-primary);
  }

  :global(.table-container .sticky-header th) {
    background: var(--bg-primary);
  }

  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .row-number {
    color: var(--text-tertiary);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    text-align: center;
  }

  .policy-number-btn {
    background: none;
    border: none;
    padding: 0;
    color: var(--primary-600);
    font-weight: var(--font-semibold);
    text-decoration: none;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    text-align: left;

    &:hover {
      text-decoration: underline;
    }
  }

  .client-info {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text-secondary);
  }

  .client-link-btn {
    background: none;
    border: none;
    padding: 0;
    color: var(--text-secondary);
    text-decoration: none;
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    text-align: left;

    &:hover {
      color: var(--primary-600);
      text-decoration: underline;
    }
  }

  .insurer-name {
    color: var(--text-primary);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
  }

  .expiry-info {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text-secondary);

    .warning {
      color: var(--warning-600);
      font-weight: var(--font-medium);
    }
  }

  .expiry-badge {
    padding: var(--space-1) var(--space-2);
    background: var(--warning-100);
    color: var(--warning-700);
    font-size: var(--text-xs);
    font-weight: var(--font-semibold);
    border-radius: var(--radius-full);
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-2);
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

  @media (max-width: 768px) {
    .page-header {
      h1 {
        font-size: var(--text-2xl);
      }
    }

    .search-box {
      min-width: 100%;
    }
  }
</style>

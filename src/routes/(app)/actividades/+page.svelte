<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import InfiniteScroll from "$lib/components/ui/InfiniteScroll.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import Skeleton from "$lib/components/ui/Skeleton.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import {
    Users,
    FileText,
    ClipboardList,
    Filter,
    X,
    Calendar,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Activity,
  } from "lucide-svelte";
  import { debounce } from "$lib/utils";

  interface Activity {
    id: string;
    type: "client" | "policy" | "followup";
    title: string;
    description: string;
    date: string;
    entity_id: string;
    entity_name: string;
  }

  interface FilterValues {
    types: string[];
    dateFrom: string;
    dateTo: string;
  }

  let activities = $state<Activity[]>([]);
  let loading = $state(true);
  let loadingMore = $state(false);
  let currentPage = $state(1);
  let limit = $state(30);
  let total = $state(0);
  let hasMore = $state(true);
  let filtersOpen = $state(false);
  let sortBy = $state<"date">("date");
  let sortOrder = $state<"asc" | "desc">("desc");
  let appliedFilters = $state<FilterValues>({
    types: [],
    dateFrom: "",
    dateTo: "",
  });

  onMount(() => {
    loadActivities();
  });

  async function loadActivities(append = false) {
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

      // Add filters
      appliedFilters.types.forEach((type) => {
        params.append("type", type);
      });

      if (appliedFilters.dateFrom) {
        params.append("date_from", appliedFilters.dateFrom);
      }

      if (appliedFilters.dateTo) {
        params.append("date_to", appliedFilters.dateTo);
      }

      const response = await fetch(`/api/activities?${params}`);
      const result = await response.json();

      if (response.ok) {
        if (append) {
          activities = [...activities, ...(result.activities || [])];
        } else {
          activities = result.activities || [];
        }
        total = result.pagination?.total || 0;
        hasMore = activities.length < total;
      } else {
        console.error("Error loading activities:", result.message);
        activities = [];
      }
    } catch (err) {
      console.error("Error loading activities:", err);
      activities = [];
    } finally {
      loading = false;
      loadingMore = false;
    }
  }

  function loadMore() {
    if (!loading && !loadingMore && hasMore) {
      currentPage++;
      loadActivities(true);
    }
  }

  function toggleSort() {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    currentPage = 1;
    activities = [];
    loadActivities();
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getActivityIcon(type: string) {
    switch (type) {
      case "client":
        return Users;
      case "policy":
        return FileText;
      case "followup":
        return ClipboardList;
      default:
        return Activity;
    }
  }

  function getActivityColor(
    type: string
  ): "error" | "success" | "info" | "warning" | "default" {
    switch (type) {
      case "client":
        return "info";
      case "policy":
        return "success";
      case "followup":
        return "warning";
      default:
        return "default";
    }
  }

  function handleFilterChange(filterType: keyof FilterValues, value: any) {
    if (filterType === "types") {
      if (appliedFilters.types.includes(value)) {
        appliedFilters.types = appliedFilters.types.filter((t) => t !== value);
      } else {
        appliedFilters.types = [...appliedFilters.types, value];
      }
    } else {
      appliedFilters[filterType] = value;
    }

    // Reload with new filters
    currentPage = 1;
    activities = [];
    loadActivities();
  }

  function clearFilters() {
    appliedFilters = {
      types: [],
      dateFrom: "",
      dateTo: "",
    };
    currentPage = 1;
    activities = [];
    loadActivities();
  }

  const activeFiltersCount = $derived(() => {
    let count = appliedFilters.types.length;
    if (appliedFilters.dateFrom) count++;
    if (appliedFilters.dateTo) count++;
    return count;
  });
</script>

<svelte:head>
  <title>Actividades - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <h1>Actividades Recientes</h1>
      <p>Historial completo de actividad en el sistema</p>
    </div>
  </div>

  <div class="filters-toolbar">
    <div class="toolbar-actions">
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
          Limpiar filtros
        </button>
      {/if}

      <button
        class="sort-btn"
        onclick={toggleSort}
        title={sortOrder === "asc" ? "Ascendente" : "Descendente"}
      >
        <Calendar size={16} />
        Fecha
        {#if sortOrder === "asc"}
          <ArrowUp size={16} />
        {:else}
          <ArrowDown size={16} />
        {/if}
      </button>

      <div class="results-count">
        {#if loading && activities.length === 0}
          <span class="count-skeleton"></span>
        {:else}
          <span class="count-text">{activities.length}</span>
          <span class="count-separator">/</span>
          <span class="count-total">{total}</span>
        {/if}
      </div>
    </div>
  </div>

  <!-- Filters Panel -->
  {#if filtersOpen}
    <div class="filters-panel">
      <div class="filter-group">
        <label class="filter-label" for="activity-type">Tipo de Actividad</label
        >
        <div class="filter-options">
          <label class="checkbox-label">
            <input
              type="checkbox"
              checked={appliedFilters.types.includes("client")}
              onchange={() => handleFilterChange("types", "client")}
            />
            <span>Clientes</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              checked={appliedFilters.types.includes("policy")}
              onchange={() => handleFilterChange("types", "policy")}
            />
            <span>Pólizas</span>
          </label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              checked={appliedFilters.types.includes("followup")}
              onchange={() => handleFilterChange("types", "followup")}
            />
            <span>Seguimientos</span>
          </label>
        </div>
      </div>

      <div class="filter-group">
        <label class="filter-label" for="date-range">Rango de Fechas</label>
        <div class="date-range">
          <input
            type="date"
            value={appliedFilters.dateFrom}
            onchange={(e) =>
              handleFilterChange("dateFrom", e.currentTarget.value)}
            placeholder="Desde"
          />
          <span>hasta</span>
          <input
            type="date"
            value={appliedFilters.dateTo}
            onchange={(e) =>
              handleFilterChange("dateTo", e.currentTarget.value)}
            placeholder="Hasta"
          />
        </div>
      </div>
    </div>
  {/if}

  <!-- Activities List -->
  {#if loading}
    <div class="skeleton-list">
      {#each Array(10) as _}
        <Skeleton height="80px" />
      {/each}
    </div>
  {:else if activities.length === 0}
    <EmptyState
      icon={Activity}
      title="No hay actividades"
      description={activeFiltersCount() > 0
        ? "No se encontraron resultados con los filtros aplicados"
        : "Aún no hay actividad registrada en el sistema"}
      action={activeFiltersCount() > 0
        ? { label: "Limpiar filtros", onclick: clearFilters }
        : undefined}
    />
  {:else}
    <div class="activities-list">
      {#each activities as activity}
        {@const Icon = getActivityIcon(activity.type)}
        {@const color = getActivityColor(activity.type)}
        <div class="activity-card">
          <div class="activity-icon activity-icon-{color}">
            <Icon size={20} />
          </div>
          <div class="activity-content">
            <div class="activity-header">
              <h3 class="activity-title">{activity.title}</h3>
              <Badge variant={color}>{activity.type}</Badge>
            </div>
            <p class="activity-description">{activity.description}</p>
            <div class="activity-footer">
              <span class="activity-entity">{activity.entity_name}</span>
              <span class="activity-date">
                <Calendar size={14} />
                {formatDate(activity.date)}
              </span>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <InfiniteScroll {hasMore} onLoadMore={loadMore} />
  {/if}
</div>

<style lang="scss">
  .page {
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-6);

    h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    p {
      font-size: var(--text-base);
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .filters-toolbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: var(--space-5);
    gap: var(--space-3);
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
  }

  .clear-filters-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);

    &:hover {
      background: var(--danger-light);
      border-color: var(--danger);
      color: var(--danger);
    }
  }

  .sort-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    color: var(--text-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);

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

  .filters-panel {
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    margin-bottom: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    .filter-label {
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
    }
  }

  .filter-options {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);

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

  .date-range {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;

    span {
      font-size: var(--text-sm);
      color: var(--text-secondary);
    }
  }

  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .activities-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .activity-card {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-4);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-lg);
    transition: all var(--transition-fast);

    &:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-sm);
    }
  }

  .activity-icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.activity-icon-primary {
      background: var(--primary-100);
      color: var(--primary-600);
    }

    &.activity-icon-success {
      background: var(--success-50);
      color: var(--success-500);
    }

    &.activity-icon-info {
      background: var(--info-50);
      color: var(--info-500);
    }

    &.activity-icon-default {
      background: var(--bg-secondary);
      color: var(--text-secondary);
    }
  }

  .activity-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .activity-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .activity-title {
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
  }

  .activity-description {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin: 0;
  }

  .activity-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    margin-top: var(--space-1);
  }

  .activity-entity {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    font-weight: var(--font-medium);
  }

  .activity-date {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: var(--text-2xl);
    }

    .activity-card {
      flex-direction: column;
      gap: var(--space-3);
    }

    .activity-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .activity-footer {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Table from "$lib/components/ui/Table.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import Skeleton from "$lib/components/ui/Skeleton.svelte";
  import InfiniteScroll from "$lib/components/ui/InfiniteScroll.svelte";
  import ClientModal from "$lib/components/ClientModal.svelte";
  import ClientFilters from "$lib/components/ClientFilters.svelte";
  import type { FilterValues } from "$lib/components/ClientFilters.svelte";
  import { showToast } from "$lib/stores/notifications";
  import {
    Users,
    Plus,
    Search,
    Mail,
    Phone,
    MoreVertical,
    Eye,
    Trash,
    FileText,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Filter,
    X,
    MessageCircle,
  } from "lucide-svelte";
  import { debounce } from "$lib/utils";
  import type { Client } from "$lib/types/database.types";
  import { isMobileNumber, getWhatsAppUrl } from "$lib/utils/phone";

  type ClientWithCount = Client & {
    active_policies_count?: number;
  };

  let { data } = $props();

  let clients = $state<ClientWithCount[]>([]);
  let loading = $state(true);
  let loadingMore = $state(false);
  let search = $state("");
  let showInactive = $state(false);
  let sortBy = $state<
    "first_name" | "last_name" | "created_at" | "updated_at" | "policy_count"
  >("first_name");
  let sortOrder = $state<"asc" | "desc">("asc");
  let currentPage = $state(1);
  let limit = $state(30);
  let total = $state(0);
  let hasMore = $state(true);
  let filtersOpen = $state(false);
  let appliedFilters = $state<FilterValues>({
    cities: [],
    hasEmail: undefined,
    hasPhone: undefined,
    dateFrom: "",
    dateTo: "",
  });

  // Modal state from URL
  let clientId = $derived($page.url.searchParams.get("clientId"));
  let modalMode = $derived(
    ($page.url.searchParams.get("mode") as "view" | "edit") || "view"
  );

  onMount(() => {
    // Cargar preferencia de localStorage
    const savedPref = localStorage.getItem("clients_show_inactive");
    if (savedPref !== null) {
      showInactive = savedPref === "true";
    }
    loadClients();
  });

  const debouncedSearch = debounce(() => {
    currentPage = 1;
    clients = [];
    loadClients();
  }, 300);

  $effect(() => {
    if (search !== undefined) {
      debouncedSearch();
    }
  });

  async function loadClients(append = false) {
    if (append) {
      loadingMore = true;
    } else {
      loading = true;
    }

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (!showInactive) {
        params.append("active_only", "true");
      }

      // Add sorting
      params.append("sort_by", sortBy);
      params.append("sort_order", sortOrder);

      // Add filters
      appliedFilters.cities.forEach((city) => {
        params.append("city", city);
      });

      if (appliedFilters.hasEmail !== undefined) {
        params.append("has_email", appliedFilters.hasEmail.toString());
      }

      if (appliedFilters.hasPhone !== undefined) {
        params.append("has_phone", appliedFilters.hasPhone.toString());
      }

      if (appliedFilters.dateFrom) {
        params.append("date_from", appliedFilters.dateFrom);
      }

      if (appliedFilters.dateTo) {
        params.append("date_to", appliedFilters.dateTo);
      }

      console.log("Fetching clients:", `/api/clients?${params}`);
      const response = await fetch(`/api/clients?${params}`);
      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Result:", result);

      if (response.ok) {
        if (append) {
          clients = [...clients, ...(result.clients || [])];
        } else {
          clients = result.clients || [];
        }
        total = result.pagination?.total || 0;
        hasMore = clients.length < total;
      } else {
        showToast({
          type: "error",
          message: result.message || "Error al cargar clientes",
        });
        clients = [];
      }
    } catch (err) {
      console.error("Error loading clients:", err);
      showToast({ type: "error", message: "Error al cargar clientes" });
      clients = [];
    } finally {
      loading = false;
      loadingMore = false;
    }
  }

  function loadMore() {
    if (!loading && !loadingMore && hasMore) {
      currentPage++;
      loadClients(true);
    }
  }

  async function deleteClient(id: string, firstName: string, lastName: string) {
    if (!confirm(`¿Seguro que deseas eliminar a ${firstName} ${lastName}?`))
      return;

    try {
      const response = await fetch(`/api/clients/${id}`, { method: "DELETE" });

      if (response.ok) {
        showToast({ type: "success", message: "Cliente eliminado" });
        loadClients();
      } else {
        const result = await response.json();
        showToast({ type: "error", message: result.message });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al eliminar" });
    }
  }

  function openClientModal(id: string, mode: "view" | "edit" = "view") {
    const url = new URL(window.location.href);
    url.searchParams.set("clientId", id);
    url.searchParams.set("mode", mode);
    goto(url.pathname + url.search, { replaceState: false, noScroll: true });
  }

  function closeClientModal(saved?: boolean) {
    const url = new URL(window.location.href);
    url.searchParams.delete("clientId");
    url.searchParams.delete("mode");
    goto(url.pathname + url.search, { replaceState: false, noScroll: true });
    // Only refresh if changes were saved
    if (saved) {
      loadClients();
    }
  }

  function handleSort(column: typeof sortBy) {
    if (sortBy === column) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortBy = column;
      sortOrder = "asc";
    }
    currentPage = 1;
    clients = [];
    loadClients();
  }

  function toggleSort() {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    currentPage = 1;
    clients = [];
    loadClients();
  }

  function handleFiltersApply(filters: FilterValues) {
    appliedFilters = filters;
    currentPage = 1;
    clients = [];
    loadClients();
  }

  function clearFilters() {
    appliedFilters = {
      cities: [],
      hasEmail: undefined,
      hasPhone: undefined,
      dateFrom: "",
      dateTo: "",
    };
    currentPage = 1;
    clients = [];
    loadClients();
  }

  // Count active filters
  const activeFiltersCount = $derived(() => {
    let count = appliedFilters.cities.length;
    if (appliedFilters.hasEmail !== undefined) count++;
    if (appliedFilters.hasPhone !== undefined) count++;
    if (appliedFilters.dateFrom) count++;
    if (appliedFilters.dateTo) count++;
    return count;
  });

  // Helper para formatear la dirección completa
  function formatAddress(client: ClientWithCount): string {
    const parts = [];

    // Construir dirección desde campos individuales
    const streetParts = [];
    if (client.street) streetParts.push(client.street);
    if (client.street_number) streetParts.push(client.street_number);
    if (client.floor) streetParts.push(`Piso ${client.floor}`);
    if (client.apartment) streetParts.push(`Depto ${client.apartment}`);
    
    if (streetParts.length > 0) {
      parts.push(streetParts.join(" "));
    }

    if (client.city) {
      parts.push(client.city);
    }

    if (client.province) {
      parts.push(client.province);
    }

    if (client.postal_code) {
      parts.push(`(CP ${client.postal_code})`);
    }

    return parts.length > 0 ? parts.join(", ") : "-";
  }

  // Copiar al clipboard
  async function copyToClipboard(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      showToast({
        type: "success",
        message: `${label} copiado al portapapeles`,
      });
    } catch (err) {
      showToast({
        type: "error",
        message: "Error al copiar",
      });
    }
  }
</script>

<svelte:head>
  <title>Clientes - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <h1>Clientes</h1>
      <p>Gestiona tus clientes y su información</p>
    </div>
    <Button variant="primary" onclick={() => goto("/clientes/nuevo")}>
      <Plus size={18} />
      Nuevo Cliente
    </Button>
  </div>

  <div class="filters-toolbar">
    <div class="search-box">
      <Search size={20} />
      <input type="text" placeholder="Buscar clientes..." bind:value={search} />
    </div>

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
        </button>
      {/if}

      <div class="filter-checkbox">
        <label class="checkbox-label">
          <input
            type="checkbox"
            bind:checked={showInactive}
            onchange={() => {
              localStorage.setItem(
                "clients_show_inactive",
                showInactive.toString()
              );
              currentPage = 1;
              clients = [];
              loadClients();
            }}
          />
          <span>Mostrar inactivos</span>
        </label>
      </div>

      <div class="sort-select">
        <label for="sort-by">Ordenar por:</label>
        <select
          id="sort-by"
          bind:value={sortBy}
          onchange={() => {
            currentPage = 1;
            clients = [];
            loadClients();
          }}
        >
          <option value="first_name">Nombre</option>
          <option value="last_name">Apellido</option>
          <option value="policy_count">Cantidad de pólizas</option>
          <option value="created_at">Fecha creación</option>
          <option value="updated_at">Última actualización</option>
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
        {#if loading && clients.length === 0}
          <span class="count-skeleton"></span>
        {:else}
          <span class="count-text">{clients.length}</span>
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
  {:else if clients.length === 0}
    <EmptyState
      icon={Users}
      title="No hay clientes"
      description={search
        ? "No se encontraron resultados"
        : "Comienza agregando tu primer cliente"}
      action={search
        ? undefined
        : { label: "Nuevo Cliente", onclick: () => goto("/clientes/nuevo") }}
    />
  {:else}
    <Table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>DNI/CUIT</th>
          <th>Email</th>
          <th>Celular</th>
          <th>Teléfono</th>
          <th>Domicilio</th>
          <th>Creado</th>
          <th class="text-center">Pólizas</th>
          <th class="text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {#each clients as client}
          <tr>
            <td>
              <button
                class="copyable-btn name-cell"
                onclick={() =>
                  copyToClipboard(
                    `${client.first_name} ${client.last_name}`,
                    "Nombre"
                  )}
                title="Click para copiar nombre"
              >
                {client.first_name}
                {client.last_name}
              </button>
            </td>
            <td>
              {#if client.document_number}
                <button
                  class="copyable-btn id-cell"
                  onclick={() =>
                    copyToClipboard(client.document_number!, "DNI/CUIT")}
                  title="Click para copiar DNI/CUIT"
                >
                  {client.document_number}
                </button>
              {:else}
                <span class="text-muted">-</span>
              {/if}
            </td>
            <td>
              {#if client.email_primary}
                <button
                  class="copyable-btn email"
                  onclick={() =>
                    copyToClipboard(client.email_primary!, "Email")}
                  title="Click para copiar"
                >
                  <Mail size={14} />
                  {client.email_primary}
                </button>
              {:else}
                <span class="text-muted">-</span>
              {/if}
            </td>
            <td>
              {#if client.phone}
                <div class="phone-cell">
                  <button
                    class="copyable-btn phone"
                    onclick={() => copyToClipboard(client.phone!, "Celular")}
                    title="Click para copiar"
                  >
                    <Phone size={14} />
                    {client.phone}
                  </button>
                  {#if isMobileNumber(client.phone)}
                    <a
                      href={getWhatsAppUrl(client.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="whatsapp-btn"
                      title="Abrir en WhatsApp"
                    >
                      <MessageCircle size={20} fill="#25d36690" />
                    </a>
                  {/if}
                </div>
              {:else}
                <span class="text-muted">-</span>
              {/if}
            </td>
            <td>
              {#if client.phone_landline}
                <button
                  class="copyable-btn phone"
                  onclick={() =>
                    copyToClipboard(client.phone_landline!, "Teléfono")}
                  title="Click para copiar"
                >
                  <Phone size={14} />
                  {client.phone_landline}
                </button>
              {:else}
                <span class="text-muted">-</span>
              {/if}
            </td>
            <td>
              {#if formatAddress(client) !== "-"}
                <button
                  class="copyable-btn address-cell"
                  onclick={() =>
                    copyToClipboard(formatAddress(client), "Dirección")}
                  title="Click para copiar"
                >
                  {formatAddress(client)}
                </button>
              {:else}
                <span class="text-muted">-</span>
              {/if}
            </td>
            <td class="text-nowrap">
              {new Date(client.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </td>
            <td class="text-center">
              <div class="policies-count">
                <FileText size={14} />
                <span>{client.active_policies_count || 0}</span>
              </div>
            </td>
            <td class="text-right">
              <div class="actions">
                <button
                  class="action-btn view-btn"
                  onclick={() => openClientModal(client.id, "view")}
                  title="Ver detalles"
                >
                  <Eye size={16} />
                </button>
                <button
                  class="action-btn danger"
                  onclick={() =>
                    deleteClient(
                      client.id,
                      client.first_name,
                      client.last_name
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

    <InfiniteScroll {hasMore} onLoadMore={loadMore} />
  {/if}
</div>

<!-- Client Modal -->
<ClientModal {clientId} mode={modalMode} onClose={closeClientModal} />

<!-- Filters Panel -->
<ClientFilters
  open={filtersOpen}
  onClose={() => (filtersOpen = false)}
  onApply={handleFiltersApply}
  initialFilters={appliedFilters}
/>

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
    justify-content: space-between;
    gap: var(--space-3);
    margin-bottom: var(--space-5);
    flex-wrap: wrap;
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: var(--space-3);
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
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      background: var(--bg-primary);
      color: var(--text-primary);
      cursor: pointer;
      transition: border-color var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--primary-500);
      }
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

  @media (max-width: 768px) {
    .search-box {
      min-width: 100%;
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

  .skeleton-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .copyable-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: none;
    border: none;
    padding: var(--space-1) var(--space-2);
    margin: calc(var(--space-1) * -1) calc(var(--space-2) * -1);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: inherit;
    font-family: inherit;
    color: var(--text-secondary);
    transition: all var(--transition-fast);
    text-align: left;
    width: fit-content;

    &:hover {
      background: var(--bg-secondary);
      color: var(--primary-600);
    }

    &:active {
      transform: scale(0.98);
    }

    &.id-cell {
      font-family: monospace;
      font-size: var(--text-xs);
      color: var(--text-tertiary);
      font-weight: var(--font-medium);
    }

    &.name-cell {
      color: var(--text-primary);
      font-weight: var(--font-medium);
    }

    &.email,
    &.phone {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    &.address-cell {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: var(--text-sm);
    }
  }

  .email,
  .phone {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--text-secondary);
  }

  .phone-cell {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    white-space: nowrap;
  }

  .whatsapp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-1);
    color: white;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    text-decoration: none;
    flex-shrink: 0;

    &:hover {
      background: var(--primary-50);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .policies-count {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    background: var(--primary-50);
    color: var(--primary-700);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);

    :global([data-theme="dark"]) & {
      background: rgba(139, 92, 246, 0.15);
      color: var(--primary-400);
    }
  }

  .text-muted {
    color: var(--text-tertiary);
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
      background: var(--primary-50);
      color: var(--primary-600);
    }

    &.danger:hover {
      background: var(--error-50);
      color: var(--error-600);
    }
  }
</style>

<script lang="ts">
  /**
   * Client Filters Component
   * Checkbox-based filters for client list with Apply button
   */
  import Button from "$lib/components/ui/Button.svelte";
  import { X, Check } from "lucide-svelte";

  // Props
  interface Props {
    open: boolean;
    onClose: () => void;
    onApply: (filters: FilterValues) => void;
    initialFilters?: FilterValues;
  }

  let { open, onClose, onApply, initialFilters }: Props = $props();

  // Set default values for initial filters
  const defaultFilters: FilterValues = {
    cities: [],
    hasEmail: undefined,
    hasPhone: undefined,
    dateFrom: "",
    dateTo: "",
  };

  // Filter state
  export interface FilterValues {
    cities: string[];
    hasEmail?: boolean;
    hasPhone?: boolean;
    dateFrom?: string;
    dateTo?: string;
  }

  let selectedCities = $state<string[]>(
    initialFilters?.cities || defaultFilters.cities
  );
  let hasEmail = $state<boolean | undefined>(initialFilters?.hasEmail);
  let hasPhone = $state<boolean | undefined>(initialFilters?.hasPhone);
  let dateFrom = $state<string>(initialFilters?.dateFrom || "");
  let dateTo = $state<string>(initialFilters?.dateTo || "");

  // Available cities - would be loaded from API in production
  const cityOptions = [
    // Ciudades de Argentina
    "Buenos Aires",
    "Córdoba",
    "Rosario",
    "Mendoza",
    "San Miguel de Tucumán",
    "La Plata",
    "Mar del Plata",
    "Salta",
    "Santa Fe",
    "San Juan",
    "Resistencia",
    "Santiago del Estero",
    "Corrientes",
    "Posadas",
    "San Salvador de Jujuy",
  ];

  // Toggle checkbox selection
  function toggleCity(city: string) {
    if (selectedCities.includes(city)) {
      selectedCities = selectedCities.filter((c) => c !== city);
    } else {
      selectedCities = [...selectedCities, city];
    }
  }

  // Clear all filters
  function clearAll() {
    selectedCities = [];
    hasEmail = undefined;
    hasPhone = undefined;
    dateFrom = "";
    dateTo = "";
  }

  // Apply filters
  function handleApply() {
    onApply({
      cities: selectedCities,
      hasEmail,
      hasPhone,
      dateFrom,
      dateTo,
    });
    onClose();
  }

  // Count active filters
  const activeCount = $derived(() => {
    let count = selectedCities.length;
    if (hasEmail !== undefined) count++;
    if (hasPhone !== undefined) count++;
    if (dateFrom) count++;
    if (dateTo) count++;
    return count;
  });

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      onClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <!-- Backdrop -->
  <button class="backdrop" onclick={onClose} aria-label="Close filter panel"
  ></button>

  <!-- Filter Panel -->
  <div class="filter-panel">
    <!-- Header -->
    <div class="filter-header">
      <h3>Filtros</h3>
      <button class="close-btn" onclick={onClose}>
        <X size={20} />
      </button>
    </div>

    <!-- Filter Content -->
    <div class="filter-content">
      <!-- Cities -->
      <div class="filter-section">
        <h4>Ciudad</h4>
        <div class="checkbox-list">
          {#each cityOptions as city}
            <label class="checkbox-item">
              <input
                type="checkbox"
                checked={selectedCities.includes(city)}
                onchange={() => toggleCity(city)}
              />
              <span>{city}</span>
            </label>
          {/each}
        </div>
      </div>

      <!-- Contact Information -->
      <div class="filter-section">
        <h4>Información de Contacto</h4>
        <div class="checkbox-list">
          <label class="checkbox-item">
            <input
              type="checkbox"
              checked={hasEmail === true}
              onchange={() => (hasEmail = hasEmail === true ? undefined : true)}
            />
            <span>Con email</span>
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              checked={hasPhone === true}
              onchange={() => (hasPhone = hasPhone === true ? undefined : true)}
            />
            <span>Con teléfono</span>
          </label>
        </div>
      </div>

      <!-- Date Range -->
      <div class="filter-section">
        <h4>Fecha de Creación</h4>
        <div class="date-inputs">
          <div class="input-group">
            <label for="date-from">Desde</label>
            <input id="date-from" type="date" bind:value={dateFrom} />
          </div>
          <div class="input-group">
            <label for="date-to">Hasta</label>
            <input id="date-to" type="date" bind:value={dateTo} />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="filter-footer">
      <Button variant="ghost" size="sm" onclick={clearAll}>Limpiar todo</Button>
      <Button variant="primary" onclick={handleApply}>
        <Check size={18} />
        Aplicar {#if activeCount() > 0}({activeCount()}){/if}
      </Button>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  /* Backdrop overlay */
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 40;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Filter panel sliding from right */
  .filter-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 400px;
    background: var(--bg-primary);
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 50;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease;

    @include mobile {
      max-width: 100%;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  /* Header */
  .filter-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    border-bottom: 1px solid var(--border-primary);

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .close-btn {
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
        color: var(--text-primary);
      }
    }
  }

  /* Content with scroll */
  .filter-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-4);
  }

  /* Filter sections */
  .filter-section {
    margin-bottom: var(--space-6);

    &:last-child {
      margin-bottom: 0;
    }

    h4 {
      font-size: var(--text-sm);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-3) 0;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }
  }

  /* Checkbox list */
  .checkbox-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2);
    border-radius: var(--radius-md);
    cursor: pointer;
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
      user-select: none;
    }
  }

  /* Date inputs */
  .date-inputs {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    label {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      font-weight: var(--font-medium);
    }

    input[type="date"] {
      padding: var(--space-2);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: var(--text-sm);
      transition: all var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-light);
      }
    }
  }

  /* Footer */
  .filter-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4);
    border-top: 1px solid var(--border-primary);
    gap: var(--space-3);
  }
</style>

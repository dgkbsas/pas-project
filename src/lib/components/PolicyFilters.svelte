<script lang="ts">
  /**
   * Policy Filters Component
   * Checkbox-based filters for policy list with Apply button
   */
  import Button from '$lib/components/ui/Button.svelte';
  import { X, Check } from 'lucide-svelte';
  import type { PolicyType, PaymentMode, PolicyStatus } from '$lib/types';

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
    policyTypes: [],
    paymentModes: [],
    insurers: [],
    statuses: [],
  };

  // Filter state
  export interface FilterValues {
    policyTypes: PolicyType[];
    paymentModes: PaymentMode[];
    insurers: string[];
    statuses: PolicyStatus[];
  }

  let selectedPolicyTypes = $state<PolicyType[]>(initialFilters?.policyTypes || defaultFilters.policyTypes);
  let selectedPaymentModes = $state<PaymentMode[]>(initialFilters?.paymentModes || defaultFilters.paymentModes);
  let selectedInsurers = $state<string[]>(initialFilters?.insurers || defaultFilters.insurers);
  let selectedStatuses = $state<PolicyStatus[]>(initialFilters?.statuses || defaultFilters.statuses);

  // Available options
  const policyTypeOptions: { value: PolicyType; label: string }[] = [
    { value: 'auto', label: 'Auto' },
    { value: 'home', label: 'Hogar' },
    { value: 'life', label: 'Vida' },
    { value: 'health', label: 'Salud' },
    { value: 'business', label: 'Empresa' },
    { value: 'other', label: 'Otro' },
  ];

  const paymentModeOptions: { value: PaymentMode; label: string }[] = [
    { value: 'monthly', label: 'Mensual' },
    { value: 'quarterly', label: 'Trimestral' },
    { value: 'semi-annual', label: 'Semestral' },
    { value: 'annual', label: 'Anual' },
  ];

  const statusOptions: { value: PolicyStatus; label: string }[] = [
    { value: 'active', label: 'Activa' },
    { value: 'inactive', label: 'Inactiva' },
    { value: 'expiring_soon', label: 'Por vencer' },
    { value: 'expired', label: 'Vencida' },
  ];

  // For now, we'll have a fixed list of insurers
  // TODO: Load from API/configuration
  const insurerOptions = [
    'Mapfre',
    'AXA',
    'Allianz',
    'Generali',
    'Zurich',
  ];

  // Toggle checkbox selection
  function togglePolicyType(type: PolicyType) {
    if (selectedPolicyTypes.includes(type)) {
      selectedPolicyTypes = selectedPolicyTypes.filter(t => t !== type);
    } else {
      selectedPolicyTypes = [...selectedPolicyTypes, type];
    }
  }

  function togglePaymentMode(mode: PaymentMode) {
    if (selectedPaymentModes.includes(mode)) {
      selectedPaymentModes = selectedPaymentModes.filter(m => m !== mode);
    } else {
      selectedPaymentModes = [...selectedPaymentModes, mode];
    }
  }

  function toggleInsurer(insurer: string) {
    if (selectedInsurers.includes(insurer)) {
      selectedInsurers = selectedInsurers.filter(i => i !== insurer);
    } else {
      selectedInsurers = [...selectedInsurers, insurer];
    }
  }

  function toggleStatus(status: PolicyStatus) {
    if (selectedStatuses.includes(status)) {
      selectedStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      selectedStatuses = [...selectedStatuses, status];
    }
  }

  // Clear all filters
  function clearAll() {
    selectedPolicyTypes = [];
    selectedPaymentModes = [];
    selectedInsurers = [];
    selectedStatuses = [];
  }

  // Apply filters
  function handleApply() {
    onApply({
      policyTypes: selectedPolicyTypes,
      paymentModes: selectedPaymentModes,
      insurers: selectedInsurers,
      statuses: selectedStatuses,
    });
    onClose();
  }

  // Count active filters
  const activeCount = $derived(() => {
    return selectedPolicyTypes.length + selectedPaymentModes.length + selectedInsurers.length + selectedStatuses.length;
  });
</script>

{#if open}
  <!-- Backdrop -->
  <div class="backdrop" onclick={onClose}></div>

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
      <!-- Policy Types -->
      <div class="filter-section">
        <h4>Tipo de Póliza</h4>
        <div class="checkbox-list">
          {#each policyTypeOptions as option}
            <label class="checkbox-item">
              <input
                type="checkbox"
                checked={selectedPolicyTypes.includes(option.value)}
                onchange={() => togglePolicyType(option.value)}
              />
              <span>{option.label}</span>
            </label>
          {/each}
        </div>
      </div>

      <!-- Payment Modes -->
      <div class="filter-section">
        <h4>Forma de Pago</h4>
        <div class="checkbox-list">
          {#each paymentModeOptions as option}
            <label class="checkbox-item">
              <input
                type="checkbox"
                checked={selectedPaymentModes.includes(option.value)}
                onchange={() => togglePaymentMode(option.value)}
              />
              <span>{option.label}</span>
            </label>
          {/each}
        </div>
      </div>

      <!-- Insurers -->
      <div class="filter-section">
        <h4>Aseguradora</h4>
        <div class="checkbox-list">
          {#each insurerOptions as insurer}
            <label class="checkbox-item">
              <input
                type="checkbox"
                checked={selectedInsurers.includes(insurer)}
                onchange={() => toggleInsurer(insurer)}
              />
              <span>{insurer}</span>
            </label>
          {/each}
        </div>
      </div>

      <!-- Status -->
      <div class="filter-section">
        <h4>Estado</h4>
        <div class="checkbox-list">
          {#each statusOptions as option}
            <label class="checkbox-item">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(option.value)}
                onchange={() => toggleStatus(option.value)}
              />
              <span>{option.label}</span>
            </label>
          {/each}
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="filter-footer">
      <Button variant="ghost" size="sm" onclick={clearAll}>
        Limpiar todo
      </Button>
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
    from { opacity: 0; }
    to { opacity: 1; }
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

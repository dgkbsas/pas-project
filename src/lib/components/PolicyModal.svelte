<script lang="ts">
  /**
   * Policy Modal Component
   * Slide-in modal from right for viewing/editing policy details
   * Maintains URL for analytics while providing modal UX
   */
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { showToast } from "$lib/stores/notifications";
  import { X, Save, Edit2, FileText, User, ArrowLeft } from "lucide-svelte";
  import type { PolicyWithClient, PolicyType, PaymentMode } from "$lib/types";

  // Props
  interface Props {
    policyId: string | null;
    mode: "view" | "edit";
    onClose: (saved?: boolean) => void;
  }

  let { policyId, mode = "view", onClose }: Props = $props();

  // State
  let policy = $state<PolicyWithClient | null>(null);
  let loading = $state(false);
  let saving = $state(false);
  let isEditMode = $state(mode === "edit");

  // Form data
  let formData = $state({
    policy_number: "",
    policy_type: "auto" as PolicyType,
    insurer: "",
    payment_mode: "monthly" as PaymentMode,
    start_date: "",
    expiry_date: "",
    vehicle_plate: "",
    vehicle_brand: "",
    vehicle_model: "",
    observations: "",
  });

  let errors = $state<Record<string, string>>({});

  // Reset edit mode when policyId changes or modal reopens
  $effect(() => {
    if (policyId) {
      isEditMode = mode === "edit";
      loadPolicy();
    }
  });

  // Load policy details from API
  async function loadPolicy() {
    if (!policyId) return;

    loading = true;
    try {
      const response = await fetch(`/api/policies/${policyId}`);
      const result = await response.json();

      if (response.ok) {
        policy = result.policy;

        // Populate form data
        formData = {
          policy_number: policy?.policy_number || "",
          policy_type: policy?.policy_type || "auto",
          insurer: policy?.insurer || "",
          payment_mode: policy?.payment_mode || "monthly",
          start_date: policy?.start_date || "",
          expiry_date: policy?.expiry_date || "",
          vehicle_plate: policy?.vehicle_plate || "",
          vehicle_brand: policy?.vehicle_brand || "",
          vehicle_model: policy?.vehicle_model || "",
          observations: policy?.observations || "",
        };
      } else {
        showToast({ type: "error", message: "Error loading policy" });
        onClose();
      }
    } catch (err) {
      showToast({ type: "error", message: "Error loading policy" });
      onClose();
    } finally {
      loading = false;
    }
  }

  // Save policy changes
  async function handleSave() {
    if (!policyId) return;

    saving = true;
    errors = {};

    try {
      const response = await fetch(`/api/policies/${policyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({ type: "success", message: "Policy updated successfully" });
        isEditMode = false;
        await loadPolicy(); // Reload to show updated data
        // Close and notify parent that changes were saved
        onClose(true);
      } else {
        if (result.errors) {
          errors = result.errors;
        }
        showToast({
          type: "error",
          message: result.message || "Error updating policy",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error updating policy" });
    } finally {
      saving = false;
    }
  }

  // Toggle edit mode
  function toggleEdit() {
    isEditMode = !isEditMode;
    if (!isEditMode && policy) {
      // Reset form data when canceling edit
      formData = {
        policy_number: policy.policy_number || "",
        policy_type: policy.policy_type || "auto",
        insurer: policy.insurer || "",
        payment_mode: policy.payment_mode || "monthly",
        start_date: policy.start_date || "",
        expiry_date: policy.expiry_date || "",
        vehicle_plate: policy.vehicle_plate || "",
        vehicle_brand: policy.vehicle_brand || "",
        vehicle_model: policy.vehicle_model || "",
        observations: policy.observations || "",
      };
      errors = {};
    }
  }

  // Format date for display
  function formatDate(dateStr: string | null) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("es-ES");
  }

  // Policy type labels
  const policyTypeLabels: Record<PolicyType, string> = {
    auto: "Auto",
    home: "Hogar",
    life: "Vida",
    health: "Salud",
    business: "Empresa",
    other: "Otro",
  };

  // Payment mode labels
  const paymentModeLabels: Record<PaymentMode, string> = {
    monthly: "Mensual",
    quarterly: "Trimestral",
    "semi-annual": "Semestral",
    annual: "Anual",
  };
</script>

{#if policyId}
  <!-- Backdrop -->
  <div class="backdrop" onclick={() => onClose()}></div>

  <!-- Modal Panel -->
  <div class="modal-panel">
    <!-- Header -->
    <div class="modal-header">
      <div class="header-content">
        {#if $page.url.searchParams.get("from") === "client"}
          <button
            class="back-btn"
            onclick={() => {
              const clientId = $page.url.searchParams.get("fromId");
              if (clientId) {
                onClose();
                goto(`/clientes?clientId=${clientId}&mode=view`);
              }
            }}
            title="Volver a cliente"
          >
            <ArrowLeft size={20} />
          </button>
        {/if}
        <div class="icon-wrapper">
          <FileText size={24} />
        </div>
        <div>
          <h2>
            {#if loading}
              Cargando...
            {:else if policy}
              {policy.policy_number || "Sin número"}
            {/if}
          </h2>
          {#if policy && !loading}
            <p class="subtitle">{policyTypeLabels[policy.policy_type]}</p>
          {/if}
        </div>
      </div>

      <div class="header-actions">
        {#if !isEditMode && !loading}
          <button class="icon-btn" onclick={toggleEdit} title="Edit policy">
            <Edit2 size={18} />
          </button>
        {/if}
        <button class="icon-btn" onclick={() => onClose()} title="Close">
          <X size={20} />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="modal-content">
      {#if loading}
        <div class="loading-state">
          <p>Cargando detalles de póliza...</p>
        </div>
      {:else if policy}
        <form
          onsubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <!-- Policy Information -->
          <section class="form-section">
            <h3>Información de la Póliza</h3>

            <div class="form-row">
              <div class="form-field">
                <label for="policy_number">Número de Póliza</label>
                <Input
                  id="policy_number"
                  bind:value={formData.policy_number}
                  error={errors.policy_number}
                  disabled={!isEditMode}
                />
              </div>

              <div class="form-field">
                <label for="policy_type">Tipo de Póliza</label>
                <select
                  id="policy_type"
                  bind:value={formData.policy_type}
                  disabled={!isEditMode}
                >
                  <option value="auto">Auto</option>
                  <option value="home">Hogar</option>
                  <option value="life">Vida</option>
                  <option value="health">Salud</option>
                  <option value="business">Empresa</option>
                  <option value="other">Otro</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="insurer">Aseguradora</label>
                <Input
                  id="insurer"
                  bind:value={formData.insurer}
                  error={errors.insurer}
                  disabled={!isEditMode}
                />
              </div>

              <div class="form-field">
                <label for="payment_mode">Forma de Pago</label>
                <select
                  id="payment_mode"
                  bind:value={formData.payment_mode}
                  disabled={!isEditMode}
                >
                  <option value="monthly">Mensual</option>
                  <option value="quarterly">Trimestral</option>
                  <option value="semi-annual">Semestral</option>
                  <option value="annual">Anual</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="start_date">Fecha de Inicio</label>
                <Input
                  id="start_date"
                  type="date"
                  bind:value={formData.start_date}
                  error={errors.start_date}
                  disabled={!isEditMode}
                />
              </div>

              <div class="form-field">
                <label for="expiry_date">Fecha de Vencimiento</label>
                <Input
                  id="expiry_date"
                  type="date"
                  bind:value={formData.expiry_date}
                  error={errors.expiry_date}
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </section>

          <!-- Vehicle Information (only for auto policies) -->
          {#if policy.policy_type === "auto" || isEditMode}
            <section class="form-section">
              <h3>Información del Vehículo</h3>

              <div class="form-field">
                <label for="vehicle_plate">Patente</label>
                <Input
                  id="vehicle_plate"
                  bind:value={formData.vehicle_plate}
                  error={errors.vehicle_plate}
                  disabled={!isEditMode}
                />
              </div>

              <div class="form-row">
                <div class="form-field">
                  <label for="vehicle_brand">Marca</label>
                  <Input
                    id="vehicle_brand"
                    bind:value={formData.vehicle_brand}
                    error={errors.vehicle_brand}
                    disabled={!isEditMode}
                  />
                </div>

                <div class="form-field">
                  <label for="vehicle_model">Modelo</label>
                  <Input
                    id="vehicle_model"
                    bind:value={formData.vehicle_model}
                    error={errors.vehicle_model}
                    disabled={!isEditMode}
                  />
                </div>
              </div>
            </section>
          {/if}

          <!-- Client Information -->
          <!-- Only show client info if NOT coming from back navigation -->
          {#if !isEditMode && policy.client && !$page.url.searchParams.get("from")}
            <section class="form-section">
              <h3>Cliente</h3>
              <div class="client-card">
                <div class="client-icon">
                  <User size={20} />
                </div>
                <div class="client-info">
                  <div class="client-name">
                    {policy.client_full_name || "Sin nombre"}
                  </div>
                  <button
                    type="button"
                    class="link-btn"
                    onclick={() =>
                      policy && goto(`/clientes?clientId=${policy.client_id}`)}
                  >
                    Ver cliente →
                  </button>
                </div>
              </div>
            </section>
          {/if}

          <!-- Observations -->
          <section class="form-section">
            <h3>Observaciones</h3>

            <div class="form-field">
              {#if isEditMode}
                <textarea
                  id="observations"
                  bind:value={formData.observations}
                  rows="4"
                  placeholder="Observaciones adicionales..."
                ></textarea>
              {:else}
                <p class="field-value preserve-whitespace">
                  {policy.observations || "Sin observaciones"}
                </p>
              {/if}
            </div>
          </section>
        </form>
      {/if}
    </div>

    <!-- Footer (only in edit mode) -->
    {#if isEditMode && !loading}
      <div class="modal-footer">
        <Button variant="ghost" onclick={toggleEdit} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" onclick={handleSave} disabled={saving}>
          {#if saving}
            Guardando...
          {:else}
            <Save size={18} />
            Guardar Cambios
          {/if}
        </Button>
      </div>
    {/if}
  </div>
{/if}

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  /* Backdrop */
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
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

  /* Modal Panel - slides in from right */
  .modal-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 600px;
    background: var(--bg-primary);
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
    z-index: 101;
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
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5);
    border-bottom: 1px solid var(--border-primary);
    gap: var(--space-4);

    .header-content {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      flex: 1;
      min-width: 0;

      .back-btn {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        background: transparent;
        color: var(--text-secondary);
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: all var(--transition-fast);
        flex-shrink: 0;

        &:hover {
          background: var(--bg-secondary);
          color: var(--primary-600);
        }
      }

      .icon-wrapper {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-100);
        color: var(--primary-600);
        border-radius: var(--radius-full);
        flex: unset;
      }

      div {
        flex: 1;
        min-width: 0;
      }

      h2 {
        font-size: var(--text-xl);
        font-weight: var(--font-semibold);
        color: var(--text-primary);
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .subtitle {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        margin: var(--space-1) 0 0;
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .icon-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }
    }
  }

  /* Content - scrollable */
  .modal-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-5);
  }

  .loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-8);
    color: var(--text-secondary);
  }

  /* Form sections */
  .form-section {
    margin-bottom: var(--space-6);

    &:last-child {
      margin-bottom: 0;
    }

    h3 {
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4) 0;
      padding-bottom: var(--space-2);
      border-bottom: 1px solid var(--border-primary);
    }
  }

  .form-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
  }

  .form-field {
    margin-bottom: var(--space-4);

    label {
      display: block;
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);
      margin-bottom: var(--space-2);
    }

    .field-value {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0;
      padding: var(--space-2) 0;

      &.preserve-whitespace {
        white-space: pre-wrap;
      }
    }

    select {
      width: 100%;
      padding: var(--space-2) var(--space-3);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      background: var(--bg-primary);
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--primary-500);
      }

      &:disabled {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        cursor: not-allowed;
        opacity: 0.7;
      }
    }

    textarea {
      width: 100%;
      padding: var(--space-3);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      font-family: inherit;
      font-size: var(--text-sm);
      color: var(--text-primary);
      background: var(--bg-primary);
      resize: vertical;
      transition: border-color var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--primary-500);
      }
    }
  }

  /* Client card */
  .client-card {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    background: var(--bg-secondary);
    border-radius: var(--radius-md);

    .client-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-100);
      color: var(--primary-600);
      border-radius: var(--radius-full);
      flex-shrink: 0;
    }

    .client-info {
      flex: 1;
      min-width: 0;
    }

    .client-name {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);
      margin-bottom: var(--space-1);
    }

    .link-btn {
      padding: 0;
      border: none;
      background: transparent;
      color: var(--primary-600);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      cursor: pointer;
      transition: color var(--transition-fast);

      &:hover {
        color: var(--primary-700);
        text-decoration: underline;
      }
    }
  }

  /* Footer */
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: var(--space-4);
    border-top: 1px solid var(--border-primary);
    gap: var(--space-3);
  }
</style>

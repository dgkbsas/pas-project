<script lang="ts">
  /**
   * Client Modal Component
   * Slide-in modal from right for viewing/editing client details
   * Maintains URL for analytics while providing modal UX
   */
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import PhoneInputArgentina from "$lib/components/form/PhoneInputArgentina.svelte";
  import { showToast } from "$lib/stores/notifications";
  import {
    X,
    Save,
    Edit2,
    User,
    FileText,
    Plus,
    ArrowLeft,
    MessageCircle,
  } from "lucide-svelte";
  import type { ClientWithPolicies } from "$lib/types";
  import { isMobileNumber, getWhatsAppUrl } from "$lib/utils/phone";

  // Props
  interface Props {
    clientId: string | null;
    mode: "view" | "edit";
    onClose: (saved?: boolean) => void;
  }

  let { clientId, mode = "view", onClose }: Props = $props();

  // State
  let client = $state<ClientWithPolicies | null>(null);
  let loading = $state(false);
  let saving = $state(false);
  let isEditMode = $state(mode === "edit");

  // Form data
  let formData = $state({
    first_name: "",
    last_name: "",
    document_number: "",
    birth_date: "",
    email_primary: "",
    email_secondary: "",
    phone: "",
    phone_landline: "",
    address: "",
    street: "",
    street_number: "",
    floor: "",
    apartment: "",
    postal_code: "",
    city: "",
    province: "",
    alias_pas: "",
    referred_by: "",
    observations: "",
  });

  let errors = $state<Record<string, string>>({});

  // Reset edit mode when clientId changes or modal reopens
  $effect(() => {
    if (clientId) {
      isEditMode = mode === "edit";
      loadClient();
    }
  });

  // Load client details from API
  async function loadClient() {
    if (!clientId) return;

    loading = true;
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      const result = await response.json();

      if (response.ok) {
        client = result.client;

        // Populate form data
        formData = {
          first_name: client?.first_name || "",
          last_name: client?.last_name || "",
          document_number: client?.document_number || "",
          birth_date: client?.birth_date || "",
          email_primary: client?.email_primary || "",
          email_secondary: client?.email_secondary || "",
          phone: client?.phone || "",
          phone_landline: client?.phone_landline || "",
          address: client?.address || "",
          street: client?.street || "",
          street_number: client?.street_number || "",
          floor: client?.floor || "",
          apartment: client?.apartment || "",
          postal_code: client?.postal_code || "",
          city: client?.city || "",
          province: client?.province || "",
          alias_pas: client?.alias_pas || "",
          referred_by: client?.referred_by || "",
          observations: client?.observations || "",
        };
      } else {
        showToast({ type: "error", message: "Error loading client" });
        onClose();
      }
    } catch (err) {
      showToast({ type: "error", message: "Error loading client" });
      onClose();
    } finally {
      loading = false;
    }
  }

  // Save client changes
  async function handleSave() {
    if (!clientId) return;

    saving = true;
    errors = {};

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({ type: "success", message: "Client updated successfully" });
        isEditMode = false;
        await loadClient(); // Reload to show updated data
        // Close and notify parent that changes were saved
        onClose(true);
      } else {
        if (result.errors) {
          errors = result.errors;
        }
        showToast({
          type: "error",
          message: result.message || "Error updating client",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error updating client" });
    } finally {
      saving = false;
    }
  }

  // Toggle edit mode
  function toggleEdit() {
    isEditMode = !isEditMode;
    if (!isEditMode && client) {
      // Reset form data when canceling edit
      formData = {
        first_name: client.first_name || "",
        last_name: client.last_name || "",
        document_number: client.document_number || "",
        birth_date: client.birth_date || "",
        email_primary: client.email_primary || "",
        email_secondary: client.email_secondary || "",
        phone: client.phone || "",
        phone_landline: client.phone_landline || "",
        address: client.address || "",
        street: client.street || "",
        street_number: client.street_number || "",
        floor: client.floor || "",
        apartment: client.apartment || "",
        postal_code: client.postal_code || "",
        city: client.city || "",
        province: client.province || "",
        alias_pas: client.alias_pas || "",
        referred_by: client.referred_by || "",
        observations: client.observations || "",
      };
      errors = {};
    }
  }

  // Format date for display
  function formatDate(dateStr: string | null) {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("es-ES");
  }
</script>

{#if clientId}
  <!-- Backdrop -->
  <div class="backdrop" onclick={() => onClose()}></div>

  <!-- Modal Panel -->
  <div class="modal-panel">
    <!-- Header -->
    <div class="modal-header">
      <div class="header-content">
        {#if $page.url.searchParams.get("from") === "policy"}
          <button
            class="back-btn"
            onclick={() => {
              const policyId = $page.url.searchParams.get("fromId");
              if (policyId) {
                onClose();
                goto(`/polizas?policyId=${policyId}&mode=view`);
              }
            }}
            title="Volver a póliza"
          >
            <ArrowLeft size={20} />
          </button>
        {/if}
        <div class="icon-wrapper">
          <User size={24} />
        </div>
        <div>
          <h2>
            {#if loading}
              Cargando...
            {:else if client}
              {client.first_name} {client.last_name}
            {/if}
          </h2>
          {#if client && !loading}
            <p class="subtitle">{client.email_primary || "No email"}</p>
          {/if}
        </div>
      </div>

      <div class="header-actions">
        {#if !isEditMode && !loading}
          <button class="icon-btn" onclick={toggleEdit} title="Edit client">
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
          <p>Cargando datos del cliente...</p>
        </div>
      {:else if client}
        <form
          onsubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <!-- Personal Information -->
          <section class="form-section">
            <h3>Información Personal</h3>

            <div class="form-row">
              <div class="form-field">
                <label for="first_name">Nombre *</label>
                <Input
                  id="first_name"
                  bind:value={formData.first_name}
                  error={errors.first_name}
                  required
                  disabled={!isEditMode}
                />
              </div>

              <div class="form-field">
                <label for="last_name">Apellido *</label>
                <Input
                  id="last_name"
                  bind:value={formData.last_name}
                  error={errors.last_name}
                  required
                  disabled={!isEditMode}
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="document_number">DNI/CUIT</label>
                <Input
                  id="document_number"
                  bind:value={formData.document_number}
                  error={errors.document_number}
                  disabled={!isEditMode}
                />
              </div>

              <div class="form-field">
                <label for="birth_date">Fecha de Nacimiento</label>
                <Input
                  id="birth_date"
                  type="date"
                  bind:value={formData.birth_date}
                  error={errors.birth_date}
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </section>

          <!-- Contact Information -->
          <section class="form-section">
            <h3>Información de Contacto</h3>

            <div class="form-field">
              <label for="email_primary">Email Principal</label>
              <Input
                id="email_primary"
                type="email"
                bind:value={formData.email_primary}
                error={errors.email_primary}
                disabled={!isEditMode}
              />
            </div>

            <div class="form-field">
              <label for="email_secondary">Email Secundario</label>
              <Input
                id="email_secondary"
                type="email"
                bind:value={formData.email_secondary}
                error={errors.email_secondary}
                disabled={!isEditMode}
              />
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="phone">Celular</label>
                <div class="phone-input-wrapper">
                  <PhoneInputArgentina
                    bind:value={formData.phone}
                    error={errors.phone}
                    disabled={!isEditMode}
                  />
                  {#if !isEditMode && client.phone && isMobileNumber(client.phone)}
                    <a
                      href={getWhatsAppUrl(client.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="whatsapp-btn"
                      title="Abrir en WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </a>
                  {/if}
                </div>
              </div>

              <div class="form-field">
                <label for="phone_landline">Teléfono</label>
                <Input
                  id="phone_landline"
                  type="tel"
                  bind:value={formData.phone_landline}
                  error={errors.phone_landline}
                  disabled={!isEditMode}
                />
              </div>
            </div>
          </section>

          <!-- Address -->
          <section class="form-section">
            <h3>Dirección</h3>

            <div class="form-row">
              <div class="form-field">
                <label for="street">Calle</label>
                <Input
                  id="street"
                  bind:value={formData.street}
                  error={errors.street}
                  disabled={!isEditMode}
                  placeholder="Nombre de la calle"
                />
              </div>

              <div class="form-field">
                <label for="street_number">Número</label>
                <Input
                  id="street_number"
                  bind:value={formData.street_number}
                  error={errors.street_number}
                  disabled={!isEditMode}
                  placeholder="1234"
                />
              </div>

              <div class="form-field">
                <label for="floor">Piso</label>
                <Input
                  id="floor"
                  bind:value={formData.floor}
                  error={errors.floor}
                  disabled={!isEditMode}
                  placeholder="5"
                />
              </div>

              <div class="form-field">
                <label for="apartment">Depto</label>
                <Input
                  id="apartment"
                  bind:value={formData.apartment}
                  error={errors.apartment}
                  disabled={!isEditMode}
                  placeholder="A"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-field">
                <label for="city">Ciudad</label>
                <Input
                  id="city"
                  bind:value={formData.city}
                  error={errors.city}
                  disabled={!isEditMode}
                  placeholder="Ciudad"
                />
              </div>

              <div class="form-field">
                <label for="province">Provincia</label>
                <Input
                  id="province"
                  bind:value={formData.province}
                  error={errors.province}
                  disabled={!isEditMode}
                  placeholder="Provincia"
                />
              </div>

              <div class="form-field">
                <label for="postal_code">Código Postal</label>
                <Input
                  id="postal_code"
                  bind:value={formData.postal_code}
                  error={errors.postal_code}
                  disabled={!isEditMode}
                  placeholder="1234"
                />
              </div>
            </div>
          </section>

          <!-- Additional Information -->
          <section class="form-section">
            <h3>Información Adicional</h3>

            <div class="form-field">
              <label for="alias_pas">Alias PAS</label>
              <Input
                id="alias_pas"
                bind:value={formData.alias_pas}
                error={errors.alias_pas}
                disabled={!isEditMode}
              />
            </div>

            <div class="form-field">
              <label for="referred_by">Referido Por</label>
              <Input
                id="referred_by"
                bind:value={formData.referred_by}
                error={errors.referred_by}
                disabled={!isEditMode}
              />
            </div>

            <div class="form-field">
              <label for="observations">Observaciones</label>
              {#if isEditMode}
                <textarea
                  id="observations"
                  bind:value={formData.observations}
                  rows="4"
                  placeholder="Additional notes..."
                ></textarea>
              {:else}
                <p class="field-value preserve-whitespace">
                  {client.observations || "Sin observaciones"}
                </p>
              {/if}
            </div>
          </section>

          <!-- Policies Section -->
          <!-- Only show policies if NOT coming from back navigation -->
          {#if !isEditMode && !$page.url.searchParams.get("from")}
            <section class="form-section policies-section">
              <div class="section-header-row">
                <h3>
                  <FileText size={20} />
                  Pólizas ({client.policies?.length || 0})
                </h3>
                <button
                  type="button"
                  class="add-policy-btn"
                  onclick={() => {
                    onClose();
                    goto(`/polizas/nuevo?client_id=${client!.id}`);
                  }}
                >
                  <Plus size={16} />
                  Nueva Póliza
                </button>
              </div>

              {#if client.policies && client.policies.length > 0}
                <div class="policies-list">
                  {#each client.policies as policy}
                    <button
                      type="button"
                      class="policy-card"
                      onclick={() => {
                        onClose();
                        goto(
                          `/polizas?policyId=${policy.id}&mode=view&from=client&fromId=${client!.id}`
                        );
                      }}
                    >
                      <div class="policy-info">
                        <div class="policy-header">
                          <strong class="policy-number"
                            >{policy.policy_number || "S/N"}</strong
                          >
                          <span
                            class="policy-status"
                            class:active={policy.active}
                            class:inactive={!policy.active}
                          >
                            {policy.active ? "Activa" : "Inactiva"}
                          </span>
                        </div>
                        <div class="policy-meta">
                          <span class="policy-type">{policy.policy_type}</span>
                          {#if policy.insurer}
                            <span class="policy-separator">•</span>
                            <span class="policy-insurer">{policy.insurer}</span>
                          {/if}
                        </div>
                        {#if policy.expiry_date}
                          <div class="policy-date">
                            Vence: {formatDate(policy.expiry_date)}
                          </div>
                        {/if}
                      </div>
                      <div class="policy-arrow">→</div>
                    </button>
                  {/each}
                </div>
              {:else}
                <div class="no-policies">
                  <FileText size={32} />
                  <p>Este cliente no tiene pólizas registradas</p>
                  <button
                    type="button"
                    class="create-first-btn"
                    onclick={() => {
                      onClose();
                      goto(`/polizas/nuevo?client_id=${client!.id}`);
                    }}
                  >
                    <Plus size={16} />
                    Crear primera póliza
                  </button>
                </div>
              {/if}
            </section>
          {/if}
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
        flex-shrink: 0;
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

    .phone-with-whatsapp {
      display: flex;
      align-items: center;
      gap: var(--space-2);

      .field-value {
        padding: 0;
      }
    }

    .phone-input-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      position: relative;

      :global(.input-wrapper) {
        flex: 1;
      }
    }

    .whatsapp-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-1);
      background: #25d366;
      color: white;
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);
      text-decoration: none;
      flex-shrink: 0;

      &:hover {
        background: #20ba5a;
        transform: scale(1.1);
      }

      &:active {
        transform: scale(0.95);
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

  /* Policies Section */
  .policies-section {
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
  }

  .section-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-4);

    h3 {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      margin: 0;
      color: var(--text-primary);
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
    }
  }

  .add-policy-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--primary-600);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
    }
  }

  .policies-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .policy-card {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-4);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      border-color: var(--primary-300);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateX(4px);
    }
  }

  .policy-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .policy-header {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .policy-number {
    color: var(--primary-600);
    font-size: var(--text-base);
    font-weight: var(--font-semibold);
  }

  .policy-status {
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);

    &.active {
      background: var(--success-100);
      color: var(--success-700);
    }

    &.inactive {
      background: var(--error-100);
      color: var(--error-700);
    }
  }

  .policy-meta {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .policy-type {
    font-weight: var(--font-medium);
  }

  .policy-separator {
    color: var(--text-tertiary);
  }

  .policy-date {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .policy-arrow {
    color: var(--text-tertiary);
    font-size: var(--text-xl);
    transition: transform var(--transition-fast);

    .policy-card:hover & {
      transform: translateX(4px);
      color: var(--primary-600);
    }
  }

  .no-policies {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-8) var(--space-4);
    text-align: center;

    :global(svg) {
      color: var(--text-tertiary);
      opacity: 0.5;
    }

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }
  }

  .create-first-btn {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--primary-600);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
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

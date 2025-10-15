<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import SearchableClientSelect from "$lib/components/form/SearchableClientSelect.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import { showToast } from "$lib/stores/notifications";
  import { Save } from "lucide-svelte";

  interface Props {
    mode?: "create" | "edit";
    initialData?: Partial<FormData>;
    loading?: boolean;
    errors?: FormErrors;
    onSubmit: (data: FormData) => void;
    onCancel: () => void;
  }

  type FormData = {
    client_id: string;
    policy_number: string;
    policy_type: string;
    insurer_id: string;
    payment_mode: string;
    start_date: string;
    expiry_date: string;
    review_date: string;
    vehicle_plate: string;
    insured_sum: number | null | string;
    accessories: string;
    premium: number | null | string;
    endorsement: string;
    observations: string;
  };

  type FormErrors = Partial<Record<keyof FormData, string>>;

  let {
    mode = "create",
    initialData = {},
    loading = false,
    errors = {},
    onSubmit,
    onCancel,
  }: Props = $props();

  let loadingInsurers = $state(false);
  let insurers = $state<any[]>([]);

  let formData = $state<FormData>({
    client_id: initialData.client_id || "",
    policy_number: initialData.policy_number || "",
    policy_type: initialData.policy_type || "",
    insurer_id: initialData.insurer_id || "",
    payment_mode: initialData.payment_mode || "",
    start_date: initialData.start_date || "",
    expiry_date: initialData.expiry_date || "",
    review_date: initialData.review_date || "",
    vehicle_plate: initialData.vehicle_plate || "",
    insured_sum: initialData.insured_sum || "",
    accessories: initialData.accessories || "",
    premium: initialData.premium || "",
    endorsement: initialData.endorsement || "",
    observations: initialData.observations || "",
  });

  const policyTypeOptions = [
    { value: "auto", label: "Auto" },
    { value: "home", label: "Hogar" },
    { value: "life", label: "Vida" },
    { value: "health", label: "Salud" },
    { value: "business", label: "Negocio" },
    { value: "other", label: "Otro" },
  ];

  const paymentModeOptions = [
    { value: "monthly", label: "Mensual" },
    { value: "quarterly", label: "Trimestral" },
    { value: "biannual", label: "Semestral" },
    { value: "annual", label: "Anual" },
  ];

  onMount(async () => {
    await loadInsurers();
  });

  async function loadInsurers() {
    loadingInsurers = true;
    try {
      const response = await fetch('/api/insurance-companies');
      const result = await response.json();
      if (response.ok) {
        insurers = result.companies || [];
      }
    } catch (err) {
      console.error('Error loading insurers:', err);
    } finally {
      loadingInsurers = false;
    }
  }

  function suggestReviewDate() {
    if (!formData.expiry_date) {
      showToast({ type: 'error', message: 'Primero ingresa la fecha de vencimiento' });
      return;
    }

    const expiryDate = new Date(formData.expiry_date);
    expiryDate.setDate(expiryDate.getDate() - 30);
    formData.review_date = expiryDate.toISOString().split('T')[0];
  }

  function handleSubmit(e: Event) {
    e.preventDefault();

    // Convert numeric strings to numbers or null, and empty strings to null
    const payload = {
      ...formData,
      insured_sum: formData.insured_sum ? parseFloat(String(formData.insured_sum)) : null,
      premium: formData.premium ? parseFloat(String(formData.premium)) : null,
      insurer_id: formData.insurer_id || null,
      review_date: formData.review_date || null,
      accessories: formData.accessories || null,
      endorsement: formData.endorsement || null,
      observations: formData.observations || null,
      payment_mode: formData.payment_mode || null,
      vehicle_plate: formData.vehicle_plate || null,
    };

    onSubmit(payload as any);
  }
</script>

<form onsubmit={handleSubmit}>
  <Card>
    <div class="card-header">
      <h2>Información General</h2>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="client_id">Cliente <span class="required">*</span></label>
        <SearchableClientSelect
          bind:value={formData.client_id}
          placeholder="Buscar cliente por nombre, email o documento..."
          error={errors.client_id}
          required
        />
      </div>

      <div class="form-group">
        <label for="policy_number">Número de Póliza <span class="required">*</span></label>
        <Input
          id="policy_number"
          bind:value={formData.policy_number}
          placeholder="POL-2024-001"
          error={errors.policy_number}
          required
        />
      </div>

      <div class="form-group">
        <label for="policy_type">Tipo de Seguro <span class="required">*</span></label>
        <Select
          id="policy_type"
          options={policyTypeOptions}
          bind:value={formData.policy_type}
          placeholder="Selecciona un tipo"
          error={errors.policy_type}
          required
        />
      </div>

      <div class="form-group">
        <label for="payment_mode">Modalidad de Pago</label>
        <Select
          id="payment_mode"
          options={paymentModeOptions}
          bind:value={formData.payment_mode}
          placeholder="Selecciona modalidad"
          error={errors.payment_mode}
        />
      </div>

      <div class="form-group">
        <label for="insurer_id">Compañía Aseguradora</label>
        {#if loadingInsurers}
          <Input disabled placeholder="Cargando aseguradoras..." />
        {:else if insurers.length === 0}
          <Input disabled placeholder="Sin compañías creadas" />
          <small class="help-text">
            Crea aseguradoras en Configuración → Aseguradoras
          </small>
        {:else}
          <Select
            id="insurer_id"
            options={insurers.map(i => ({ value: i.id, label: i.name }))}
            bind:value={formData.insurer_id}
            placeholder="Selecciona aseguradora"
            error={errors.insurer_id}
          />
        {/if}
      </div>

      <div class="form-group">
        <label for="vehicle_plate">Matrícula (si aplica)</label>
        <Input
          id="vehicle_plate"
          bind:value={formData.vehicle_plate}
          placeholder="ABC1234"
          error={errors.vehicle_plate}
        />
      </div>
    </div>
  </Card>

  <Card>
    <div class="card-header">
      <h2>Información Financiera</h2>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="insured_sum">Suma Asegurada (ARS)</label>
        <Input
          id="insured_sum"
          type="number"
          step="0.01"
          bind:value={formData.insured_sum}
          placeholder="0.00"
          error={errors.insured_sum}
        />
      </div>

      <div class="form-group">
        <label for="premium">Premio (ARS)</label>
        <Input
          id="premium"
          type="number"
          step="0.01"
          bind:value={formData.premium}
          placeholder="0.00"
          error={errors.premium}
        />
      </div>

      <div class="form-group full-width">
        <label for="accessories">Accesorios</label>
        <textarea
          id="accessories"
          bind:value={formData.accessories}
          placeholder="Descripción de accesorios incluidos..."
          rows="2"
          maxlength="2000"
        ></textarea>
        <small class="help-text">
          {formData.accessories?.length || 0}/2000 caracteres
        </small>
      </div>

      <div class="form-group full-width">
        <label for="endorsement">Endoso</label>
        <textarea
          id="endorsement"
          bind:value={formData.endorsement}
          placeholder="Detalles del endoso..."
          rows="2"
          maxlength="2000"
        ></textarea>
        <small class="help-text">
          {formData.endorsement?.length || 0}/2000 caracteres
        </small>
      </div>
    </div>
  </Card>

  <Card>
    <div class="card-header">
      <h2>Fechas</h2>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="start_date">Fecha de Inicio <span class="required">*</span></label>
        <Input
          id="start_date"
          type="date"
          bind:value={formData.start_date}
          error={errors.start_date}
          required
        />
      </div>

      <div class="form-group">
        <label for="expiry_date">Fecha de Vencimiento <span class="required">*</span></label>
        <Input
          id="expiry_date"
          type="date"
          bind:value={formData.expiry_date}
          error={errors.expiry_date}
          required
        />
      </div>

      <div class="form-group">
        <label for="review_date">Fecha de Revisión</label>
        <div style="display: flex; gap: 8px;">
          <Input
            id="review_date"
            type="date"
            bind:value={formData.review_date}
            error={errors.review_date}
            style="flex: 1;"
          />
          <Button
            type="button"
            variant="outline"
            onclick={suggestReviewDate}
            disabled={!formData.expiry_date}
          >
            Sugerir (30 días antes)
          </Button>
        </div>
        <small class="help-text">
          Fecha sugerida para revisar la póliza antes del vencimiento
        </small>
      </div>
    </div>
  </Card>

  <Card>
    <div class="card-header">
      <h2>Observaciones</h2>
    </div>

    <div class="form-group">
      <label for="observations">Observaciones</label>
      <textarea
        id="observations"
        bind:value={formData.observations}
        placeholder="Información adicional sobre la póliza..."
        rows="4"
        maxlength="1000"
      ></textarea>
      <small class="help-text">
        {formData.observations?.length || 0}/1000 caracteres
      </small>
    </div>
  </Card>

  {#if mode === "create"}
    <Card>
      <div class="card-header">
        <h2>Seguimientos</h2>
      </div>

      <div class="info-message">
        <p>ℹ️ Los seguimientos se pueden agregar después de crear la póliza</p>
      </div>
    </Card>
  {/if}

  <div class="form-actions">
    <Button
      type="button"
      variant="outline"
      onclick={onCancel}
      disabled={loading}
    >
      Cancelar
    </Button>
    <Button type="submit" variant="primary" disabled={loading}>
      <Save size={18} />
      {loading ? "Guardando..." : mode === "create" ? "Guardar Póliza" : "Guardar Cambios"}
    </Button>
  </div>
</form>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  form {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .card-header {
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-primary);

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0;
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    &.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);

      .required {
        color: var(--error-600);
      }
    }

    textarea {
      padding: var(--space-3);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      font-size: var(--text-sm);
      font-family: inherit;
      background: var(--bg-primary);
      color: var(--text-primary);
      resize: vertical;
      transition: all var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
      }

      &::placeholder {
        color: var(--text-tertiary);
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
    padding-top: var(--space-4);
  }

  .info-message {
    padding: var(--space-4);
    background: var(--primary-50);
    border: 1px solid var(--primary-200);
    border-radius: var(--radius-md);

    p {
      margin: 0;
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }
  }

  .help-text {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    margin-top: var(--space-1);
    display: block;
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column-reverse;

      :global(button) {
        width: 100%;
      }
    }
  }
</style>

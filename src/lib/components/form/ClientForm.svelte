<script lang="ts">
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import AddressAutocompleteNominatim from "$lib/components/form/AddressAutocompleteNominatim.svelte";
  import PhoneInputArgentina from "$lib/components/form/PhoneInputArgentina.svelte";
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
    first_name: string;
    last_name: string;
    document_number: string;
    birth_date: string;
    email_primary: string;
    email_secondary: string;
    phone: string;
    phone_landline: string;
    address: string;
    street: string;
    street_number: string;
    floor: string;
    apartment: string;
    city: string;
    province: string;
    postal_code: string;
    alias_pas: string;
    referred_by: string;
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

  let formData = $state<FormData>({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    document_number: initialData.document_number || "",
    birth_date: initialData.birth_date || "",
    email_primary: initialData.email_primary || "",
    email_secondary: initialData.email_secondary || "",
    phone: initialData.phone || "",
    phone_landline: initialData.phone_landline || "",
    address: initialData.address || "",
    street: initialData.street || "",
    street_number: initialData.street_number || "",
    floor: initialData.floor || "",
    apartment: initialData.apartment || "",
    city: initialData.city || "",
    province: initialData.province || "",
    postal_code: initialData.postal_code || "",
    alias_pas: initialData.alias_pas || "",
    referred_by: initialData.referred_by || "",
    observations: initialData.observations || "",
  });

  // Handler para cuando se selecciona una dirección del autocompletado
  function handleAddressSelect(address: any) {
    // Construir la dirección completa
    const parts = [
      address.street,
      address.streetNumber,
      address.floor && `Piso ${address.floor}`,
      address.apartment && `Depto ${address.apartment}`,
    ].filter(Boolean);

    formData.address = parts.join(" ");
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    onSubmit(formData);
  }
</script>

<form onsubmit={handleSubmit}>
  <Card>
    <div class="card-header">
      <h2>Información Personal</h2>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="first_name">Nombre <span class="required">*</span></label>
        <Input
          id="first_name"
          bind:value={formData.first_name}
          placeholder="Ej: Juan"
          error={errors.first_name}
          required
        />
      </div>

      <div class="form-group">
        <label for="last_name">Apellido <span class="required">*</span></label>
        <Input
          id="last_name"
          bind:value={formData.last_name}
          placeholder="Ej: Pérez García"
          error={errors.last_name}
          required
        />
      </div>

      <div class="form-group">
        <label for="document_number">DNI/CUIT</label>
        <Input
          id="document_number"
          bind:value={formData.document_number}
          placeholder="12345678"
          error={errors.document_number}
        />
      </div>

      <div class="form-group">
        <label for="birth_date">Fecha de Nacimiento</label>
        <Input
          id="birth_date"
          type="date"
          bind:value={formData.birth_date}
          error={errors.birth_date}
        />
      </div>

      <div class="form-group">
        <label for="email_primary">Email Principal</label>
        <Input
          id="email_primary"
          type="email"
          bind:value={formData.email_primary}
          placeholder="ejemplo@email.com"
          error={errors.email_primary}
        />
      </div>

      <div class="form-group">
        <label for="email_secondary">Email Secundario</label>
        <Input
          id="email_secondary"
          type="email"
          bind:value={formData.email_secondary}
          placeholder="secundario@email.com"
          error={errors.email_secondary}
        />
      </div>

      <div class="form-group">
        <label for="phone">Celular (ARG)</label>
        <PhoneInputArgentina bind:value={formData.phone} error={errors.phone} />
      </div>

      <div class="form-group">
        <label for="phone_landline">Teléfono</label>
        <Input
          id="phone_landline"
          type="tel"
          bind:value={formData.phone_landline}
          placeholder="011 1234-5678"
          error={errors.phone_landline}
        />
      </div>
    </div>
  </Card>

  <Card>
    <div class="card-header">
      <h2>Dirección</h2>
      <p class="card-description">
        Usa el autocompletado para buscar la dirección
      </p>
    </div>

    <AddressAutocompleteNominatim
      bind:value={formData.address}
      bind:street={formData.street}
      bind:streetNumber={formData.street_number}
      bind:floor={formData.floor}
      bind:apartment={formData.apartment}
      bind:city={formData.city}
      bind:province={formData.province}
      bind:postalCode={formData.postal_code}
      placeholder="Buscar dirección en Argentina..."
      onAddressSelect={handleAddressSelect}
    />
  </Card>

  <Card>
    <div class="card-header">
      <h2>Información Adicional</h2>
    </div>

    <div class="form-grid">
      <div class="form-group">
        <label for="alias_pas">Alias PAS</label>
        <Input
          id="alias_pas"
          bind:value={formData.alias_pas}
          placeholder="Alias o apodo del cliente"
          error={errors.alias_pas}
        />
      </div>

      <div class="form-group">
        <label for="referred_by">Referido Por</label>
        <Input
          id="referred_by"
          bind:value={formData.referred_by}
          placeholder="¿Quién lo refirió?"
          error={errors.referred_by}
        />
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
        placeholder="Información adicional sobre el cliente..."
        rows="4"
      ></textarea>
    </div>
  </Card>

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
      {loading
        ? "Guardando..."
        : mode === "create"
          ? "Guardar Cliente"
          : "Guardar Cambios"}
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

    .card-description {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin-top: var(--space-2);
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-4);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

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

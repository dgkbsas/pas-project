<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import AddressAutocompleteNominatim from "$lib/components/form/AddressAutocompleteNominatim.svelte";
  import PhoneInputArgentina from "$lib/components/form/PhoneInputArgentina.svelte";
  import { showToast } from "$lib/stores/notifications";
  import { ArrowLeft, Save } from "lucide-svelte";

  type FormData = {
    first_name: string;
    last_name: string;
    document_number: string;
    email_primary: string;
    phone: string;
    address: string;
    street: string;
    street_number: string;
    floor: string;
    apartment: string;
    city: string;
    province: string;
    postal_code: string;
    observations: string;
  };

  type FormErrors = Partial<Record<keyof FormData, string>>;

  let loading = $state(false);
  let formData = $state<FormData>({
    first_name: "",
    last_name: "",
    document_number: "",
    email_primary: "",
    phone: "",
    address: "",
    street: "",
    street_number: "",
    floor: "",
    apartment: "",
    city: "",
    province: "",
    postal_code: "",
    observations: "",
  });

  let errors = $state<FormErrors>({});

  // Handler para cuando se selecciona una dirección del autocompletado
  function handleAddressSelect(address: any) {
    // Construir la dirección completa
    const parts = [
      address.street,
      address.streetNumber,
      address.floor && `Piso ${address.floor}`,
      address.apartment && `Depto ${address.apartment}`
    ].filter(Boolean);

    formData.address = parts.join(' ');
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    errors = {};

    try {
      // Preparar datos para enviar (solo campos que acepta la BD)
      const dataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        document_number: formData.document_number,
        email_primary: formData.email_primary,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postal_code,
        observations: formData.observations,
      };

      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({ type: "success", message: "Cliente creado exitosamente" });
        goto("/clientes");
      } else {
        if (result.errors) {
          errors = result.errors;
        }
        showToast({
          type: "error",
          message: result.message || "Error al crear cliente",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al crear cliente" });
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Nuevo Cliente - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <Button variant="ghost" size="sm" onclick={() => goto("/clientes")}>
        <ArrowLeft size={18} />
        Volver
      </Button>
      <h1>Nuevo Cliente</h1>
      <p>Completa los datos para registrar un nuevo cliente</p>
    </div>
  </div>

  <form onsubmit={handleSubmit}>
    <Card>
      <div class="card-header">
        <h2>Información Personal</h2>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label for="first_name"
            >Nombre <span class="required">*</span></label
          >
          <Input
            id="first_name"
            bind:value={formData.first_name}
            placeholder="Ej: Juan"
            error={errors.first_name}
            required
          />
        </div>

        <div class="form-group">
          <label for="last_name"
            >Apellido <span class="required">*</span></label
          >
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
          <label for="email_primary">Email</label>
          <Input
            id="email_primary"
            type="email"
            bind:value={formData.email_primary}
            placeholder="ejemplo@email.com"
            error={errors.email_primary}
          />
        </div>

        <div class="form-group">
          <label for="phone">Teléfono</label>
          <PhoneInputArgentina
            bind:value={formData.phone}
            error={errors.phone}
          />
        </div>
      </div>
    </Card>

    <Card>
      <div class="card-header">
        <h2>Dirección</h2>
        <p class="card-description">Usa el autocompletado para buscar la dirección</p>
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
        onclick={() => goto("/clientes")}
        disabled={loading}
      >
        Cancelar
      </Button>
      <Button type="submit" variant="primary" disabled={loading}>
        <Save size={18} />
        {loading ? "Guardando..." : "Guardar Cliente"}
      </Button>
    </div>
  </form>
</div>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  .page {
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: var(--space-6);

    h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin: var(--space-4) 0 var(--space-2);
    }

    p {
      color: var(--text-secondary);
      margin: 0;
    }
  }

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

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: var(--text-2xl);
    }

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

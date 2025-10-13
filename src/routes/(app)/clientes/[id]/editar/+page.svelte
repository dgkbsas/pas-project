<script lang="ts">
  import { goto } from "$app/navigation";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import { showToast } from "$lib/stores/notifications";
  import { ArrowLeft, Save } from "lucide-svelte";
  import type { Client } from "$lib/types/database.types";

  type FormData = {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postal_code: string;
    id_number: string;
    notes: string;
  };

  type FormErrors = Partial<Record<keyof FormData, string>>;

  type PageData = {
    client: Client;
  };

  let { data } = $props<{ data: PageData }>();

  let loading = $state(false);
  let formData = $state<FormData>({
    name: data.client.name || "",
    email: data.client.email || "",
    phone: data.client.phone || "",
    address: data.client.address || "",
    city: data.client.city || "",
    postal_code: data.client.postal_code || "",
    id_number: data.client.id_number || "",
    notes: data.client.notes || "",
  });

  let errors = $state<FormErrors>({});

  async function handleSubmit(e: Event) {
    e.preventDefault();
    loading = true;
    errors = {};

    try {
      const response = await fetch(`/api/clients/${data.client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({
          type: "success",
          message: "Cliente actualizado exitosamente",
        });
        goto("/clientes");
      } else {
        if (result.errors) {
          errors = result.errors;
        }
        showToast({
          type: "error",
          message: result.message || "Error al actualizar cliente",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al actualizar cliente" });
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Editar Cliente - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <Button variant="ghost" size="sm" onclick={() => goto("/clientes")}>
        <ArrowLeft size={18} />
        Volver
      </Button>
      <h1>Editar Cliente</h1>
      <p>Modifica los datos del cliente</p>
    </div>
  </div>

  <form onsubmit={handleSubmit}>
    <Card>
      <div class="card-header">
        <h2>Información Personal</h2>
      </div>

      <div class="form-grid">
        <div class="form-group full-width">
          <label for="name"
            >Nombre completo <span class="required">*</span></label
          >
          <Input
            id="name"
            bind:value={formData.name}
            placeholder="Ej: Juan Pérez García"
            error={errors.name}
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <Input
            id="email"
            type="email"
            bind:value={formData.email}
            placeholder="ejemplo@email.com"
            error={errors.email}
          />
        </div>

        <div class="form-group">
          <label for="phone">Teléfono</label>
          <Input
            id="phone"
            type="tel"
            bind:value={formData.phone}
            placeholder="+34 612 345 678"
            error={errors.phone}
          />
        </div>

        <div class="form-group">
          <label for="id_number">DNI/NIE</label>
          <Input
            id="id_number"
            bind:value={formData.id_number}
            placeholder="12345678X"
            error={errors.id_number}
          />
        </div>
      </div>
    </Card>

    <Card>
      <div class="card-header">
        <h2>Dirección</h2>
      </div>

      <div class="form-grid">
        <div class="form-group full-width">
          <label for="address">Dirección</label>
          <Input
            id="address"
            bind:value={formData.address}
            placeholder="Calle, número, piso..."
            error={errors.address}
          />
        </div>

        <div class="form-group">
          <label for="city">Ciudad</label>
          <Input
            id="city"
            bind:value={formData.city}
            placeholder="Madrid"
            error={errors.city}
          />
        </div>

        <div class="form-group">
          <label for="postal_code">Código Postal</label>
          <Input
            id="postal_code"
            bind:value={formData.postal_code}
            placeholder="28001"
            error={errors.postal_code}
          />
        </div>
      </div>
    </Card>

    <Card>
      <div class="card-header">
        <h2>Notas adicionales</h2>
      </div>

      <div class="form-group">
        <label for="notes">Notas</label>
        <textarea
          id="notes"
          bind:value={formData.notes}
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
        {loading ? "Guardando..." : "Guardar Cambios"}
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

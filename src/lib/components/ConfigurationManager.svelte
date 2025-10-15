<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import { showToast } from "$lib/stores/notifications";
  import {
    Plus,
    Trash,
    Edit2,
    Check,
    X,
    DollarSign,
    FileText,
    Calendar,
    Tag,
  } from "lucide-svelte";

  type ConfigItem = {
    value: string;
    label: string;
    active?: boolean; // Soft delete flag
  };

  type ConfigSection = {
    key: string;
    label: string;
    icon: any;
    description: string;
    items: ConfigItem[];
  };

  let loading = $state(false);
  let sections = $state<ConfigSection[]>([
    {
      key: "payment_modes",
      label: "Modos de Pago",
      icon: DollarSign,
      description: "Modalidades de pago disponibles para las pólizas",
      items: [],
    },
    {
      key: "policy_types",
      label: "Tipos de Póliza",
      icon: FileText,
      description: "Tipos de pólizas de seguro que se pueden crear",
      items: [],
    },
    {
      key: "followup_types",
      label: "Tipos de Seguimiento",
      icon: Calendar,
      description: "Categorías de seguimientos para las pólizas",
      items: [],
    },
  ]);

  let editingItem = $state<{ sectionKey: string; index: number } | null>(null);
  let newItemLabel = $state("");
  let editItemLabel = $state("");
  let activeSectionKey = $state<string | null>(null);
  let showInactive = $state(false);

  onMount(async () => {
    await loadAllConfigurations();
  });

  async function loadAllConfigurations() {
    loading = true;
    try {
      const response = await fetch("/api/config");
      const result = await response.json();

      if (response.ok && result.configs) {
        // Map configs to sections
        sections = sections.map((section) => {
          const config = result.configs.find(
            (c: any) => c.config_key === section.key
          );
          if (config) {
            // Handle both array format (old) and object format (new with active status)
            let items: ConfigItem[] = [];

            if (Array.isArray(config.config_value)) {
              // Old format - all items active by default
              items = config.config_value.map((label: string) => ({
                value: generateValue(label),
                label,
                active: true,
              }));
            } else if (
              typeof config.config_value === "object" &&
              config.config_value.items
            ) {
              // New format with active status
              items = config.config_value.items;
            }

            return {
              ...section,
              items,
            };
          }
          return section;
        });
      }
    } catch (err) {
      console.error("Error loading configurations:", err);
      showToast({ type: "error", message: "Error al cargar configuraciones" });
    } finally {
      loading = false;
    }
  }

  function generateValue(label: string): string {
    // Generate a slug-like value from the label
    return label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "_") // Replace non-alphanumeric with underscore
      .replace(/^_+|_+$/g, ""); // Trim underscores
  }

  async function addItem(sectionKey: string) {
    if (!newItemLabel.trim()) {
      showToast({ type: "error", message: "El nombre no puede estar vacío" });
      return;
    }

    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return;

    // Check for duplicate labels
    if (
      section.items.some(
        (item) => item.label.toLowerCase() === newItemLabel.trim().toLowerCase()
      )
    ) {
      showToast({ type: "error", message: "Este item ya existe" });
      return;
    }

    const newItem: ConfigItem = {
      value: generateValue(newItemLabel),
      label: newItemLabel.trim(),
      active: true,
    };

    const updatedItems = [...section.items, newItem];

    await saveConfiguration(sectionKey, updatedItems);
    newItemLabel = "";
    activeSectionKey = null;
  }

  async function updateItem(sectionKey: string, index: number) {
    if (!editItemLabel.trim()) {
      showToast({ type: "error", message: "El nombre no puede estar vacío" });
      return;
    }

    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return;

    // Check for duplicate labels (excluding current item)
    if (
      section.items.some(
        (item, i) =>
          i !== index &&
          item.label.toLowerCase() === editItemLabel.trim().toLowerCase()
      )
    ) {
      showToast({ type: "error", message: "Este item ya existe" });
      return;
    }

    const updatedItems = section.items.map((item, i) =>
      i === index
        ? {
            value: item.value,
            label: editItemLabel.trim(),
            active: item.active ?? true,
          } // Keep original value and status
        : item
    );

    await saveConfiguration(sectionKey, updatedItems);
    editingItem = null;
    editItemLabel = "";
  }

  async function toggleItemStatus(sectionKey: string, index: number) {
    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return;

    const item = section.items[index];
    const isActive = item.active ?? true;
    const action = isActive ? "desactivar" : "activar";

    if (!confirm(`¿Seguro que deseas ${action} "${item.label}"?`)) return;

    const updatedItems = section.items.map((it, i) =>
      i === index ? { ...it, active: !isActive } : it
    );

    await saveConfiguration(sectionKey, updatedItems);
  }

  async function saveConfiguration(sectionKey: string, items: ConfigItem[]) {
    try {
      // Save items with their active status
      const config_value = {
        items: items.map((item) => ({
          value: item.value,
          label: item.label,
          active: item.active ?? true,
        })),
      };

      const response = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config_key: sectionKey,
          config_value,
        }),
      });

      if (response.ok) {
        showToast({ type: "success", message: "Configuración guardada" });
        await loadAllConfigurations();
      } else {
        const result = await response.json();
        showToast({
          type: "error",
          message: result.message || "Error al guardar",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al guardar configuración" });
    }
  }

  function startEdit(sectionKey: string, index: number) {
    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return;

    editingItem = { sectionKey, index };
    editItemLabel = section.items[index].label;
  }

  function cancelEdit() {
    editingItem = null;
    editItemLabel = "";
  }

  // Filter items based on showInactive flag
  function getVisibleItems(items: ConfigItem[]) {
    if (showInactive) return items;
    return items.filter((item) => item.active ?? true);
  }

  // Get counts
  function getActiveCount(items: ConfigItem[]) {
    return items.filter((item) => item.active ?? true).length;
  }

  function getInactiveCount(items: ConfigItem[]) {
    return items.filter((item) => !(item.active ?? true)).length;
  }
</script>

<div class="config-manager">
  {#if loading}
    <div class="loading-state">
      <p>Cargando configuraciones...</p>
    </div>
  {:else}
    <div class="sections-grid">
      {#each sections as section}
        <Card>
          <div class="section-header">
            <div class="section-title">
              <div class="icon-wrapper">
                <svelte:component this={section.icon} size={20} />
              </div>
              <div>
                <h3>{section.label}</h3>
                <p class="section-description">{section.description}</p>
              </div>
            </div>
            <div
              style="display: flex; gap: var(--space-2); align-items: center;"
            >
              <Badge variant="success">
                {getActiveCount(section.items)} activos
              </Badge>
              {#if getInactiveCount(section.items) > 0}
                <Badge variant="default">
                  {getInactiveCount(section.items)} inactivos
                </Badge>
              {/if}
            </div>
          </div>

          <!-- Toggle to show inactive items -->
          {#if getInactiveCount(section.items) > 0}
            <div class="show-inactive-toggle">
              <label class="checkbox-label">
                <input type="checkbox" bind:checked={showInactive} />
                <span>Mostrar items inactivos</span>
              </label>
            </div>
          {/if}

          <div class="items-list">
            {#each getVisibleItems(section.items) as item, index (item.value)}
              {@const actualIndex = section.items.findIndex(
                (it) => it.value === item.value
              )}
              <div class="item-row" class:inactive={!(item.active ?? true)}>
                {#if editingItem?.sectionKey === section.key && editingItem?.index === actualIndex}
                  <div class="item-edit-form">
                    <Input
                      bind:value={editItemLabel}
                      placeholder="Nombre del item"
                      autofocus
                    />
                    <div class="item-actions">
                      <button
                        class="action-btn success"
                        onclick={() => updateItem(section.key, actualIndex)}
                        title="Guardar"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        class="action-btn"
                        onclick={cancelEdit}
                        title="Cancelar"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                {:else}
                  <div class="item-content">
                    <div class="item-label-wrapper">
                      <span class="item-label">{item.label}</span>
                      {#if !(item.active ?? true)}
                        <Badge variant="default">Inactivo</Badge>
                      {/if}
                    </div>
                    <code class="item-value">{item.value}</code>
                  </div>
                  <div class="item-actions">
                    <button
                      class="action-btn"
                      onclick={() => startEdit(section.key, actualIndex)}
                      title="Editar"
                      disabled={!(item.active ?? true)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      class="action-btn {(item.active ?? true)
                        ? 'warning'
                        : 'success'}"
                      onclick={() => toggleItemStatus(section.key, actualIndex)}
                      title={(item.active ?? true) ? "Desactivar" : "Activar"}
                    >
                      {#if item.active ?? true}
                        <Trash size={16} />
                      {:else}
                        <Check size={16} />
                      {/if}
                    </button>
                  </div>
                {/if}
              </div>
            {/each}

            {#if getVisibleItems(section.items).length === 0 && !showInactive}
              <div class="empty-state">
                <p>
                  {#if getInactiveCount(section.items) > 0}
                    No hay items activos. Hay {getInactiveCount(section.items)} items
                    inactivos.
                  {:else}
                    No hay items configurados
                  {/if}
                </p>
              </div>
            {/if}
          </div>

          <div class="add-item-form">
            {#if activeSectionKey === section.key}
              <div class="add-item-input">
                <Input
                  bind:value={newItemLabel}
                  placeholder="Nombre del nuevo item"
                  autofocus
                  onkeydown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(section.key);
                    } else if (e.key === "Escape") {
                      activeSectionKey = null;
                      newItemLabel = "";
                    }
                  }}
                />
                <Button
                  variant="primary"
                  size="sm"
                  onclick={() => addItem(section.key)}
                >
                  <Plus size={16} />
                  Agregar
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onclick={() => {
                    activeSectionKey = null;
                    newItemLabel = "";
                  }}
                >
                  Cancelar
                </Button>
              </div>
            {:else}
              <Button
                variant="outline"
                size="sm"
                onclick={() => (activeSectionKey = section.key)}
              >
                <Plus size={16} />
                Agregar {section.label}
              </Button>
            {/if}
          </div>
        </Card>
      {/each}
    </div>

    <div class="help-section">
      <Card>
        <div class="help-content">
          <h4>💡 Acerca de la configuración</h4>
          <ul>
            <li>
              <strong>Valor automático:</strong> Al agregar un item, se genera automáticamente
              un valor técnico (slug) sin espacios ni acentos para uso interno en
              la base de datos
            </li>
            <li>
              <strong>Edición del nombre:</strong> Puedes cambiar el nombre visible
              sin afectar el valor técnico, manteniendo la compatibilidad con datos
              existentes
            </li>
            <li>
              <strong>Desactivación:</strong> En lugar de eliminar, los items se
              desactivan para preservar el historial. Las pólizas existentes mantienen
              su referencia
            </li>
            <li>
              <strong>Items inactivos:</strong> Los items desactivados no aparecen
              en los formularios nuevos, pero puedes verlos activando el checkbox
              "Mostrar items inactivos"
            </li>
            <li>
              <strong>Reactivación:</strong> Puedes reactivar items desactivados
              en cualquier momento haciendo clic en el botón de activar (✓)
            </li>
          </ul>
        </div>
      </Card>
    </div>
  {/if}
</div>

<style lang="scss">
  .config-manager {
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .loading-state {
    text-align: center;
    padding: var(--space-8);
    color: var(--text-secondary);
  }

  .sections-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: var(--space-6);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--space-5);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-primary);
  }

  .section-title {
    display: flex;
    gap: var(--space-3);
    align-items: flex-start;

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--primary-50);
      color: var(--primary-600);
      flex: unset;
    }

    h3 {
      font-size: var(--text-lg);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
    }

    .section-description {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .show-inactive-toggle {
    padding: var(--space-3) 0;
    border-bottom: 1px solid var(--border-primary);
    margin-bottom: var(--space-3);

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      cursor: pointer;
      font-size: var(--text-sm);
      color: var(--text-secondary);
      user-select: none;

      input[type="checkbox"] {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }

      &:hover {
        color: var(--text-primary);
      }
    }
  }

  .items-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
    min-height: 100px;
  }

  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    transition: all var(--transition-fast);

    &:hover {
      border-color: var(--border-hover);
      background: var(--bg-secondary);
    }

    &.inactive {
      opacity: 0.6;
      background: var(--bg-secondary);
      border-style: dashed;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  .item-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1;

    .item-label-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .item-label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);
    }

    .item-value {
      font-size: var(--text-xs);
      font-family: "Monaco", "Courier New", monospace;
      color: var(--text-tertiary);
      background: var(--bg-secondary);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-sm);
      width: fit-content;
    }
  }

  .item-actions {
    display: flex;
    gap: var(--space-2);
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-2);
    border: none;
    border-radius: var(--radius-md);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover:not(:disabled) {
      background: var(--bg-tertiary);
      color: var(--text-primary);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.danger:hover:not(:disabled) {
      background: var(--error-50);
      color: var(--error-600);
    }

    &.warning:hover:not(:disabled) {
      background: var(--warning-50);
      color: var(--warning-600);
    }

    &.success:hover:not(:disabled) {
      background: var(--success-50);
      color: var(--success-600);
    }
  }

  .item-edit-form {
    display: flex;
    gap: var(--space-2);
    align-items: center;
    width: 100%;
  }

  .add-item-form {
    padding-top: var(--space-4);
    border-top: 1px solid var(--border-primary);
  }

  .add-item-input {
    display: flex;
    gap: var(--space-2);
    align-items: center;
  }

  .empty-state {
    text-align: center;
    padding: var(--space-6);
    color: var(--text-tertiary);
    font-size: var(--text-sm);
  }

  .help-section {
    .help-content {
      h4 {
        font-size: var(--text-base);
        font-weight: var(--font-semibold);
        color: var(--text-primary);
        margin: 0 0 var(--space-3);
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);

        li {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          line-height: 1.5;

          strong {
            color: var(--text-primary);
          }
        }
      }
    }
  }
</style>

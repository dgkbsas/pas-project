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
    Settings,
    Globe,
    Clock,
    Bell,
  } from "lucide-svelte";
  import type { ConfigItem } from "$lib/types/config.types";

  type ConfigSection = {
    key: string;
    label: string;
    icon: any;
    description: string;
    items: ConfigItem[];
  };

  let loading = $state(false);
  let savingGeneral = $state(false);

  // General configuration fields
  let generalConfig = $state({
    currency: "ARS",
    date_format: "DD/MM/YYYY",
    timezone: "America/Argentina/Buenos_Aires",
    default_alert_days: 30,
  });

  // Alert settings
  let alertSettings = $state({
    days_before_expiry: 30,
    days_critical: 7,
    notify_on_create: true,
  });

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

  let editingItem = $state<{ sectionKey: string; itemKey: string } | null>(null);
  let newItemValue = $state("");
  let editItemValue = $state("");
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

      if (response.ok && result.config) {
        // Load general config
        generalConfig = {
          currency: result.config.currency || "ARS",
          date_format: result.config.date_format || "DD/MM/YYYY",
          timezone: result.config.timezone || "America/Argentina/Buenos_Aires",
          default_alert_days: result.config.default_alert_days || 30,
        };

        // Load alert settings
        if (result.config.alert_settings) {
          alertSettings = {
            days_before_expiry: result.config.alert_settings.days_before_expiry || 30,
            days_critical: result.config.alert_settings.days_critical || 7,
            notify_on_create: result.config.alert_settings.notify_on_create !== false,
          };
        }

        // Map config fields to sections
        sections = sections.map((section) => {
          const items: ConfigItem[] = result.config[section.key] || [];
          return {
            ...section,
            items,
          };
        });
      }
    } catch (err) {
      console.error("Error loading configurations:", err);
      showToast({ type: "error", message: "Error al cargar configuraciones" });
    } finally {
      loading = false;
    }
  }

  async function saveGeneralConfig() {
    savingGeneral = true;
    try {
      const response = await fetch("/api/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...generalConfig,
          alert_settings: alertSettings,
        }),
      });

      if (response.ok) {
        showToast({ type: "success", message: "Configuración guardada exitosamente" });
      } else {
        const result = await response.json();
        showToast({
          type: "error",
          message: result.message || "Error al guardar configuración",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al guardar configuración" });
    } finally {
      savingGeneral = false;
    }
  }

  async function addItem(sectionKey: string) {
    if (!newItemValue.trim()) {
      showToast({ type: "error", message: "El nombre no puede estar vacío" });
      return;
    }

    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return;

    // Check for duplicate values
    if (
      section.items.some(
        (item) => item.value.toLowerCase() === newItemValue.trim().toLowerCase()
      )
    ) {
      showToast({ type: "error", message: "Este item ya existe" });
      return;
    }

    try {
      const response = await fetch(`/api/config/${sectionKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: newItemValue.trim(),
          active: true,
        }),
      });

      if (response.ok) {
        showToast({ type: "success", message: "Item agregado exitosamente" });
        await loadAllConfigurations();
        newItemValue = "";
        activeSectionKey = null;
      } else {
        const result = await response.json();
        showToast({
          type: "error",
          message: result.message || "Error al agregar item",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al agregar item" });
    }
  }

  async function updateItem(sectionKey: string, itemKey: string) {
    if (!editItemValue.trim()) {
      showToast({ type: "error", message: "El nombre no puede estar vacío" });
      return;
    }

    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return;

    const item = section.items.find((i) => i.key === itemKey);
    if (!item) return;

    // Check for duplicate values (excluding current item)
    if (
      section.items.some(
        (i) =>
          i.key !== itemKey &&
          i.value.toLowerCase() === editItemValue.trim().toLowerCase()
      )
    ) {
      showToast({ type: "error", message: "Este item ya existe" });
      return;
    }

    try {
      const response = await fetch(`/api/config/${sectionKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: itemKey,
          value: editItemValue.trim(),
          active: item.active,
        }),
      });

      if (response.ok) {
        showToast({ type: "success", message: "Item actualizado exitosamente" });
        await loadAllConfigurations();
        editingItem = null;
        editItemValue = "";
      } else {
        const result = await response.json();
        showToast({
          type: "error",
          message: result.message || "Error al actualizar item",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al actualizar item" });
    }
  }

  async function toggleItemStatus(sectionKey: string, itemKey: string) {
    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return;

    const item = section.items.find((i) => i.key === itemKey);
    if (!item) return;

    const action = item.active ? "desactivar" : "activar";

    if (!confirm(`¿Seguro que deseas ${action} "${item.value}"?`)) return;

    try {
      const response = await fetch(
        `/api/config/${sectionKey}?itemKey=${itemKey}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const result = await response.json();
        showToast({ type: "success", message: result.message });
        await loadAllConfigurations();
      } else {
        const result = await response.json();
        showToast({
          type: "error",
          message: result.message || "Error al cambiar estado",
        });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al cambiar estado del item" });
    }
  }

  function startEdit(sectionKey: string, itemKey: string) {
    const section = sections.find((s) => s.key === sectionKey);
    if (!section) return;

    const item = section.items.find((i) => i.key === itemKey);
    if (!item) return;

    editingItem = { sectionKey, itemKey };
    editItemValue = item.value;
  }

  function cancelEdit() {
    editingItem = null;
    editItemValue = "";
  }

  // Filter items based on showInactive flag
  function getVisibleItems(items: ConfigItem[]) {
    if (showInactive) return items;
    return items.filter((item) => item.active);
  }

  // Get counts
  function getActiveCount(items: ConfigItem[]) {
    return items.filter((item) => item.active).length;
  }

  function getInactiveCount(items: ConfigItem[]) {
    return items.filter((item) => !item.active).length;
  }
</script>

<div class="config-manager">
  {#if loading}
    <div class="loading-state">
      <p>Cargando configuraciones...</p>
    </div>
  {:else}
    <!-- General Settings Section -->
    <Card>
      <div class="section-header">
        <div class="section-title">
          <div class="icon-wrapper">
            <Settings size={20} />
          </div>
          <div>
            <h3>Configuración General</h3>
            <p class="section-description">Parámetros generales del sistema</p>
          </div>
        </div>
      </div>

      <div class="general-config-form">
        <div class="config-row">
          <div class="config-field">
            <label>
              <span class="field-icon"><DollarSign size={16} /></span>
              Moneda
            </label>
            <select bind:value={generalConfig.currency}>
              <option value="ARS">ARS - Peso Argentino</option>
              <option value="USD">USD - Dólar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="BRL">BRL - Real Brasileño</option>
              <option value="CLP">CLP - Peso Chileno</option>
              <option value="UYU">UYU - Peso Uruguayo</option>
            </select>
          </div>

          <div class="config-field">
            <label>
              <span class="field-icon"><Calendar size={16} /></span>
              Formato de Fecha
            </label>
            <select bind:value={generalConfig.date_format}>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        <div class="config-row">
          <div class="config-field full-width">
            <label>
              <span class="field-icon"><Globe size={16} /></span>
              Zona Horaria
            </label>
            <select bind:value={generalConfig.timezone}>
              <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
              <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
              <option value="America/Santiago">Santiago (GMT-3/GMT-4)</option>
              <option value="America/Montevideo">Montevideo (GMT-3)</option>
              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
              <option value="America/Bogota">Bogotá (GMT-5)</option>
              <option value="America/Lima">Lima (GMT-5)</option>
              <option value="Europe/Madrid">Madrid (GMT+1/GMT+2)</option>
            </select>
          </div>
        </div>

        <div class="alert-settings-section">
          <h4>
            <Bell size={18} />
            Configuración de Alertas
          </h4>

          <div class="config-row">
            <div class="config-field">
              <label>
                <span class="field-icon"><Clock size={16} /></span>
                Días de alerta antes del vencimiento
              </label>
              <Input
                type="number"
                bind:value={alertSettings.days_before_expiry}
                min="1"
                max="365"
              />
              <small class="help-text">Días de anticipación para notificar vencimientos</small>
            </div>

            <div class="config-field">
              <label>
                <span class="field-icon"><Bell size={16} /></span>
                Días críticos
              </label>
              <Input
                type="number"
                bind:value={alertSettings.days_critical}
                min="1"
                max="30"
              />
              <small class="help-text">Días para marcar como crítico</small>
            </div>
          </div>

          <div class="config-row">
            <div class="config-field checkbox-field">
              <label class="checkbox-label">
                <input type="checkbox" bind:checked={alertSettings.notify_on_create} />
                <span>Notificar al crear nuevas pólizas</span>
              </label>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <Button variant="primary" onclick={saveGeneralConfig} disabled={savingGeneral}>
            {savingGeneral ? "Guardando..." : "Guardar Configuración General"}
          </Button>
        </div>
      </div>
    </Card>

    <div class="sections-grid">
      {#each sections as section}
        <Card>
          <div class="section-header">
            <div class="section-title">
              <div class="icon-wrapper">
                {#if section.icon}
                  <section.icon size={20} />
                {/if}
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
            {#each getVisibleItems(section.items) as item (item.key)}
              <div class="item-row" class:inactive={!item.active}>
                {#if editingItem?.sectionKey === section.key && editingItem?.itemKey === item.key}
                  <div class="item-edit-form">
                    <Input
                      bind:value={editItemValue}
                      placeholder="Nombre del item"
                      autofocus
                    />
                    <div class="item-actions">
                      <button
                        class="action-btn success"
                        onclick={() => updateItem(section.key, item.key)}
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
                      <span class="item-label">{item.value}</span>
                      {#if !item.active}
                        <Badge variant="default">Inactivo</Badge>
                      {/if}
                    </div>
                    <code class="item-value">{item.key}</code>
                  </div>
                  <div class="item-actions">
                    <button
                      class="action-btn"
                      onclick={() => startEdit(section.key, item.key)}
                      title="Editar"
                      disabled={!item.active}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      class="action-btn {item.active
                        ? 'warning'
                        : 'success'}"
                      onclick={() => toggleItemStatus(section.key, item.key)}
                      title={item.active ? "Desactivar" : "Activar"}
                    >
                      {#if item.active}
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
                  bind:value={newItemValue}
                  placeholder="Nombre del nuevo item"
                  autofocus
                  onkeydown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addItem(section.key);
                    } else if (e.key === "Escape") {
                      activeSectionKey = null;
                      newItemValue = "";
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
                    newItemValue = "";
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

  /* General Configuration Styles */
  .general-config-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .config-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .config-field {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    &.full-width {
      grid-column: 1 / -1;
    }

    &.checkbox-field {
      padding: var(--space-3) 0;
    }

    label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: var(--space-2);

      .field-icon {
        display: flex;
        align-items: center;
        color: var(--primary-600);
      }

      &.checkbox-label {
        font-weight: var(--font-normal);
        cursor: pointer;
        user-select: none;

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        &:hover {
          color: var(--text-primary);
        }
      }
    }

    select {
      padding: var(--space-3);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      color: var(--text-primary);
      font-size: var(--text-sm);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--border-hover);
      }

      &:focus {
        outline: none;
        border-color: var(--primary-500);
        box-shadow: 0 0 0 3px var(--primary-100);
      }
    }

    .help-text {
      font-size: var(--text-xs);
      color: var(--text-tertiary);
      margin: 0;
    }
  }

  .alert-settings-section {
    padding-top: var(--space-5);
    margin-top: var(--space-4);
    border-top: 1px solid var(--border-primary);

    h4 {
      font-size: var(--text-base);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-4);
      display: flex;
      align-items: center;
      gap: var(--space-2);

      :global(svg) {
        color: var(--primary-600);
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    padding-top: var(--space-4);
    margin-top: var(--space-4);
    border-top: 1px solid var(--border-primary);
  }
</style>

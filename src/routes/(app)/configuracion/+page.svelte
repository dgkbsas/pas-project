<script lang="ts">
  import { onMount } from "svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Tabs from "$lib/components/ui/Tabs.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Badge from "$lib/components/ui/Badge.svelte";
  import Table from "$lib/components/ui/Table.svelte";
  import EmptyState from "$lib/components/ui/EmptyState.svelte";
  import { showToast } from "$lib/stores/notifications";
  import {
    User,
    Building2,
    Mail,
    Users,
    Trash,
    Copy,
    Plus,
    Edit,
  } from "lucide-svelte";
  import ConfigurationManager from "$lib/components/ConfigurationManager.svelte";
  import type { Company, Invitation } from "$lib/types/database.types";

  type PageUser = {
    id: string;
    email: string;
    role: string;
    created_at: string;
  };

  type PageData = {
    user: {
      email: string;
    };
    company: Company | null;
    invitations: Invitation[];
    users: PageUser[];
  };

  let { data } = $props<{ data: PageData }>();

  let activeTab = $state("profile");
  let loadingProfile = $state(false);
  let loadingCompany = $state(false);
  let loadingInvite = $state(false);

  const tabs = [
    { id: "profile", label: "Perfil" },
    { id: "company", label: "Empresa" },
    { id: "insurers", label: "Aseguradoras" },
    { id: "variables", label: "Variables" },
    { id: "invitations", label: "Invitaciones" },
    { id: "users", label: "Usuarios" },
  ];

  // Perfil
  let profileData = $state({
    email: data.user.email || "",
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  // Empresa
  let companyData = $state({
    name: data.company?.name || "",
    address: data.company?.address || "",
    city: data.company?.city || "",
    postal_code: data.company?.postal_code || "",
    phone: data.company?.phone || "",
  });

  // Aseguradoras
  let insurers = $state<any[]>([]);
  let loadingInsurers = $state(false);
  let editingInsurerId = $state<string | null>(null);
  let insurerFormData = $state({
    name: '',
    code: '',
    contact_email: '',
    contact_phone: '',
    website: '',
  });

  // Variables de configuración
  type ConfigVariable = {
    id: string;
    config_key: string;
    config_value: any;
    created_at: string;
    updated_at: string;
  };
  let configVariables = $state<ConfigVariable[]>([]);
  let loadingConfig = $state(false);
  let editingConfigId = $state<string | null>(null);
  let configFormData = $state({
    config_key: '',
    config_value: ''
  });

  // Invitaciones
  let inviteEmail = $state("");
  let inviteRole = $state("user");

  async function updateProfile() {
    loadingProfile = true;
    try {
      const updates: any = {};

      if (profileData.new_password) {
        if (profileData.new_password !== profileData.confirm_password) {
          showToast({ type: "error", message: "Las contraseñas no coinciden" });
          return;
        }
        updates.password = profileData.new_password;
      }

      if (Object.keys(updates).length > 0) {
        const response = await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          showToast({ type: "success", message: "Perfil actualizado" });
          profileData.current_password = "";
          profileData.new_password = "";
          profileData.confirm_password = "";
        } else {
          const result = await response.json();
          showToast({ type: "error", message: result.message });
        }
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al actualizar perfil" });
    } finally {
      loadingProfile = false;
    }
  }

  async function updateCompany() {
    loadingCompany = true;
    try {
      const response = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyData),
      });

      const result = await response.json();

      if (response.ok) {
        showToast({ type: "success", message: "Empresa actualizada" });
        // Update local state with returned data
        if (result.company) {
          companyData = {
            name: result.company.name || "",
            address: result.company.address || "",
            city: result.company.city || "",
            postal_code: result.company.postal_code || "",
            phone: result.company.phone || "",
          };
        }
      } else {
        showToast({ type: "error", message: result.message || "Error al actualizar" });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al actualizar empresa" });
    } finally {
      loadingCompany = false;
    }
  }

  async function createInvitation() {
    loadingInvite = true;
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (response.ok) {
        showToast({ type: "success", message: "Invitación enviada" });
        inviteEmail = "";
        window.location.reload();
      } else {
        const result = await response.json();
        showToast({ type: "error", message: result.message });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al enviar invitación" });
    } finally {
      loadingInvite = false;
    }
  }

  async function deleteInvitation(id: string) {
    if (!confirm("¿Seguro que deseas eliminar esta invitación?")) return;

    try {
      const response = await fetch(`/api/invitations/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast({ type: "success", message: "Invitación eliminada" });
        window.location.reload();
      } else {
        const result = await response.json();
        showToast({ type: "error", message: result.message });
      }
    } catch (err) {
      showToast({ type: "error", message: "Error al eliminar" });
    }
  }

  function copyInviteLink(token: string) {
    const url = `${window.location.origin}/auth/signup?token=${token}`;
    navigator.clipboard.writeText(url);
    showToast({ type: "success", message: "Link copiado al portapapeles" });
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getRoleBadge(role: string): 'error' | 'success' | 'info' | 'warning' | 'default' {
    return role === "admin" ? "default" : "default";
  }

  function getRoleLabel(role: string) {
    return role === "admin" ? "Administrador" : "Usuario";
  }

  async function loadInsurers() {
    loadingInsurers = true;
    try {
      const response = await fetch('/api/insurance-companies');
      const result = await response.json();
      if (response.ok) {
        insurers = result.companies || [];
      } else {
        showToast({ type: 'error', message: result.message || 'Error al cargar aseguradoras' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al cargar aseguradoras' });
    } finally {
      loadingInsurers = false;
    }
  }

  async function saveInsurer() {
    if (!insurerFormData.name.trim()) {
      showToast({ type: 'error', message: 'El nombre es requerido' });
      return;
    }

    try {
      const url = editingInsurerId 
        ? `/api/insurance-companies/${editingInsurerId}` 
        : '/api/insurance-companies';
      
      const method = editingInsurerId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insurerFormData),
      });

      if (response.ok) {
        showToast({ 
          type: 'success', 
          message: editingInsurerId ? 'Aseguradora actualizada' : 'Aseguradora creada' 
        });
        resetInsurerForm();
        loadInsurers();
      } else {
        const result = await response.json();
        showToast({ type: 'error', message: result.message || 'Error al guardar' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al guardar aseguradora' });
    }
  }

  function editInsurer(insurer: any) {
    editingInsurerId = insurer.id;
    insurerFormData = {
      name: insurer.name,
      code: insurer.code || '',
      contact_email: insurer.contact_email || '',
      contact_phone: insurer.contact_phone || '',
      website: insurer.website || '',
    };
  }

  async function deleteInsurer(id: string, name: string) {
    if (!confirm(`¿Seguro que deseas eliminar "${name}"?`)) return;

    try {
      const response = await fetch(`/api/insurance-companies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({ type: 'success', message: 'Aseguradora eliminada' });
        loadInsurers();
      } else {
        const result = await response.json();
        showToast({ type: 'error', message: result.message || 'Error al eliminar' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al eliminar aseguradora' });
    }
  }

  function resetInsurerForm() {
    editingInsurerId = null;
    insurerFormData = {
      name: '',
      code: '',
      contact_email: '',
      contact_phone: '',
      website: '',
    };
  }

  // Load insurers when tab is active
  $effect(() => {
    if (activeTab === 'insurers' && insurers.length === 0) {
      loadInsurers();
    }
  });

  // Configuration variables functions
  async function loadConfigVariables() {
    loadingConfig = true;
    try {
      const response = await fetch('/api/config');
      const result = await response.json();
      if (response.ok) {
        configVariables = result.configs || [];
      } else {
        showToast({ type: 'error', message: result.message || 'Error al cargar configuración' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al cargar configuración' });
    } finally {
      loadingConfig = false;
    }
  }

  async function saveConfigVariable() {
    if (!configFormData.config_key.trim()) {
      showToast({ type: 'error', message: 'La clave es requerida' });
      return;
    }

    try {
      // Parse value as JSON if possible, otherwise store as string
      let parsedValue;
      try {
        parsedValue = JSON.parse(configFormData.config_value);
      } catch {
        parsedValue = configFormData.config_value;
      }

      const url = editingConfigId 
        ? `/api/config/${editingConfigId}` 
        : '/api/config';
      
      const method = editingConfigId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config_key: configFormData.config_key,
          config_value: parsedValue
        }),
      });

      if (response.ok) {
        showToast({ 
          type: 'success', 
          message: editingConfigId ? 'Variable actualizada' : 'Variable creada' 
        });
        resetConfigForm();
        loadConfigVariables();
      } else {
        const result = await response.json();
        showToast({ type: 'error', message: result.message || 'Error al guardar' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al guardar variable' });
    }
  }

  function editConfigVariable(config: ConfigVariable) {
    editingConfigId = config.id;
    configFormData = {
      config_key: config.config_key,
      config_value: typeof config.config_value === 'object' 
        ? JSON.stringify(config.config_value, null, 2) 
        : String(config.config_value)
    };
  }

  async function deleteConfigVariable(id: string, key: string) {
    if (!confirm(`¿Seguro que deseas eliminar "${key}"?`)) return;

    try {
      const response = await fetch(`/api/config/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast({ type: 'success', message: 'Variable eliminada' });
        loadConfigVariables();
      } else {
        const result = await response.json();
        showToast({ type: 'error', message: result.message || 'Error al eliminar' });
      }
    } catch (err) {
      showToast({ type: 'error', message: 'Error al eliminar variable' });
    }
  }

  function resetConfigForm() {
    editingConfigId = null;
    configFormData = {
      config_key: '',
      config_value: ''
    };
  }

  function formatConfigValue(value: any): string {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  // Load config variables when tab is active
  $effect(() => {
    if (activeTab === 'variables' && configVariables.length === 0) {
      loadConfigVariables();
    }
  });
</script>

<svelte:head>
  <title>Configuración - PAS Manager</title>
</svelte:head>

<div class="page">
  <div class="page-header">
    <div>
      <h1>Configuración</h1>
      <p>Administra la configuración de tu empresa y perfil</p>
    </div>
  </div>

  <Tabs {tabs} bind:activeTab on:change={(e) => (activeTab = e.detail)}>
    {#if activeTab === "profile"}
      <Card>
        <div class="section-header">
          <div class="icon-wrapper">
            <User size={20} />
          </div>
          <div>
            <h2>Perfil de Usuario</h2>
            <p>Actualiza tu información personal y contraseña</p>
          </div>
        </div>

        <form
          onsubmit={(e) => {
            e.preventDefault();
            updateProfile();
          }}
        >
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Email</label>
              <Input value={profileData.email} disabled />
              <small class="help-text">El email no se puede cambiar</small>
            </div>

            <div class="form-group">
              <label>Nueva Contraseña</label>
              <Input
                type="password"
                bind:value={profileData.new_password}
                placeholder="Dejar en blanco para no cambiar"
              />
            </div>

            <div class="form-group">
              <label>Confirmar Contraseña</label>
              <Input
                type="password"
                bind:value={profileData.confirm_password}
                placeholder="Confirmar nueva contraseña"
              />
            </div>
          </div>

          <div class="form-actions">
            <Button type="submit" variant="primary" disabled={loadingProfile}>
              {loadingProfile ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Card>
    {:else if activeTab === "company"}
      <Card>
        <div class="section-header">
          <div class="icon-wrapper">
            <Building2 size={20} />
          </div>
          <div>
            <h2>Datos de la Empresa</h2>
            <p>Información de tu empresa u organización</p>
          </div>
        </div>

        <form
          onsubmit={(e) => {
            e.preventDefault();
            updateCompany();
          }}
        >
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Nombre de la Empresa</label>
              <Input
                bind:value={companyData.name}
                placeholder="Mi Empresa S.A."
                required
              />
            </div>

            <div class="form-group full-width">
              <label>Dirección</label>
              <Input
                bind:value={companyData.address}
                placeholder="Calle Principal 123"
              />
            </div>

            <div class="form-group">
              <label>Ciudad</label>
              <Input bind:value={companyData.city} placeholder="Madrid" />
            </div>

            <div class="form-group">
              <label>Código Postal</label>
              <Input bind:value={companyData.postal_code} placeholder="28001" />
            </div>

            <div class="form-group">
              <label>Teléfono</label>
              <Input
                type="tel"
                bind:value={companyData.phone}
                placeholder="+34 900 000 000"
              />
            </div>
          </div>

          <div class="form-actions">
            <Button type="submit" variant="primary" disabled={loadingCompany}>
              {loadingCompany ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Card>
    {:else if activeTab === "insurers"}
      <Card>
        <div class="section-header">
          <div class="icon-wrapper">
            <Building2 size={20} />
          </div>
          <div>
            <h2>Compañías de Seguros</h2>
            <p>Gestiona las aseguradoras disponibles en el sistema</p>
          </div>
        </div>

        <form
          onsubmit={(e) => {
            e.preventDefault();
            saveInsurer();
          }}
          class="insurer-form"
        >
          <div class="form-grid">
            <div class="form-group">
              <label>Nombre *</label>
              <Input
                bind:value={insurerFormData.name}
                placeholder="Ej: Mapfre, AXA, Zurich..."
                required
              />
            </div>

            <div class="form-group">
              <label>Código</label>
              <Input
                bind:value={insurerFormData.code}
                placeholder="Código corto"
              />
            </div>

            <div class="form-group">
              <label>Email de contacto</label>
              <Input
                type="email"
                bind:value={insurerFormData.contact_email}
                placeholder="contacto@compania.com"
              />
            </div>

            <div class="form-group">
              <label>Teléfono</label>
              <Input
                type="tel"
                bind:value={insurerFormData.contact_phone}
                placeholder="+34 900 000 000"
              />
            </div>

            <div class="form-group full-width">
              <label>Sitio web</label>
              <Input
                type="url"
                bind:value={insurerFormData.website}
                placeholder="https://www.compania.com"
              />
            </div>
          </div>

          <div class="form-actions">
            {#if editingInsurerId}
              <Button variant="ghost" onclick={resetInsurerForm} type="button">
                Cancelar
              </Button>
            {/if}
            <Button type="submit" variant="primary">
              {#if editingInsurerId}
                Actualizar
              {:else}
                <Plus size={18} />
                Crear Aseguradora
              {/if}
            </Button>
          </div>
        </form>

        {#if loadingInsurers}
          <div class="loading-text">Cargando aseguradoras...</div>
        {:else if insurers.length === 0}
          <EmptyState
            icon={Building2}
            title="No hay aseguradoras registradas"
            description="Comienza agregando tu primera compañía de seguros"
          />
        {:else}
          <div class="insurers-table">
            <Table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Código</th>
                  <th>Contacto</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {#each insurers as insurer}
                  <tr>
                    <td>
                      <div class="insurer-name">
                        <Building2 size={16} />
                        {insurer.name}
                      </div>
                    </td>
                    <td>
                      {#if insurer.code}
                        <span class="code-badge">{insurer.code}</span>
                      {:else}
                        <span class="text-muted">-</span>
                      {/if}
                    </td>
                    <td>
                      {#if insurer.contact_email}
                        <span class="contact-info">{insurer.contact_email}</span>
                      {:else if insurer.contact_phone}
                        <span class="contact-info">{insurer.contact_phone}</span>
                      {:else}
                        <span class="text-muted">Sin contacto</span>
                      {/if}
                    </td>
                    <td class="text-right">
                      <div class="table-actions">
                        <button
                          class="action-btn"
                          onclick={() => editInsurer(insurer)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          class="action-btn danger"
                          onclick={() => deleteInsurer(insurer.id, insurer.name)}
                          title="Eliminar"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </Table>
          </div>
        {/if}
      </Card>
    {:else if activeTab === "variables"}
      <ConfigurationManager />
    {:else if activeTab === "invitations"}
      <Card>
        <div class="section-header">
          <div class="icon-wrapper">
            <Mail size={20} />
          </div>
          <div>
            <h2>Invitaciones</h2>
            <p>Invita a nuevos usuarios a unirse a tu empresa</p>
          </div>
        </div>

        <form
          onsubmit={(e) => {
            e.preventDefault();
            createInvitation();
          }}
          class="invite-form"
        >
          <div class="invite-inputs">
            <Input
              type="email"
              bind:value={inviteEmail}
              placeholder="correo@ejemplo.com"
              required
            />
            <Button type="submit" variant="primary" disabled={loadingInvite}>
              <Plus size={18} />
              {loadingInvite ? "Enviando..." : "Enviar Invitación"}
            </Button>
          </div>
        </form>

        {#if data.invitations.length === 0}
          <EmptyState
            icon={Mail}
            title="Sin invitaciones"
            description="No hay invitaciones pendientes"
          />
        {:else}
          <div class="invitations-list">
            {#each data.invitations as invitation}
              <div class="invitation-item">
                <div class="invitation-info">
                  <div class="invitation-email">{invitation.email}</div>
                  <div class="invitation-meta">
                    Enviada {formatDate(invitation.created_at)}
                  </div>
                </div>
                <div class="invitation-actions">
                  <button
                    class="action-btn"
                    onclick={() => copyInviteLink(invitation.token)}
                    title="Copiar link"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    class="action-btn danger"
                    onclick={() => deleteInvitation(invitation.id)}
                    title="Eliminar"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </Card>
    {:else if activeTab === "users"}
      <Card>
        <div class="section-header">
          <div class="icon-wrapper">
            <Users size={20} />
          </div>
          <div>
            <h2>Usuarios</h2>
            <p>Usuarios con acceso a la empresa</p>
          </div>
        </div>

        {#if data.users.length === 0}
          <EmptyState
            icon={Users}
            title="Sin usuarios"
            description="No hay usuarios registrados"
          />
        {:else}
          <Table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {#each data.users as user}
                <tr>
                  <td>{user.email}</td>
                  <td>
                    <Badge variant={getRoleBadge(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </td>
                  <td>{formatDate(user.created_at)}</td>
                </tr>
              {/each}
            </tbody>
          </Table>
        {/if}
      </Card>
    {/if}
  </Tabs>
</div>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  // Ancho más estrecho para formularios (mejor UX)
  .page {
    margin: 0 auto;
  }

  .page-header {
    margin-bottom: var(--space-6);

    h1 {
      font-size: var(--text-3xl);
      font-weight: var(--font-bold);
      color: var(--text-primary);
      margin: 0 0 var(--space-2);
    }

    p {
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .section-header {
    display: flex;
    gap: var(--space-4);
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--border-primary);

    .icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: var(--primary-100);
      color: var(--primary-600);
      flex-shrink: 0;
    }

    h2 {
      font-size: var(--text-xl);
      font-weight: var(--font-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--space-1);
    }

    p {
      font-size: var(--text-sm);
      color: var(--text-secondary);
      margin: 0;
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    margin-bottom: var(--space-6);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    /* svelte-ignore css-unused-selector */
    &.full-width {
      grid-column: 1 / -1;
    }

    label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);
    }

    .help-text {
      font-size: var(--text-xs);
      color: var(--text-tertiary);
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--space-3);
  }

  .invite-form {
    margin-bottom: var(--space-6);
  }

  .invite-inputs {
    display: flex;
    gap: var(--space-3);

    :global(.input-wrapper) {
      flex: 1;
    }
  }

  .invitations-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .invitation-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    transition: all var(--transition-fast);

    &:hover {
      border-color: var(--primary-200);
      background: var(--bg-secondary);
    }
  }

  .invitation-info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .invitation-email {
    font-weight: var(--font-medium);
    color: var(--text-primary);
  }

  .invitation-meta {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .invitation-actions,
  .table-actions {
    display: flex;
    gap: var(--space-2);
    justify-content: flex-end;
  }

  .action-btn {
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
      color: var(--primary-600);
    }

    &.danger:hover {
      background: var(--error-50);
      color: var(--error-600);
    }
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: var(--text-2xl);
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .invite-inputs {
      flex-direction: column;
    }

    .invitation-item {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--space-3);
    }
  }

  .insurer-form {
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-6);
    border-bottom: 1px solid var(--border-primary);
  }

  .insurers-table {
    margin-top: var(--space-6);
  }

  .insurer-name {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-weight: var(--font-medium);
    color: var(--text-primary);

    :global(svg) {
      color: var(--primary-600);
    }
  }

  .code-badge {
    display: inline-block;
    padding: var(--space-1) var(--space-2);
    background: var(--primary-100);
    color: var(--primary-700);
    font-size: var(--text-xs);
    font-weight: var(--font-medium);
    border-radius: var(--radius-sm);
    text-transform: uppercase;
  }

  .contact-info {
    font-size: var(--text-sm);
    color: var(--text-secondary);
  }

  .text-muted {
    color: var(--text-tertiary);
  }

  .loading-text {
    padding: var(--space-4);
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  // Variables de configuración
  .config-form {
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-6);
    border-bottom: 1px solid var(--border-primary);

    textarea {
      width: 100%;
      padding: var(--space-3);
      border: 1px solid var(--border-primary);
      border-radius: var(--radius-md);
      font-family: 'Courier New', monospace;
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

  .config-table {
    margin-top: var(--space-6);
  }

  .config-key {
    display: inline-block;
    padding: var(--space-1) var(--space-2);
    background: var(--bg-secondary);
    color: var(--primary-700);
    font-size: var(--text-xs);
    font-family: 'Courier New', monospace;
    font-weight: var(--font-medium);
    border-radius: var(--radius-sm);
    border: 1px solid var(--border-primary);
  }

  .config-value {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-family: 'Courier New', monospace;
    max-width: 400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .date-small {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }
</style>

<script lang="ts">
  import { theme } from "$lib/stores/theme";
  import { showToast } from "$lib/stores/notifications";
  import Dropdown from "$lib/components/ui/Dropdown.svelte";
  import { User, LogOut, Settings, Sun, Moon } from "lucide-svelte";
  import type { User as SupabaseUser } from "@supabase/supabase-js";

  interface UserProfile {
    full_name?: string;
    role?: string;
  }

  let {
    user,
    userProfile,
    variant = "sidebar",
    dropdownPosition = "bottom",
    dropdownAlign = "right",
  } = $props<{
    user?: SupabaseUser;
    userProfile?: UserProfile;
    variant?: "sidebar" | "header";
    dropdownPosition?: "top" | "bottom";
    dropdownAlign?: "left" | "right";
  }>();

  function toggleThemeMode() {
    theme.update((current) => {
      if (current === "light") return "dark";
      if (current === "dark") return "light";
      return "light";
    });
  }

  async function handleLogout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast({
          type: "success",
          message: "Sesión cerrada exitosamente",
        });

        window.location.href = "/auth/login";
      } else {
        throw new Error(result.message || "Error al cerrar sesión");
      }
    } catch (error) {
      console.error("Error en logout:", error);
      showToast({
        type: "error",
        message: "Error al cerrar sesión",
      });
      window.location.href = "/auth/login";
    }
  }

  const currentTheme = $derived($theme);
</script>

<Dropdown
  align={dropdownAlign}
  position={dropdownPosition}
  class={variant === "sidebar" ? "sidebar-user-dropdown" : ""}
>
  {#snippet trigger()}
    {#if variant === "sidebar"}
      <div class="sidebar-user-trigger">
        <div class="user-avatar">
          <User size={20} />
        </div>
        <div class="user-details">
          <div class="user-name">{userProfile?.full_name || user?.email}</div>
          <div class="user-role">{userProfile?.role || "Usuario"}</div>
        </div>
      </div>
    {:else}
      <div class="user-menu-trigger">
        <div class="user-avatar">
          <User size={18} />
        </div>
        <span class="user-menu-name">{userProfile?.full_name || "Usuario"}</span
        >
      </div>
    {/if}
  {/snippet}

  {#snippet children()}
    <div class="dropdown-header">
      <div class="dropdown-user-name">
        {userProfile?.full_name || "Usuario"}
      </div>
      <div class="dropdown-user-email">{user?.email}</div>
      <div class="dropdown-user-role">{userProfile?.role || "Usuario"}</div>
    </div>

    <div class="dropdown-divider"></div>

    <button class="dropdown-item" onclick={toggleThemeMode}>
      {#if currentTheme === "dark"}
        <Sun size={16} />
        Modo Claro
      {:else}
        <Moon size={16} />
        Modo Oscuro
      {/if}
    </button>

	<div class="dropdown-divider"></div>

	<a href="/configuracion" class="dropdown-item">
		<Settings size={16} />
		Configuración
	</a>

	<div class="dropdown-divider"></div>

    <button class="dropdown-item" data-danger="true" onclick={handleLogout}>
      <LogOut size={16} />
      Cerrar Sesión
    </button>
  {/snippet}
</Dropdown>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  /* Sidebar variant */
  .sidebar-user-trigger {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-3);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
    }
  }

  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-full);
    background: var(--primary-100);
    color: var(--primary-700);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    :global([data-theme="dark"]) & {
      background: rgba(139, 92, 246, 0.2);
      color: var(--primary-400);
    }
  }

  .user-details {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .user-name {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-role {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    text-transform: capitalize;
  }

  /* Header variant */
  .user-menu-trigger {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
    }

    .user-menu-name {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);

      @include responsive(md-down) {
        display: none;
      }
    }
  }

  /* Dropdown content */
  .dropdown-header {
    padding: var(--space-3) var(--space-4);
    margin-bottom: var(--space-2);
  }

  .dropdown-user-name {
    font-size: var(--text-sm);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
  }

  .dropdown-user-email {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    margin-top: var(--space-1);
  }

  .dropdown-user-role {
    font-size: var(--text-xs);
    color: var(--primary-600);
    margin-top: var(--space-1);
    text-transform: capitalize;

    :global([data-theme="dark"]) & {
      color: var(--primary-400);
    }
  }
</style>

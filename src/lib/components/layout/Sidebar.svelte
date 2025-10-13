<script lang="ts">
  import { onMount } from "svelte";
  import Navigation from "./Navigation.svelte";
  import UserMenu from "./UserMenu.svelte";
  import type { User } from "@supabase/supabase-js";
  import logo from "$lib/assets/icons/logo.png";

  interface UserProfile {
    full_name?: string;
    role?: string;
  }

  let { currentPath, user, userProfile } = $props<{
    currentPath: string;
    user?: User;
    userProfile?: UserProfile;
  }>();

  let companyName = $state<string>("");

  onMount(async () => {
    try {
      const response = await fetch("/api/company");
      if (response.ok) {
        const result = await response.json();
        companyName = result.company?.name || "";
      }
    } catch (err) {
      console.error("Error fetching company name:", err);
    }
  });
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <div class="logo">
      <img src={logo} alt="Logo" height="24" />
      <div class="logo-text">
        <span class="app-name">PAS Manager</span>
        {#if companyName}
          <span class="company-name">{companyName}</span>
        {/if}
      </div>
    </div>
  </div>

  <Navigation {currentPath} />

  <div class="sidebar-footer">
    <UserMenu
      {user}
      {userProfile}
      variant="sidebar"
      dropdownPosition="top"
      dropdownAlign="left"
    />
  </div>
</aside>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  .sidebar {
    width: 260px;
    height: 100vh; // Altura fija = viewport (no min-height)
    background: var(--bg-primary);
    border-right: 1px solid var(--border-primary);
    display: flex;
    flex-direction: column;
    flex-shrink: 0; // No se comprime
    overflow: visible; // Permitir que dropdown sea visible

    @include responsive(lg-down) {
      display: none;
    }
  }

  .sidebar-header {
    padding: var(--space-6) var(--space-4);
    border-bottom: 1px solid var(--border-primary);
    gap: var(--space-2);
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
  }

  .logo {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .app-name {
    color: var(--text-tertiary);
    font-size: var(--text-md);
    font-weight: var(--font-bold);
    line-height: 1.4;
  }

  .company-name {
    color: var(--text-primary);
    font-size: var(--text-xs);
    font-weight: var(--font-bold);
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 180px;
  }

  .sidebar-footer {
    position: relative; // Contexto para el dropdown
    padding: var(--space-4);
    border-top: 1px solid var(--border-primary);
  }
</style>

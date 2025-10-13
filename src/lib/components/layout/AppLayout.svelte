<script lang="ts">
  import { page } from "$app/stores";
  import { sidebarOpen } from "$lib/stores/sidebar";
  import Sidebar from "./Sidebar.svelte";
  import MobileSidebar from "./MobileSidebar.svelte";
  import Header from "./Header.svelte";

  interface LayoutData {
    session?: {
      user?: any;
    };
    userProfile?: {
      full_name?: string;
      role?: string;
    };
  }

  let { data }: { data: LayoutData } = $props();

  // Cerrar sidebar en cambio de ruta
  $effect(() => {
    $page.url.pathname;
    sidebarOpen.close();
  });
</script>

<div class="app-layout">
  <!-- Sidebar Desktop -->
  <Sidebar
    currentPath={$page.url.pathname}
    user={data.session?.user}
    userProfile={data.userProfile}
  />

  <!-- Sidebar Mobile -->
  <MobileSidebar
    isOpen={$sidebarOpen}
    currentPath={$page.url.pathname}
    onClose={sidebarOpen.close}
  />

  <!-- Main Content Area -->
  <div class="main-content">
    <!-- Header (visible en mobile/tablet) -->
    <Header
      user={data.session?.user}
      userProfile={data.userProfile}
      onToggleSidebar={sidebarOpen.toggle}
    />

		<!-- Content Area (aquí se renderiza el <slot /> del layout padre) -->
		<main class="content">
			<div class="content-wrapper">
				<slot />
			</div>
		</main>
  </div>
</div>

<!-- Estilos globales para dropdowns -->
<svelte:head>
  <style>
    .dropdown {
      z-index: calc(var(--z-fixed) + 10) !important;
    }
  </style>
</svelte:head>

<style lang="scss">
  @use "$lib/styles/mixins" as *;

  /* ===========================
	 * App Layout Container
	 * ===========================
	 * Contenedor horizontal con altura fija
	 * para que el scroll sea solo en main-content
	 */
  .app-layout {
    display: flex;
    height: 100vh; // Altura fija = viewport
    // overflow: hidden; // REMOVIDO: Cortaba los modales
    background: var(--bg-secondary);
  }

  /* ===========================
	 * Main Content Area
	 * ===========================
	 * Ocupa espacio restante y permite scroll interno
	 */
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    // overflow: hidden; // REMOVIDO: Cortaba los modales
  }

	/* ===========================
	 * Content Area (Main)
	 * ===========================
	 * Aquí va el scroll - solo esta sección hace scroll
	 */
	.content {
		flex: 1;
		overflow-y: auto; // Solo esta sección tiene scroll
		padding: var(--space-6);
		
		@include responsive(md-down) {
			padding: var(--space-4);
		}
	}
	
	/* ===========================
	 * Content Wrapper
	 * ===========================
	 * Contenedor simple, sin restricciones de ancho
	 * Cada página puede definir su propio max-width si lo necesita
	 */
	.content-wrapper {
		// Sin max-width - full width disponible
	}
</style>

<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import Spinner from "$lib/components/ui/Spinner.svelte";

  import { dev } from "$app/environment";
  import { injectAnalytics } from "@vercel/analytics/sveltekit";
  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";

  injectAnalytics({ mode: dev ? "development" : "production" });
  injectSpeedInsights();

  onMount(() => {
    // Redirect to dashboard (hooks will redirect to login if not authenticated)
    goto("/dashboard");
  });
</script>

<div class="loading-container">
  <Spinner size="lg" />
  <p>Cargando...</p>
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    gap: var(--space-4);

    p {
      color: var(--text-secondary);
      margin: 0;
    }
  }
</style>

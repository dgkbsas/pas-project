<script lang="ts">
	import { onMount } from 'svelte';
	
	let {
		hasMore = true,
		onLoadMore,
		threshold = 200
	}: {
		hasMore?: boolean;
		onLoadMore: () => void;
		threshold?: number;
	} = $props();
	
	let loading = $state(false);
	let sentinel: HTMLDivElement;
	
	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (entry.isIntersecting && hasMore && !loading) {
					loading = true;
					onLoadMore();
					// Reset loading después de un tiempo para permitir otra carga
					setTimeout(() => {
						loading = false;
					}, 500);
				}
			},
			{
				rootMargin: `${threshold}px`,
				threshold: 0.1
			}
		);
		
		if (sentinel) {
			observer.observe(sentinel);
		}
		
		return () => {
			if (sentinel) {
				observer.unobserve(sentinel);
			}
		};
	});
</script>

<div bind:this={sentinel} class="infinite-scroll-sentinel">
	{#if hasMore}
		<div class="loading-indicator">
			<div class="spinner"></div>
			<span>Cargando más...</span>
		</div>
	{/if}
</div>

<style>
	.infinite-scroll-sentinel {
		width: 100%;
		padding: var(--space-4) 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.loading-indicator {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--text-secondary);
		font-size: var(--text-sm);
	}
	
	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--border-primary);
		border-top-color: var(--primary-600);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}
	
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

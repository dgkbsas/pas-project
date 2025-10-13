<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let tabs: Array<{ id: string; label: string; disabled?: boolean }> = [];
	export let activeTab: string = '';
	export let variant: 'line' | 'enclosed' = 'line';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let fullWidth = false;
	
	const dispatch = createEventDispatcher<{ change: string }>();
	
	function selectTab(tabId: string) {
		if (tabs.find(t => t.id === tabId)?.disabled) return;
		activeTab = tabId;
		dispatch('change', tabId);
	}
</script>

<div class="tabs" class:full-width={fullWidth} data-variant={variant} data-size={size}>
	<div class="tabs-list" role="tablist">
		{#each tabs as tab}
			<button
				type="button"
				role="tab"
				class="tab"
				class:active={activeTab === tab.id}
				class:disabled={tab.disabled}
				aria-selected={activeTab === tab.id}
				disabled={tab.disabled}
				on:click={() => selectTab(tab.id)}
			>
				{tab.label}
			</button>
		{/each}
	</div>
	
	<div class="tabs-content" role="tabpanel">
		<slot />
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.tabs {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.tabs-list {
		display: flex;
		gap: var(--space-1);
		border-bottom: 2px solid var(--border-primary);
		overflow-x: auto;
		
		&::-webkit-scrollbar {
			height: 4px;
		}
		
		&::-webkit-scrollbar-thumb {
			background: var(--border-secondary);
			border-radius: var(--radius-full);
		}
	}
	
	.full-width .tabs-list {
		width: 100%;
		
		.tab {
			flex: 1;
		}
	}
	
	.tab {
		position: relative;
		padding: var(--space-3) var(--space-4);
		border: none;
		background: transparent;
		color: var(--text-secondary);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		white-space: nowrap;
		cursor: pointer;
		transition: all var(--transition-fast);
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
		
		&:hover:not(.disabled) {
			color: var(--primary-600);
			background: var(--primary-50);
		}
		
		&.active {
			color: var(--primary-600);
			border-bottom-color: var(--primary-600);
		}
		
		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
	
	.tabs[data-variant="enclosed"] {
		.tabs-list {
			border-bottom: none;
			gap: var(--space-2);
		}
		
		.tab {
			border: 1px solid var(--border-primary);
			border-radius: var(--radius-md) var(--radius-md) 0 0;
			margin-bottom: 0;
			
			&.active {
				background: var(--bg-primary);
				border-bottom-color: var(--bg-primary);
			}
		}
	}
	
	.tabs[data-size="sm"] .tab {
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-xs);
	}
	
	.tabs[data-size="lg"] .tab {
		padding: var(--space-4) var(--space-6);
		font-size: var(--text-base);
	}
	
	.tabs-content {
		width: 100%;
	}
	
	@media (max-width: 768px) {
		.tab {
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-xs);
		}
	}
</style>

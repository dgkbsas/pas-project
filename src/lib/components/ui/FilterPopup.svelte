<script lang="ts">
	import { Filter, X } from 'lucide-svelte';
	import { clickOutside } from '$lib/directives/clickOutside';
	
	interface Props {
		open?: boolean;
		activeFiltersCount?: number;
		onClose?: () => void;
		children?: any;
	}
	
	let { open = $bindable(false), activeFiltersCount = 0, onClose, children }: Props = $props();
	
	function toggle() {
		open = !open;
	}
	
	function handleClose() {
		open = false;
		onClose?.();
	}
	
	function handleClickOutside() {
		if (open) {
			handleClose();
		}
	}
</script>

<div class="filter-popup" use:clickOutside={handleClickOutside}>
	<button 
		class="filter-trigger" 
		class:active={open || activeFiltersCount > 0}
		onclick={toggle}
		title="Filtros"
		aria-label="Abrir filtros"
	>
		<Filter size={18} />
		{#if activeFiltersCount > 0}
			<span class="filter-badge">{activeFiltersCount}</span>
		{/if}
	</button>
	
	{#if open}
		<div class="filter-dropdown">
			<div class="filter-header">
				<span class="filter-title">Filtros</span>
				<button 
					class="close-btn" 
					onclick={handleClose}
					aria-label="Cerrar"
				>
					<X size={16} />
				</button>
			</div>
			<div class="filter-content">
				{@render children?.()}
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.filter-popup {
		position: relative;
	}
	
	.filter-trigger {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		padding: var(--space-2);
		background: var(--bg-primary);
		border: 1px solid var(--border-primary);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		height: 38px;
		width: 38px;
		
		&:hover {
			background: var(--bg-secondary);
			border-color: var(--border-hover);
			color: var(--text-primary);
		}
		
		&.active {
			background: var(--primary-light);
			border-color: var(--primary);
			color: var(--primary);
		}
	}
	
	.filter-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 18px;
		height: 18px;
		padding: 0 4px;
		background: var(--primary);
		color: white;
		font-size: 10px;
		font-weight: var(--font-bold);
		border-radius: 9px;
		line-height: 1;
	}
	
	.filter-dropdown {
		position: absolute;
		top: calc(100% + 4px);
		right: 0;
		min-width: 280px;
		background: var(--bg-primary);
		border: 1px solid var(--border-primary);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		z-index: 1000;
		animation: slideDown 0.2s ease;
	}
	
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.filter-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--border-primary);
	}
	
	.filter-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--text-primary);
	}
	
	.close-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.2s ease;
		
		&:hover {
			background: var(--bg-secondary);
			color: var(--text-primary);
		}
	}
	
	.filter-content {
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}
</style>

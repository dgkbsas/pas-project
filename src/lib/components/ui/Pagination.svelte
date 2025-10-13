<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let currentPage = 1;
	export let totalPages = 1;
	export let totalItems = 0;
	export let itemsPerPage = 10;
	export let siblingCount = 1;
	export let showInfo = true;
	
	const dispatch = createEventDispatcher<{ change: number }>();
	
	$: startItem = (currentPage - 1) * itemsPerPage + 1;
	$: endItem = Math.min(currentPage * itemsPerPage, totalItems);
	
	function goToPage(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		dispatch('change', page);
	}
	
	function getPageNumbers() {
		const pages: (number | string)[] = [];
		const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
		const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
		
		const showLeftDots = leftSiblingIndex > 2;
		const showRightDots = rightSiblingIndex < totalPages - 1;
		
		// Always show first page
		if (totalPages > 0) pages.push(1);
		
		// Show dots if there's a gap
		if (showLeftDots) pages.push('...');
		
		// Show pages around current page
		for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
			if (i !== 1 && i !== totalPages) {
				pages.push(i);
			}
		}
		
		// Show dots if there's a gap
		if (showRightDots) pages.push('...');
		
		// Always show last page
		if (totalPages > 1) pages.push(totalPages);
		
		return pages;
	}
	
	$: pageNumbers = getPageNumbers();
</script>

<div class="pagination">
	{#if showInfo && totalItems > 0}
		<div class="pagination-info">
			Mostrando <span class="font-semibold">{startItem}</span> a 
			<span class="font-semibold">{endItem}</span> de 
			<span class="font-semibold">{totalItems}</span> resultados
		</div>
	{/if}
	
	<div class="pagination-controls">
		<button
			type="button"
			class="pagination-btn"
			disabled={currentPage === 1}
			on:click={() => goToPage(currentPage - 1)}
			aria-label="Página anterior"
		>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
		
		{#each pageNumbers as page}
			{#if typeof page === 'number'}
				<button
					type="button"
					class="pagination-btn page-number"
					class:active={page === currentPage}
					on:click={() => goToPage(page)}
					aria-label="Ir a página {page}"
					aria-current={page === currentPage ? 'page' : undefined}
				>
					{page}
				</button>
			{:else}
				<span class="pagination-dots">...</span>
			{/if}
		{/each}
		
		<button
			type="button"
			class="pagination-btn"
			disabled={currentPage === totalPages}
			on:click={() => goToPage(currentPage + 1)}
			aria-label="Página siguiente"
		>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.pagination {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}
	
	.pagination-info {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		
		.font-semibold {
			font-weight: var(--font-semibold);
			color: var(--text-primary);
		}
	}
	
	.pagination-controls {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	
	.pagination-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		height: 36px;
		padding: var(--space-2);
		border: 1px solid var(--border-primary);
		border-radius: var(--radius-md);
		background: var(--bg-primary);
		color: var(--text-secondary);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all var(--transition-fast);
		
		&:hover:not(:disabled) {
			background: var(--primary-50);
			color: var(--primary-600);
			border-color: var(--primary-200);
		}
		
		&.active {
			background: var(--primary-600);
			color: white;
			border-color: var(--primary-600);
			
			&:hover {
				background: var(--primary-700);
				border-color: var(--primary-700);
			}
		}
		
		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}
		
		&:focus-visible {
			@include focus-ring;
		}
	}
	
	.pagination-dots {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 36px;
		height: 36px;
		color: var(--text-tertiary);
		font-weight: var(--font-bold);
		user-select: none;
	}
	
	@media (max-width: 640px) {
		.pagination-info {
			font-size: var(--text-xs);
		}
		
		.pagination-btn {
			min-width: 32px;
			height: 32px;
			font-size: var(--text-xs);
		}
		
		.pagination-dots {
			min-width: 32px;
			height: 32px;
		}
	}
</style>

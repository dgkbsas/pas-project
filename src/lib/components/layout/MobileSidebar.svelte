<script lang="ts">
	import { FileText, X } from 'lucide-svelte';
	import Navigation from './Navigation.svelte';
	
	let { 
		isOpen = false,
		currentPath,
		onClose 
	} = $props<{ 
		isOpen: boolean;
		currentPath: string;
		onClose: () => void;
	}>();
</script>

{#if isOpen}
	<button class="sidebar-overlay" onclick={onClose} aria-label="Close sidebar"></button>
{/if}

<aside class="sidebar-mobile" class:open={isOpen}>
	<div class="sidebar-header">
		<div class="logo">
			<FileText size={32} />
			<span>PAS Manager</span>
		</div>
		<button class="close-button" onclick={onClose}>
			<X size={24} />
		</button>
	</div>
	
	<Navigation {currentPath} />
</aside>

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.sidebar-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: calc(var(--z-fixed) - 1);
		border: none;
		padding: 0;
		cursor: pointer;
		
		@include responsive(lg-up) {
			display: none;
		}
	}
	
	.sidebar-mobile {
		width: 260px;
		background: var(--bg-primary);
		display: flex;
		flex-direction: column;
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		z-index: var(--z-fixed);
		transform: translateX(-100%);
		transition: transform var(--transition-base);
		
		&.open {
			transform: translateX(0);
		}
		
		@include responsive(lg-up) {
			display: none;
		}
	}
	
	.sidebar-header {
		padding: var(--space-6) var(--space-4);
		border-bottom: 1px solid var(--border-primary);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	.logo {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		color: var(--primary-600);
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
	}
	
	.close-button {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		
		&:hover {
			background: var(--bg-secondary);
			color: var(--text-primary);
		}
	}
</style>

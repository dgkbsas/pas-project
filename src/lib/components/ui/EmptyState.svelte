<script lang="ts">
	import type { ComponentType } from 'svelte';
	
	interface Props {
		icon?: ComponentType;
		title: string;
		description?: string;
		action?: {
			label: string;
			onclick: () => void;
		};
		class?: string;
		children?: any;
	}
	
	let {
		icon,
		title,
		description,
		action,
		class: className = '',
		children
	}: Props = $props();
</script>

<div class="empty-state {className}">
	{#if icon}
		{@const Icon = icon}
		<div class="empty-state-icon">
			<Icon size={48} />
		</div>
	{/if}

	<h3 class="empty-state-title">{title}</h3>
	
	{#if description}
		<p class="empty-state-description">{description}</p>
	{/if}
	
	{#if action}
		<button class="empty-state-action" onclick={action.onclick}>
			{action.label}
		</button>
	{/if}
	
	{#if children}
		<div class="empty-state-children">
			{@render children()}
		</div>
	{/if}
</div>

<style lang="scss">
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-12) var(--space-4);
		text-align: center;
		color: var(--text-secondary);
	}
	
	.empty-state-icon {
		margin-bottom: var(--space-4);
		color: var(--text-tertiary);
	}
	
	.empty-state-title {
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--text-primary);
		margin: 0 0 var(--space-2);
	}
	
	.empty-state-description {
		font-size: var(--text-base);
		color: var(--text-secondary);
		margin: 0 0 var(--space-6);
		max-width: 400px;
	}
	
	.empty-state-action {
		padding: var(--space-2) var(--space-4);
		background: var(--primary-600);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all var(--transition-fast);
		
		&:hover {
			background: var(--primary-700);
			transform: translateY(-1px);
			box-shadow: var(--shadow-md);
		}
		
		&:active {
			transform: translateY(0);
		}
	}
	
	.empty-state-children {
		margin-top: var(--space-4);
	}
</style>

<script lang="ts">
	import { navigationItems } from '$lib/config/navigation';
	
	let { currentPath } = $props<{ currentPath: string }>();
</script>

<nav class="sidebar-nav">
	{#each navigationItems as item}
		{@const Icon = item.icon}
		<a
			href={item.href}
			class="nav-item"
			class:active={currentPath.startsWith(item.href)}
		>
			<Icon size={20} />
			<span>{item.name}</span>
		</a>
	{/each}
</nav>

<style lang="scss">
	.sidebar-nav {
		flex: 1;
		padding: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		overflow-y: auto;
	}
	
	.nav-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		color: var(--text-secondary);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		text-decoration: none;
		transition: all var(--transition-fast);
		
		&:hover {
			background: var(--bg-secondary);
			color: var(--text-primary);
		}
		
		&.active {
			background: var(--primary-50);
			color: var(--primary-700);
			
			:global([data-theme="dark"]) & {
				background: rgba(139, 92, 246, 0.1);
				color: var(--primary-400);
			}
		}
	}
</style>

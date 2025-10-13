<script lang="ts">
	interface Props {
		variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
		class?: string;
		children?: any;
	}
	
	let {
		variant = 'default',
		class: className = '',
		children
	}: Props = $props();
</script>

<span class="badge badge-{variant} {className}">
	{@render children?.()}
</span>

<style lang="scss">
	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.125rem 0.625rem;
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		border-radius: var(--radius-full);
		white-space: nowrap;
		
		&.badge-default {
			background: var(--neutral-100);
			color: var(--neutral-700);
		}
		
		&.badge-success {
			background: var(--success-50);
			color: var(--success-700);
		}
		
		&.badge-warning {
			background: var(--warning-50);
			color: var(--warning-700);
		}
		
		&.badge-error {
			background: var(--error-50);
			color: var(--error-700);
		}
		
		&.badge-info {
			background: var(--info-50);
			color: var(--info-700);
		}
	}
	
	/* svelte-ignore css-unused-selector */
	:global([data-theme="dark"]) .badge.badge-default {
		background: var(--neutral-800);
		color: var(--neutral-300);
	}
</style>

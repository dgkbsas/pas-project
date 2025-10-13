<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	
	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		loading?: boolean;
		children?: any;
	}
	
	let {
		variant = 'primary',
		size = 'md',
		loading = false,
		class: className = '',
		disabled,
		children,
		...rest
	}: Props = $props();
</script>

<button
	class="btn btn-{variant} btn-{size} {className}"
	disabled={disabled || loading}
	{...rest}
>
	{#if loading}
		<span class="spinner"></span>
	{/if}
	{@render children?.()}
</button>

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.btn {
		@include button-base;
		
		&.btn-primary {
			background: var(--primary-600);
			color: white;
			
			&:hover:not(:disabled) {
				background: var(--primary-700);
				transform: translateY(-1px);
				box-shadow: var(--shadow-md);
			}
			
			&:active:not(:disabled) {
				transform: translateY(0);
			}
		}
		
		&.btn-secondary {
			background: var(--neutral-200);
			color: var(--text-primary);
			
			&:hover:not(:disabled) {
				background: var(--neutral-300);
			}
		}
		
		&.btn-outline {
			background: transparent;
			color: var(--primary-600);
			border: 1px solid var(--border-primary);
			
			&:hover:not(:disabled) {
				background: var(--primary-50);
				border-color: var(--primary-600);
			}
		}
		
		&.btn-ghost {
			background: transparent;
			color: var(--text-primary);
			
			&:hover:not(:disabled) {
				background: var(--neutral-100);
			}
		}
		
		&.btn-danger {
			background: var(--error-500);
			color: white;
			
			&:hover:not(:disabled) {
				background: var(--error-700);
			}
		}
		
		&.btn-sm {
			padding: var(--space-1) var(--space-3);
			font-size: var(--text-sm);
		}
		
		&.btn-md {
			padding: var(--space-2) var(--space-4);
			font-size: var(--text-base);
		}
		
		&.btn-lg {
			padding: var(--space-3) var(--space-6);
			font-size: var(--text-lg);
		}
	}
	
	.spinner {
		display: inline-block;
		width: 14px;
		height: 14px;
		border: 2px solid currentColor;
		border-radius: 50%;
		border-top-color: transparent;
		animation: spin 0.6s linear infinite;
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>

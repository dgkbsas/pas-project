<script lang="ts">
	interface Props {
		variant?: 'info' | 'success' | 'warning' | 'error';
		title?: string;
		class?: string;
		children?: any;
	}
	
	let {
		variant = 'info',
		title,
		class: className = '',
		children
	}: Props = $props();
	
	const icons = {
		info: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
		</svg>`,
		success: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M6 10L9 13L14 7M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>`,
		warning: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M10 6V10M10 14H10.01M8.27 2.73L1.73 14.55C0.77 16.26 2.01 18.39 4.01 18.39H15.99C17.99 18.39 19.23 16.26 18.27 14.55L11.73 2.73C10.77 1.02 9.23 1.02 8.27 2.73Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
		</svg>`,
		error: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
			<path d="M6 6L14 14M6 14L14 6M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
		</svg>`
	};
</script>

<div class="alert alert-{variant} {className}" role="alert">
	<div class="alert-icon">
		{@html icons[variant]}
	</div>
	<div class="alert-content">
		{#if title}
			<div class="alert-title">{title}</div>
		{/if}
		{#if children}
			<div class="alert-message">
				{@render children()}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.alert {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--radius-md);
		border: 1px solid;
		
		&.alert-info {
			background: var(--info-50);
			border-color: var(--info-500);
			color: var(--info-700);
			
			.alert-icon {
				color: var(--info-500);
			}
		}
		
		&.alert-success {
			background: var(--success-50);
			border-color: var(--success-500);
			color: var(--success-700);
			
			.alert-icon {
				color: var(--success-500);
			}
		}
		
		&.alert-warning {
			background: var(--warning-50);
			border-color: var(--warning-500);
			color: var(--warning-700);
			
			.alert-icon {
				color: var(--warning-500);
			}
		}
		
		&.alert-error {
			background: var(--error-50);
			border-color: var(--error-500);
			color: var(--error-700);
			
			.alert-icon {
				color: var(--error-500);
			}
		}
	}
	
	.alert-icon {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.alert-content {
		flex: 1;
		min-width: 0;
	}
	
	.alert-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-1);
	}
	
	.alert-message {
		font-size: var(--text-sm);
		line-height: var(--leading-normal);
	}
	
	// Dark mode adjustments - @TODO: Implement when dark mode is active
	/* svelte-ignore css-unused-selector */
	:global([data-theme="dark"]) .alert.alert-info {
		background: rgba(59, 130, 246, 0.1);
		border-color: rgba(59, 130, 246, 0.3);
		color: #93c5fd;
	}
	
	/* svelte-ignore css-unused-selector */
	:global([data-theme="dark"]) .alert.alert-success {
		background: rgba(16, 185, 129, 0.1);
		border-color: rgba(16, 185, 129, 0.3);
		color: #6ee7b7;
	}
	
	/* svelte-ignore css-unused-selector */
	:global([data-theme="dark"]) .alert.alert-warning {
		background: rgba(245, 158, 11, 0.1);
		border-color: rgba(245, 158, 11, 0.3);
		color: #fcd34d;
	}
	
	/* svelte-ignore css-unused-selector */
	:global([data-theme="dark"]) .alert.alert-error {
		background: rgba(239, 68, 68, 0.1);
		border-color: rgba(239, 68, 68, 0.3);
		color: #fca5a5;
	}
</style>

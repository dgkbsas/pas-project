<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	
	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		label?: string;
		description?: string;
		children?: any;
	}
	
	let {
		label,
		description,
		class: className = '',
		id,
		checked = $bindable(false),
		children,
		...rest
	}: Props = $props();
	
	const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="checkbox-wrapper {className}">
	<div class="checkbox-container">
		<input
			{id}
			type="checkbox"
			class="checkbox"
			bind:checked
			{...rest}
		/>
		<svg class="checkmark" width="12" height="12" viewBox="0 0 12 12" fill="none">
			<path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	</div>
	
	{#if label || children}
		<label for={inputId} class="label-wrapper">
			{#if label}
				<span class="label">{label}</span>
			{/if}
			{#if children}
				{@render children()}
			{/if}
			{#if description}
				<span class="description">{description}</span>
			{/if}
		</label>
	{/if}
</div>

<style lang="scss">
	.checkbox-wrapper {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
	}
	
	.checkbox-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	
	.checkbox {
		width: 20px;
		height: 20px;
		appearance: none;
		border: 2px solid var(--border-primary);
		border-radius: var(--radius-sm);
		background: var(--bg-primary);
		cursor: pointer;
		transition: all var(--transition-fast);
		
		&:hover {
			border-color: var(--primary-500);
		}
		
		&:focus {
			outline: none;
			border-color: var(--primary-500);
			box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
		}
		
		&:checked {
			background: var(--primary-600);
			border-color: var(--primary-600);
			
			& + .checkmark {
				opacity: 1;
				transform: scale(1);
			}
		}
		
		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
	
	.checkmark {
		position: absolute;
		pointer-events: none;
		color: white;
		opacity: 0;
		transform: scale(0.8);
		transition: all var(--transition-fast);
	}
	
	.label-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		cursor: pointer;
	}
	
	.label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--text-primary);
		line-height: var(--leading-snug);
	}
	
	.description {
		font-size: var(--text-sm);
		color: var(--text-secondary);
		line-height: var(--leading-normal);
	}
</style>

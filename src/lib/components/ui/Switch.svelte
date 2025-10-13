<script lang="ts">
	interface Props {
		checked?: boolean;
		disabled?: boolean;
		label?: string;
		class?: string;
		onchange?: (checked: boolean) => void;
	}
	
	let {
		checked = $bindable(false),
		disabled = false,
		label,
		class: className = '',
		onchange
	}: Props = $props();
	
	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	class="switch-wrapper {className}"
	class:disabled
	onclick={toggle}
	{disabled}
>
	{#if label}
		<span class="switch-label">{label}</span>
	{/if}
	<div class="switch" class:checked>
		<div class="switch-thumb"></div>
	</div>
</button>

<style lang="scss">
	.switch-wrapper {
		display: inline-flex;
		align-items: center;
		gap: var(--space-3);
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
		
		&.disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
	
	.switch-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--text-primary);
		user-select: none;
	}
	
	.switch {
		position: relative;
		width: 44px;
		height: 24px;
		background: var(--neutral-300);
		border-radius: var(--radius-full);
		transition: background-color var(--transition-base);
		flex-shrink: 0;
		
		&.checked {
			background: var(--primary-600);
		}
	}
	
	.switch-thumb {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background: white;
		border-radius: var(--radius-full);
		transition: transform var(--transition-base);
		box-shadow: var(--shadow-sm);
		
		.checked & {
			transform: translateX(20px);
		}
	}
</style>

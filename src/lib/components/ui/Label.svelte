<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';
	
	interface Props extends HTMLLabelAttributes {
		required?: boolean;
		children?: any;
	}
	
	let {
		required = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<label class="label {className}" {...rest}>
	{@render children?.()}
	{#if required}
		<span class="required">*</span>
	{/if}
</label>

<style lang="scss">
	.label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--text-primary);
		margin-bottom: var(--space-1);
	}
	
	.required {
		color: var(--error-500);
		margin-left: 0.25rem;
	}
</style>

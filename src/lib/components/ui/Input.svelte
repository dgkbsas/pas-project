<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'value'> {
		label?: string;
		value?: string | number | null;
		error?: boolean | string;
		inputRef?: HTMLInputElement;
		children?: any;
	}

	let {
		type = 'text',
		label,
		value = $bindable(''),
		error = false,
		inputRef = $bindable(),
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

{#if label}
	<label class="input-label">
		{label}
		<input
			{type}
			bind:value
			bind:this={inputRef}
			class="input {className}"
			class:error
			{...rest}
		/>
	</label>
{:else}
	<input
		{type}
		bind:value
		bind:this={inputRef}
		class="input {className}"
		class:error
		{...rest}
	/>
{/if}

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.input-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--text-primary);
		margin-bottom: var(--space-2);
	}

	.input {
		@include input-base;
	}
</style>

<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLSelectAttributes, 'value'> {
		label?: string;
		error?: string;
		options?: Array<{ value: string; label: string }>;
		value?: string;
		children?: any;
	}

	let {
		label,
		error,
		options = [],
		value = $bindable(''),
		class: className = '',
		id,
		children,
		...rest
	}: Props = $props();
	
	const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
</script>

{#if label}
	<label for={inputId} class="label">{label}</label>
{/if}

<select
	{id}
	class="select {className}"
	class:error
	bind:value
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		{#each options as option}
			<option value={option.value}>{option.label}</option>
		{/each}
	{/if}
</select>

{#if error}
	<span class="error-message">{error}</span>
{/if}

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--text-primary);
		margin-bottom: var(--space-1);
	}
	
	.select {
		@include input-base;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right var(--space-3) center;
		padding-right: var(--space-8);
		cursor: pointer;
		
		&:focus {
			@include input-focus;
		}
		
		&.error {
			@include input-error;
		}
		
		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
			background-color: var(--bg-tertiary);
		}
	}
	
	.error-message {
		display: block;
		margin-top: var(--space-1);
		font-size: var(--text-sm);
		color: var(--error-500);
	}
</style>

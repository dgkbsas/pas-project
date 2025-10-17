<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLTextareaAttributes, 'value'> {
		label?: string;
		value?: string | null;
		error?: boolean | string;
		textareaRef?: HTMLTextAreaElement;
		help?: string;
		children?: any;
	}

	let {
		label,
		value = $bindable(''),
		error = false,
		textareaRef = $bindable(),
		help,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

{#if label}
	<label class="textarea-label">
		{label}
		<textarea
			bind:value
			bind:this={textareaRef}
			class="textarea {className}"
			class:error
			{...rest}
		></textarea>
		{#if help}
			<span class="help-text">{help}</span>
		{/if}
		{#if error && typeof error === 'string'}
			<span class="error-text">{error}</span>
		{/if}
	</label>
{:else}
	<textarea
		bind:value
		bind:this={textareaRef}
		class="textarea {className}"
		class:error
		{...rest}
	></textarea>
	{#if help}
		<span class="help-text">{help}</span>
	{/if}
	{#if error && typeof error === 'string'}
		<span class="error-text">{error}</span>
	{/if}
{/if}

<style lang="scss">
	@use '$lib/styles/mixins' as *;

	.textarea-label {
		display: flex;
		flex-direction: column;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--text-primary);
		gap: var(--space-2);
	}

	.textarea {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--border-primary);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-family: inherit;
		color: var(--text-primary);
		background: var(--bg-primary);
		transition: all var(--transition-fast);
		resize: vertical;
		min-height: 80px;

		&::placeholder {
			color: var(--text-tertiary);
		}

		&:focus {
			outline: none;
			border-color: var(--primary-500);
			box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.08);
		}

		&:disabled {
			background: var(--bg-secondary);
			cursor: not-allowed;
			opacity: 0.6;
		}

		&.error {
			border-color: var(--error-500);

			&:focus {
				box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
			}
		}
	}

	.help-text {
		font-size: var(--text-xs);
		color: var(--text-tertiary);
		margin-top: calc(var(--space-1) * -1);
	}

	.error-text {
		font-size: var(--text-xs);
		color: var(--error-600);
		margin-top: calc(var(--space-1) * -1);
	}
</style>

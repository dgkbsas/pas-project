<script lang="ts">
	interface Props {
		class?: string;
		header?: any;
		footer?: any;
		children?: any;
	}
	
	let {
		class: className = '',
		header,
		footer,
		children
	}: Props = $props();
</script>

<div class="card {className}">
	{#if header}
		<div class="card-header">
			{@render header()}
		</div>
	{/if}
	
	<div class="card-body">
		{@render children?.()}
	</div>
	
	{#if footer}
		<div class="card-footer">
			{@render footer()}
		</div>
	{/if}
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.card {
		@include card;
	}
	
	.card-header {
		padding: var(--space-6);
		border-bottom: 1px solid var(--border-primary);
	}
	
	.card-body {
		padding: var(--space-6);
	}
	
	.card-footer {
		padding: var(--space-6);
		border-top: 1px solid var(--border-primary);
		background: var(--bg-secondary);
	}
</style>

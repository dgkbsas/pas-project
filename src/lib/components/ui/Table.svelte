<script lang="ts">
	interface Props {
		class?: string;
		children?: any;
	}
	
	let { class: className = '', children }: Props = $props();
</script>

<div class="table-container {className}">
	<table class="table">
		{@render children?.()}
	</table>
</div>

<style lang="scss">
	.table-container {
		width: 100%;
		overflow-x: auto;
		border: 1px solid var(--border-primary);
		border-radius: var(--radius-lg);
		background: var(--bg-primary);
	}
	
	.table {
		width: 100%;
		border-collapse: collapse;
		
		:global(thead) {
			background: var(--bg-secondary);
			border-bottom: 1px solid var(--border-primary);
		}
		
		:global(th) {
			padding: var(--space-3) var(--space-4);
			text-align: left;
			font-size: var(--text-sm);
			font-weight: var(--font-semibold);
			color: var(--text-primary);
			white-space: nowrap;
		}
		
		:global(tbody tr) {
			border-bottom: 1px solid var(--border-primary);
			transition: background-color var(--transition-fast);
			
			&:last-child {
				border-bottom: none;
			}
			
			&:hover {
				background: var(--bg-secondary);
			}
		}
		
		:global(td) {
			padding: var(--space-3) var(--space-4);
			font-size: var(--text-sm);
			color: var(--text-primary);
		}
		
		:global(.text-right) {
			text-align: right;
		}
		
		:global(.text-center) {
			text-align: center;
		}
	}
</style>

<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	}
	
	let {
		size = 'md',
		class: className = ''
	}: Props = $props();
</script>

<div class="spinner spinner-{size} {className}" role="status">
	<span class="sr-only">Cargando...</span>
</div>

<style lang="scss">
	.spinner {
		display: inline-block;
		border: 2px solid var(--neutral-200);
		border-top-color: var(--primary-600);
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
		
		&.spinner-sm {
			width: 16px;
			height: 16px;
			border-width: 2px;
		}
		
		&.spinner-md {
			width: 24px;
			height: 24px;
			border-width: 2px;
		}
		
		&.spinner-lg {
			width: 40px;
			height: 40px;
			border-width: 3px;
		}
	}
	
	@keyframes spin {
		to { transform: rotate(360deg); }
	}
</style>

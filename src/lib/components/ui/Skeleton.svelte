<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		circle?: boolean;
		class?: string;
	}
	
	let {
		width = '100%',
		height = '1rem',
		circle = false,
		class: className = ''
	}: Props = $props();
</script>

<div
	class="skeleton {className}"
	class:circle
	style="width: {width}; height: {height};"
></div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.skeleton {
		@include skeleton;
		border-radius: var(--radius-md);
		
		&.circle {
			border-radius: var(--radius-full);
		}
	}
</style>

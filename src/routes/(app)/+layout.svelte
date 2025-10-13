<script lang="ts">
	import AppLayout from '$lib/components/layout/AppLayout.svelte';
	
	let { data } = $props();
</script>

<AppLayout {data}>
	<slot />
</AppLayout>

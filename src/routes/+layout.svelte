<script lang="ts">
	import '../app.css';
	import { supabase } from '$lib/supabase';
	import { onMount } from 'svelte';
	import { invalidate } from '$app/navigation';
	import { Toaster } from 'svelte-sonner';
	import { theme } from '$lib/stores/theme';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	onMount(() => {
		// Listen for auth changes (login, logout, etc.)
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((event, session) => {
			// Invalidate all data when auth state changes
			if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
				invalidate('supabase:auth');
			}
		});

		return () => {
			subscription.unsubscribe();
		};
	});
</script>

{@render children()}

<!-- Toast Notifications -->
<Toaster
	position="top-right"
	expand={true}
	closeButton={true}
	richColors={true}
	theme={$theme === 'dark' ? 'dark' : 'light'}
/>

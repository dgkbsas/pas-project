<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import UserMenu from './UserMenu.svelte';
	import type { User } from '@supabase/supabase-js';
	
	interface UserProfile {
		full_name?: string;
		role?: string;
	}
	
	let { 
		user,
		userProfile,
		onToggleSidebar 
	} = $props<{ 
		user?: User;
		userProfile?: UserProfile;
		onToggleSidebar: () => void;
	}>();
</script>

<header class="header">
	<button class="menu-button" onclick={onToggleSidebar}>
		<Menu size={24} />
	</button>
	
	<div class="header-actions">
		<!-- Notificaciones: Descomentar cuando se implemente -->
		<!-- <button class="icon-button" title="Notificaciones">
			<Bell size={20} />
			<span class="notification-badge">3</span>
		</button> -->
		
		<div class="header-user-menu">
			<UserMenu {user} {userProfile} variant="header" />
		</div>
	</div>
</header>

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.header {
		height: 64px;
		background: var(--bg-primary);
		border-bottom: 1px solid var(--border-primary);
		display: none;
		align-items: center;
		justify-content: space-between;
		padding: 0 var(--space-6);
		position: sticky;
		top: 0;
		z-index: var(--z-sticky);
		
		@include responsive(lg-down) {
			display: flex;
		}
		
		@include responsive(md-down) {
			padding: 0 var(--space-4);
		}
	}
	
	.menu-button {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all var(--transition-fast);
		
		&:hover {
			background: var(--bg-secondary);
			color: var(--text-primary);
		}
		
		@include responsive(lg-up) {
			display: none;
		}
	}
	
	.header-actions {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}
	
	.header-user-menu {
		display: none;
		
		@include responsive(lg-down) {
			display: block;
		}
	}
	
</style>

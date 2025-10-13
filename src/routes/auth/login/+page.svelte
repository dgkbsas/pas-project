<script lang="ts">
	import { enhance } from '$app/forms';
	import { showToast } from '$lib/stores/notifications';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Label from '$lib/components/ui/Label.svelte';

	let { data, form } = $props();

	let email = $state('');
	let password = $state('');
	let loading = $state(false);

	// Si hay un error del form action, mostrarlo
	$effect(() => {
		if (form?.message) {
			showToast({
				type: 'error',
				message: form.message
			});
		}
	});
</script>

<div class="auth-container fade-in">
	<Card class="auth-card">
		{#snippet header()}
			<div class="header-content">
				<div class="logo">
					<span class="logo-icon">📋</span>
					<span class="logo-text">PAS Manager</span>
				</div>
				<h1>Iniciar Sesión</h1>
				<p class="subtitle">Accede a tu cuenta</p>
			</div>
		{/snippet}

		<form method="POST" action="?/login" 
			use:enhance={() => {
				loading = true;
				
				return async ({ result }) => {
					loading = false;
					
					if (result.type === 'redirect') {
						showToast({
							type: 'success',
							message: '¡Bienvenido!'
						});
						// La navegación se hace automáticamente
						await new Promise(resolve => setTimeout(resolve, 300));
						window.location.href = result.location || '/dashboard';
					}
				};
			}}
			class="form"
		>
			<div class="form-group">
				<Label for="email" required>Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					bind:value={email}
					placeholder="tu@email.com"
					disabled={loading}
					required
				/>
			</div>

			<div class="form-group">
				<Label for="password" required>Contraseña</Label>
				<Input
					id="password"
					name="password"
					type="password"
					bind:value={password}
					placeholder="••••••••"
					disabled={loading}
					required
				/>
			</div>

			<Button type="submit" class="w-full" {loading} disabled={loading}>
				{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
			</Button>
		</form>

		<div class="signup-link">
			¿No tienes cuenta? <a href="/auth/signup">Regístrate aquí</a>
		</div>
	</Card>
</div>

<style lang="scss">
	@use '$lib/styles/mixins' as *;
	
	.auth-container {
		min-height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%);
		padding: var(--space-4);
		
		@include mobile {
			padding: var(--space-3);
		}
	}

	:global(.auth-card) {
		width: 100%;
		max-width: 420px;
		box-shadow: var(--shadow-xl);
	}

	.header-content {
		text-align: center;
		
		.logo {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: var(--space-2);
			margin-bottom: var(--space-4);
			
			.logo-icon {
				font-size: var(--text-4xl);
			}
			
			.logo-text {
				font-size: var(--text-2xl);
				font-weight: var(--font-bold);
				color: var(--text-primary);
			}
		}
		
		h1 {
			margin: 0 0 var(--space-2) 0;
			font-size: var(--text-2xl);
		}
		
		.subtitle {
			color: var(--text-secondary);
			font-size: var(--text-sm);
			margin: 0;
		}
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	:global(.w-full) {
		width: 100%;
	}

	.signup-link {
		text-align: center;
		padding-top: var(--space-4);
		border-top: 1px solid var(--border-primary);
		color: var(--text-secondary);
		font-size: var(--text-sm);
		
		a {
			color: var(--primary-600);
			font-weight: var(--font-semibold);
			
			&:hover {
				color: var(--primary-700);
			}
		}
	}
</style>

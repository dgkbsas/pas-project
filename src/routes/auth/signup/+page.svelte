<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Spinner from '$lib/components/ui/Spinner.svelte';
	import { showToast } from '$lib/stores/notifications';
	import { onMount } from 'svelte';
	
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let companyName = $state('');
	let fullName = $state('');
	let loading = $state(false);
	let errors = $state<Record<string, string>>({});
	let invitationToken = $state<string | null>(null);
	let invitationData = $state<any>(null);
	let loadingInvitation = $state(false);
	let invitationError = $state<string | null>(null);
	
	// Verificar si hay un token de invitación en la URL
	onMount(async () => {
		const token = $page.url.searchParams.get('token');
		if (token) {
			invitationToken = token;
			await loadInvitation(token);
		}
	});
	
	async function loadInvitation(token: string) {
		loadingInvitation = true;
		invitationError = null;
		
		try {
			const response = await fetch('/api/invitations/validate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ token })
			});
			const data = await response.json();
			
			if (!response.ok) {
				invitationError = data.message || 'Invitación no válida';
				return;
			}
			
			if (!data.valid) {
				invitationError = data.message;
				return;
			}
			
			invitationData = data.invitation;
			email = invitationData.email;
		} catch (err: any) {
			invitationError = 'Error al cargar la invitación';
			console.error(err);
		} finally {
			loadingInvitation = false;
		}
	}
	
	function validateForm(): boolean {
		errors = {};
		
		if (!email) {
			errors.email = 'El email es requerido';
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.email = 'Email inválido';
		}
		
		if (!password) {
			errors.password = 'La contraseña es requerida';
		} else if (password.length < 6) {
			errors.password = 'La contraseña debe tener al menos 6 caracteres';
		}
		
		if (password !== confirmPassword) {
			errors.confirmPassword = 'Las contraseñas no coinciden';
		}
		
		if (!fullName) {
			errors.fullName = 'El nombre es requerido';
		}
		
		// Si no hay invitación, el nombre de la empresa es requerido
		if (!invitationToken && !companyName) {
			errors.companyName = 'El nombre de la empresa es requerido';
		}
		
		return Object.keys(errors).length === 0;
	}
	
	async function handleSignup() {
		if (!validateForm()) return;
		
		loading = true;
		
		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password,
					fullName,
					companyName: invitationToken ? undefined : companyName,
					invitationToken
				})
			});
			
			const data = await response.json();
			
			if (!response.ok) {
				showToast({
					type: 'error',
					message: data.message || 'Error al crear la cuenta'
				});
				return;
			}
			
			showToast({
				type: 'success',
				message: invitationToken 
					? 'Cuenta creada exitosamente. Iniciando sesión...' 
					: 'Cuenta creada exitosamente. Por favor verifica tu email.'
			});
			
			// Si hay invitación, iniciar sesión automáticamente
			if (invitationToken) {
				await goto('/dashboard');
			} else {
				await goto('/auth/login');
			}
		} catch (err: any) {
			showToast({
				type: 'error',
				message: 'Error al crear la cuenta'
			});
			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Crear Cuenta - PAS Manager</title>
</svelte:head>

<div class="signup-container">
	<div class="signup-wrapper">
		<div class="signup-header">
			<h1>Crear Cuenta</h1>
			{#if invitationData}
				<p class="invitation-message">
					Has sido invitado a unirte a <strong>{invitationData.company.name}</strong>
				</p>
			{:else}
				<p>Comienza a gestionar tus pólizas de seguros</p>
			{/if}
		</div>
		
		<Card>
			{#if loadingInvitation}
				<div class="loading-invitation">
					<Spinner size="lg" />
					<p>Verificando invitación...</p>
				</div>
			{:else if invitationError}
				<Alert variant="error" title="Error de Invitación">
					{invitationError}
				</Alert>
				<div class="divider"></div>
				<p class="text-center">
					¿No tienes una invitación? 
					<a href="/auth/signup" class="link">Crea una cuenta nueva</a>
				</p>
			{:else}
				<form onsubmit={(e) => { e.preventDefault(); handleSignup(); }}>
					{#if invitationData}
						<Alert variant="info" title="Invitación">
							Te registrarás como <strong>{invitationData.role}</strong> en {invitationData.company.name}
						</Alert>
						<div class="form-spacer"></div>
					{/if}
					
					<Input
						type="text"
						label="Nombre Completo"
						placeholder="Juan Pérez"
						bind:value={fullName}
						error={errors.fullName}
						required
						disabled={loading}
					/>
					
					<Input
						type="email"
						label="Email"
						placeholder="tu@email.com"
						bind:value={email}
						error={errors.email}
						required
						disabled={loading || !!invitationToken}
					/>
					
					{#if !invitationToken}
						<Input
							type="text"
							label="Nombre de la Empresa"
							placeholder="Mi Empresa S.A."
							bind:value={companyName}
							error={errors.companyName}
							required
							disabled={loading}
						/>
					{/if}
					
					<Input
						type="password"
						label="Contraseña"
						placeholder="••••••••"
						bind:value={password}
						error={errors.password}
						required
						disabled={loading}
					/>
					
					<Input
						type="password"
						label="Confirmar Contraseña"
						placeholder="••••••••"
						bind:value={confirmPassword}
						error={errors.confirmPassword}
						required
						disabled={loading}
					/>
					
					<Button
						type="submit"
						variant="primary"
						size="lg"
						{loading}
						class="submit-button"
					>
						{#if invitationToken}
							Aceptar Invitación y Crear Cuenta
						{:else}
							Crear Cuenta
						{/if}
					</Button>
				</form>
				
				<div class="divider"></div>
				
				<p class="login-link">
					¿Ya tienes una cuenta? 
					<a href="/auth/login" class="link">Inicia sesión</a>
				</p>
			{/if}
		</Card>
	</div>
</div>

<style lang="scss">
	.signup-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-4);
		background: linear-gradient(135deg, var(--primary-50) 0%, var(--bg-secondary) 100%);
	}
	
	.signup-wrapper {
		width: 100%;
		max-width: 480px;
	}
	
	.signup-header {
		text-align: center;
		margin-bottom: var(--space-6);
		
		h1 {
			font-size: var(--text-3xl);
			font-weight: var(--font-bold);
			color: var(--text-primary);
			margin: 0 0 var(--space-2);
		}
		
		p {
			font-size: var(--text-base);
			color: var(--text-secondary);
			margin: 0;
		}
		
		.invitation-message {
			font-size: var(--text-base);
			color: var(--text-primary);
			
			strong {
				color: var(--primary-600);
			}
		}
	}
	
	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}
	
	.form-spacer {
		height: var(--space-2);
	}

	:global(.submit-button) {
		width: 100%;
		margin-top: var(--space-2);
	}

	.divider {
		height: 1px;
		background: var(--border-primary);
		margin: var(--space-6) 0;
	}
	
	.login-link {
		text-align: center;
		font-size: var(--text-sm);
		color: var(--text-secondary);
		margin: 0;
	}
	
	.link {
		color: var(--primary-600);
		text-decoration: none;
		font-weight: var(--font-medium);
		transition: color var(--transition-fast);
		
		&:hover {
			color: var(--primary-700);
			text-decoration: underline;
		}
	}
	
	.loading-invitation {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-8) 0;
		
		p {
			font-size: var(--text-base);
			color: var(--text-secondary);
			margin: 0;
		}
	}
	
	.text-center {
		text-align: center;
		margin-top: var(--space-4);
	}
</style>

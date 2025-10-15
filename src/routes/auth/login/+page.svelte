<script lang="ts">
  import { enhance } from "$app/forms";
  import { showToast } from "$lib/stores/notifications";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import Label from "$lib/components/ui/Label.svelte";
  import { Eye, EyeOff } from "lucide-svelte";
  import logo from "$lib/assets/icons/logo.png";

  let { data, form } = $props();

  let email = $state("");
  let password = $state("");
  let loading = $state(false);
  let showPassword = $state(false);
  let errorMessage = $state("");

  // Si hay un error del form action, mostrarlo
  $effect(() => {
    if (form?.message) {
      errorMessage = form.message;
      showToast({
        type: "error",
        message: form.message,
      });
    }
  });
</script>

<div class="auth-container fade-in">
  <Card class="auth-card">
    {#snippet header()}
      <div class="header-content">
        <div class="logo">
          <img src={logo} alt="Logo" height="48" />
          <span class="logo-text">PAS Manager</span>
        </div>
        <p class="subtitle">Accede a tu cuenta</p>
      </div>
    {/snippet}

    <form
      method="POST"
      action="?/login"
      use:enhance={() => {
        loading = true;
        errorMessage = "";

        return async ({ result, update }) => {
          loading = false;

          if (result.type === "success" && result.data?.success) {
            showToast({
              type: "success",
              message: "¡Bienvenido!",
            });
            // Esperar para que las cookies se establezcan (especialmente en mobile/red local)
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Navegar al dashboard con recarga completa para asegurar cookies
            window.location.href = "/dashboard";
          } else if (result.type === "failure") {
            // Mostrar error también en el formulario (especialmente útil en mobile)
            errorMessage =
              (result.data?.message as string) || "Error al iniciar sesión";
          }
        };
      }}
      class="form"
    >
      {#if errorMessage}
        <div class="error-banner">
          <p>{errorMessage}</p>
        </div>
      {/if}

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
        <div class="password-input-wrapper">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            bind:value={password}
            placeholder="••••••••"
            disabled={loading}
            required
            class="password-input"
          />
          <button
            type="button"
            class="password-toggle"
            onclick={() => (showPassword = !showPassword)}
            aria-label={showPassword
              ? "Ocultar contraseña"
              : "Mostrar contraseña"}
          >
            {#if showPassword}
              <EyeOff size={18} />
            {:else}
              <Eye size={18} />
            {/if}
          </button>
        </div>
      </div>

      <Button type="submit" class="w-full" {loading} disabled={loading}>
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  </Card>
</div>

<style lang="scss">
  .auth-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(
      to right bottom,
      #faf7ff,
      #e2cfff,
      #caa7ff,
      #b17eff,
      #9652ff
    );
    padding: var(--space-4);

    @include mobile {
      padding: var(--space-3);
      align-items: flex-start;
      padding-top: var(--space-12);
    }
  }

  :global(.auth-card) {
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow-xl);
    /* From https://css.glass */
    background: rgba(255, 255, 255, 0.48) !important;
    border-radius: 16px !important;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
    backdrop-filter: blur(9.5px) !important;
    -webkit-backdrop-filter: blur(9.5px) !important;
    border: 1px solid rgba(255, 255, 255, 0.53) !important;

    @include mobile {
      box-shadow: var(--shadow-lg);
    }
  }

  .header-content {
    text-align: center;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      margin-bottom: var(--space-4);

      .logo-text {
        font-size: var(--text-2xl);
        font-weight: var(--font-bold);
        color: var(--text-primary);
      }
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

  .password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  :global(.password-input) {
    padding-right: var(--space-10);
  }

  .password-toggle {
    position: absolute;
    right: var(--space-3);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: var(--space-2);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);

    &:hover {
      color: var(--text-primary);
      background: var(--bg-secondary);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--primary-200);
    }
  }

  .error-banner {
    padding: var(--space-3) var(--space-4);
    background: var(--error-50);
    border: 1px solid var(--error-200);
    border-radius: var(--radius-md);

    p {
      margin: 0;
      color: var(--error-700);
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      text-align: center;
    }

    @include mobile {
      padding: var(--space-4);

      p {
        font-size: var(--text-base);
      }
    }
  }

  :global(.w-full) {
    width: 100%;
  }

  @media (max-width: 768px) {
    .header-content {
      .logo-text {
        font-size: var(--text-xl);
      }
    }
  }
</style>

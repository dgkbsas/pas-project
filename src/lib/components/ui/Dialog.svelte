<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  interface Props {
    open?: boolean;
    title?: string;
    description?: string;
    size?: "sm" | "md" | "lg" | "xl";
    onClose?: () => void;
    children?: any;
  }

  let {
    open = $bindable(false),
    title,
    description,
    size = "md",
    onClose,
    children,
  }: Props = $props();

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  function handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape" && open) {
      close();
    }
  }

  function close() {
    open = false;
    onClose?.();
  }
</script>

<svelte:window onkeydown={handleEscape} />

{#if open}
  <div
    class="dialog-backdrop"
    onclick={handleBackdropClick}
    transition:fade={{ duration: 200 }}
    role="presentation"
  >
    <div
      class="dialog dialog-{size}"
      transition:scale={{ duration: 200, easing: quintOut, start: 0.95 }}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      {#if title || description}
        <div class="dialog-header">
          {#if title}
            <h2 class="dialog-title">{title}</h2>
          {/if}
          {#if description}
            <p class="dialog-description">{description}</p>
          {/if}
          <button
            type="button"
            class="dialog-close"
            onclick={close}
            aria-label="Cerrar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 5L15 15M5 15L15 5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      {/if}

      <div class="dialog-content">
        {@render children?.()}
      </div>
    </div>
  </div>
{/if}

<style lang="scss">
  .dialog-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-4);
    z-index: var(--z-modal);
  }

  .dialog {
    background: var(--bg-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &.dialog-sm {
      max-width: 400px;
    }

    &.dialog-md {
      max-width: 500px;
    }

    &.dialog-lg {
      max-width: 700px;
    }

    &.dialog-xl {
      max-width: 900px;
    }
  }

  .dialog-header {
    position: relative;
    padding: var(--space-6);
    border-bottom: 1px solid var(--border-primary);
  }

  .dialog-title {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin: 0;
    padding-right: var(--space-8);
  }

  .dialog-description {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin: var(--space-2) 0 0;
    line-height: var(--leading-normal);
  }

  .dialog-close {
    position: absolute;
    top: var(--space-6);
    right: var(--space-6);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: var(--text-secondary);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }
  }

  .dialog-content {
    padding: var(--space-6);
    overflow-y: auto;
    flex: 1;
  }
</style>

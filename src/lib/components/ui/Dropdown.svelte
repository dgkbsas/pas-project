<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { quintOut } from "svelte/easing";

	interface Props {
		open?: boolean;
		align?: 'left' | 'right';
		position?: 'top' | 'bottom';
		class?: string;
		trigger?: any;
		children?: any;
	}

	let {
		open = $bindable(false),
		align = 'right',
		position = 'bottom',
		class: className = '',
		trigger,
		children
	}: Props = $props();

  let dropdownElement: HTMLDivElement;

  function toggle() {
    open = !open;
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      open &&
      dropdownElement &&
      !dropdownElement.contains(event.target as Node)
    ) {
      open = false;
    }
  }

  function handleEscape(event: KeyboardEvent) {
    if (event.key === "Escape" && open) {
      open = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} onkeydown={handleEscape} />

<div class="dropdown {className}" bind:this={dropdownElement}>
  <button
    type="button"
    class="dropdown-trigger"
    onclick={toggle}
    aria-haspopup="true"
    aria-expanded={open}
  >
    {#if trigger}
      {@render trigger()}
    {/if}
  </button>

  {#if open}
    <div
      class="dropdown-menu dropdown-menu-{align} dropdown-menu-{position}"
      transition:scale={{
        duration: 150,
        easing: quintOut,
        start: 0.95,
        opacity: 0,
      }}
    >
      {@render children?.()}
    </div>
  {/if}
</div>

<style lang="scss">
  .dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .dropdown-trigger {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
    width: 100%;

    &:focus {
      outline: none;
    }
  }

  .dropdown-menu {
    position: absolute;
    min-width: 200px;
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    padding: var(--space-2);
    z-index: var(--z-dropdown);

    // Alineación horizontal
    &.dropdown-menu-right {
      right: 0;
    }

    &.dropdown-menu-left {
      left: 0;
    }

    // Posición vertical
    &.dropdown-menu-bottom {
      top: calc(100% + 4px); // Aparece abajo del trigger
    }

    &.dropdown-menu-top {
      bottom: calc(100% + 4px); // Aparece arriba del trigger
    }
  }

  :global(.dropdown-item) {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: var(--text-sm);
    text-align: left;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
    }

    &:focus {
      outline: none;
      background: var(--bg-secondary);
    }

  }

  /* svelte-ignore css-unused-selector */
  :global(.dropdown-item[data-danger="true"]) {
    color: var(--error-500);
  }

  /* svelte-ignore css-unused-selector */
  :global(.dropdown-item[data-danger="true"]:hover) {
    background: var(--error-50);
  }

  :global(.dropdown-divider) {
    height: 1px;
    background: var(--border-primary);
    margin: var(--space-2) 0;
  }
</style>

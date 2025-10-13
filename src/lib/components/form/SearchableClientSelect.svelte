<script lang="ts">
  import { onMount } from "svelte";
  import { Search, X, ExternalLink } from "lucide-svelte";
  import { debounce } from "$lib/utils";

  interface ClientOption {
    value: string;
    label: string;
    email?: string;
    document?: string;
  }

  interface Props {
    value: string;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
  }

  let {
    value = $bindable(""),
    placeholder = "Buscar cliente...",
    error = "",
    required = false,
    disabled = false,
    onValueChange,
  }: Props = $props();

  let searchQuery = $state("");
  let options = $state<ClientOption[]>([]);
  let isOpen = $state(false);
  let loading = $state(false);
  let selectedOption = $state<ClientOption | null>(null);
  let inputRef: HTMLInputElement;

  // Fetch client by ID on mount if value is provided
  onMount(async () => {
    if (value) {
      await fetchClientById(value);
    }
  });

  // Watch for external value changes
  $effect(() => {
    if (value && !selectedOption) {
      fetchClientById(value);
    } else if (!value && selectedOption) {
      selectedOption = null;
      searchQuery = "";
    }
  });

  async function fetchClientById(clientId: string) {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (response.ok) {
        const result = await response.json();
        const client = result.client;
        if (client) {
          selectedOption = {
            value: client.id,
            label: `${client.first_name} ${client.last_name}`,
            email: client.email_primary,
            document: client.document_number,
          };
          searchQuery = selectedOption.label;
        }
      }
    } catch (err) {
      console.error("Error fetching client:", err);
    }
  }

  async function searchClients(query: string) {
    if (!query || query.length < 2) {
      options = [];
      return;
    }

    loading = true;
    try {
      const response = await fetch(
        `/api/clients/search?q=${encodeURIComponent(query)}&limit=20`
      );
      if (response.ok) {
        const result = await response.json();
        options = result.options || [];
      } else {
        options = [];
      }
    } catch (err) {
      console.error("Error searching clients:", err);
      options = [];
    } finally {
      loading = false;
    }
  }

  const debouncedSearch = debounce((query: string) => {
    searchClients(query);
  }, 300);

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    searchQuery = target.value;

    // Clear selection if user types after selecting
    if (selectedOption && searchQuery !== selectedOption.label) {
      selectedOption = null;
      value = "";
      onValueChange?.("");
    }

    debouncedSearch(searchQuery);
    isOpen = true;
  }

  function selectOption(option: ClientOption) {
    selectedOption = option;
    searchQuery = option.label;
    value = option.value;
    isOpen = false;
    onValueChange?.(option.value);
  }

  function clearSelection() {
    selectedOption = null;
    searchQuery = "";
    value = "";
    options = [];
    isOpen = false;
    onValueChange?.("");
    inputRef?.focus();
  }

  function handleFocus() {
    if (searchQuery && !selectedOption) {
      debouncedSearch(searchQuery);
      isOpen = true;
    }
  }

  function handleBlur() {
    // Delay to allow click on option
    setTimeout(() => {
      isOpen = false;
    }, 200);
  }
</script>

<div class="searchable-select" class:error={!!error} class:disabled>
  <div class="input-wrapper">
    <div class="icon-left">
      <Search size={18} />
    </div>

    <input
      bind:this={inputRef}
      type="text"
      value={searchQuery}
      oninput={handleInput}
      onfocus={handleFocus}
      onblur={handleBlur}
      {placeholder}
      {required}
      {disabled}
      autocomplete="off"
    />

    {#if selectedOption}
      <button
        type="button"
        class="clear-btn"
        onclick={clearSelection}
        title="Limpiar selección"
      >
        <X size={16} />
      </button>
    {/if}
  </div>

  {#if isOpen && (loading || options.length > 0)}
    <div class="dropdown">
      {#if loading}
        <div class="loading">Buscando...</div>
      {:else}
        {#each options as option}
          <button
            type="button"
            class="option"
            onclick={() => selectOption(option)}
          >
            <div class="option-main">
              <span class="option-label">{option.label}</span>
              {#if option.email}
                <span class="option-meta">{option.email}</span>
              {/if}
            </div>
            {#if option.document}
              <span class="option-document">{option.document}</span>
            {/if}
          </button>
        {/each}
      {/if}
    </div>
  {/if}

  {#if isOpen && !loading && options.length === 0 && searchQuery.length >= 2}
    <div class="dropdown">
      <div class="no-results">
        <p>No se encontraron clientes</p>
        <a href="/clientes/nuevo" target="_blank" class="create-link">
          <ExternalLink size={14} />
          Crear nuevo cliente
        </a>
      </div>
    </div>
  {/if}

  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  {#if !selectedOption}
    <div class="help-text">
      Si el cliente no existe, <a href="/clientes/nuevo" target="_blank"
        >créalo primero</a
      >
    </div>
  {/if}
</div>

<style lang="scss">
  .searchable-select {
    position: relative;
    width: 100%;
  }

  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .icon-left {
    position: absolute;
    left: var(--space-3);
    color: var(--text-tertiary);
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  input {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    padding-left: 36px;
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: all var(--transition-fast);

    &::placeholder {
      color: var(--text-tertiary);
    }

    &:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }

    &:disabled {
      background: var(--bg-secondary);
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  .clear-btn {
    position: absolute;
    right: var(--space-3);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: var(--text-tertiary);
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);

    &:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    right: 0;
    max-height: 300px;
    overflow-y: auto;
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }

  .loading {
    padding: var(--space-4);
    text-align: center;
    color: var(--text-secondary);
    font-size: var(--text-sm);
  }

  .option {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-3) var(--space-4);
    border: none;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background var(--transition-fast);
    border-bottom: 1px solid var(--border-primary);

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: var(--bg-secondary);
    }
  }

  .option-main {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1;
  }

  .option-label {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-primary);
  }

  .option-meta {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .option-document {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    font-family: monospace;
  }

  .no-results {
    padding: var(--space-4);
    text-align: center;

    p {
      margin: 0 0 var(--space-2);
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }
  }

  .create-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    color: var(--primary-600);
    font-size: var(--text-sm);
    text-decoration: none;
    transition: color var(--transition-fast);

    &:hover {
      color: var(--primary-700);
      text-decoration: underline;
    }
  }

  .error-message {
    margin-top: var(--space-1);
    color: var(--error-600);
    font-size: var(--text-xs);
  }

  .help-text {
    margin-top: var(--space-1);
    color: var(--text-tertiary);
    font-size: var(--text-xs);

    a {
      color: var(--primary-600);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .error input {
    border-color: var(--error-500);

    &:focus {
      border-color: var(--error-600);
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }

  .disabled {
    opacity: 0.6;
    pointer-events: none;
  }
</style>

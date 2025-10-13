<script lang="ts">
  import { onMount } from 'svelte';
  import Input from '$lib/components/ui/Input.svelte';

  interface AddressComponents {
    street: string;
    streetNumber: string;
    floor: string;
    apartment: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  }

  interface Props {
    value?: string;
    street?: string;
    streetNumber?: string;
    floor?: string;
    apartment?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    onAddressSelect?: (address: AddressComponents) => void;
  }

  let {
    value = $bindable(''),
    street = $bindable(''),
    streetNumber = $bindable(''),
    floor = $bindable(''),
    apartment = $bindable(''),
    city = $bindable(''),
    province = $bindable(''),
    postalCode = $bindable(''),
    country = $bindable(''),
    placeholder = 'Ingrese dirección',
    error,
    disabled = false,
    onAddressSelect
  }: Props = $props();

  let suggestions = $state<any[]>([]);
  let showSuggestions = $state(false);
  let loading = $state(false);
  let searchTimeout: number;

  async function searchAddress(query: string) {
    if (query.length < 3) {
      suggestions = [];
      showSuggestions = false;
      return;
    }

    loading = true;
    try {
      // Nominatim API - OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: query,
          format: 'json',
          addressdetails: '1',
          countrycodes: 'ar', // Restringir a Argentina
          limit: '5'
        }),
        {
          headers: {
            'Accept-Language': 'es-AR,es;q=0.9'
          }
        }
      );

      if (response.ok) {
        const results = await response.json();
        suggestions = results;
        showSuggestions = results.length > 0;
      }
    } catch (err) {
      console.error('Error searching address:', err);
      suggestions = [];
    } finally {
      loading = false;
    }
  }

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    value = target.value;

    // Debounce
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchAddress(value);
    }, 300);
  }

  function selectAddress(result: any) {
    const addr = result.address || {};
    
    // Parse components from Nominatim result
    const components: AddressComponents = {
      street: addr.road || '',
      streetNumber: addr.house_number || '',
      floor: '',
      apartment: '',
      city: addr.city || addr.town || addr.village || '',
      province: addr.state || '',
      postalCode: addr.postcode || '',
      country: addr.country || ''
    };

    // Update bound values
    value = result.display_name;
    street = components.street;
    streetNumber = components.streetNumber;
    city = components.city;
    province = components.province;
    postalCode = components.postalCode;
    country = components.country;

    // Close suggestions
    showSuggestions = false;
    suggestions = [];

    // Call callback if provided
    if (onAddressSelect) {
      onAddressSelect(components);
    }
  }

  function handleBlur() {
    // Delay to allow click on suggestion
    setTimeout(() => {
      showSuggestions = false;
    }, 200);
  }

  onMount(() => {
    return () => {
      clearTimeout(searchTimeout);
    };
  });
</script>

<div class="address-autocomplete-nominatim">
  <div class="search-container">
    <Input
      bind:value
      {placeholder}
      {error}
      {disabled}
      autocomplete="off"
      oninput={handleInput}
      onblur={handleBlur}
      onfocus={() => value.length >= 3 && suggestions.length > 0 && (showSuggestions = true)}
    />
    
    {#if loading}
      <div class="loading-indicator">Buscando...</div>
    {/if}

    {#if showSuggestions && suggestions.length > 0}
      <div class="suggestions-dropdown">
        {#each suggestions as suggestion}
          <button
            type="button"
            class="suggestion-item"
            onclick={() => selectAddress(suggestion)}
          >
            <div class="suggestion-main">
              {suggestion.address?.road || suggestion.address?.suburb || ''}
              {#if suggestion.address?.house_number}
                {suggestion.address.house_number}
              {/if}
            </div>
            <div class="suggestion-detail">
              {suggestion.address?.city || suggestion.address?.town || ''}
              {#if suggestion.address?.state}
                , {suggestion.address.state}
              {/if}
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <div class="help-text">
    💡 Autocompletado gratuito con OpenStreetMap. Los datos pueden no ser exactos, verifica y corrige si es necesario.
  </div>

  <div class="address-fields-grid">
    <div class="field-group">
      <label for="street">Calle</label>
      <Input
        id="street"
        bind:value={street}
        placeholder="Nombre de la calle"
        disabled={disabled}
      />
    </div>

    <div class="field-group">
      <label for="streetNumber">Número</label>
      <Input
        id="streetNumber"
        bind:value={streetNumber}
        placeholder="1234"
        disabled={disabled}
      />
    </div>

    <div class="field-group">
      <label for="floor">Piso</label>
      <Input
        id="floor"
        bind:value={floor}
        placeholder="5"
        disabled={disabled}
      />
    </div>

    <div class="field-group">
      <label for="apartment">Depto</label>
      <Input
        id="apartment"
        bind:value={apartment}
        placeholder="A"
        disabled={disabled}
      />
    </div>

    <div class="field-group">
      <label for="city">Ciudad</label>
      <Input
        id="city"
        bind:value={city}
        placeholder="Ciudad"
        disabled={disabled}
      />
    </div>

    <div class="field-group">
      <label for="province">Provincia</label>
      <Input
        id="province"
        bind:value={province}
        placeholder="Provincia"
        disabled={disabled}
      />
    </div>

    <div class="field-group">
      <label for="postalCode">Código Postal</label>
      <Input
        id="postalCode"
        bind:value={postalCode}
        placeholder="1234"
        disabled={disabled}
      />
    </div>
  </div>
</div>

<style lang="scss">
  .address-autocomplete-nominatim {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .search-container {
    position: relative;
  }

  .loading-indicator {
    position: absolute;
    right: var(--space-3);
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--text-xs);
    color: var(--text-tertiary);
    pointer-events: none;
  }

  .suggestions-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: var(--space-1);
    background: var(--bg-primary);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
  }

  .suggestion-item {
    width: 100%;
    padding: var(--space-3);
    border: none;
    background: none;
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

    &:focus {
      outline: none;
      background: var(--bg-secondary);
    }
  }

  .suggestion-main {
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-primary);
    margin-bottom: var(--space-1);
  }

  .suggestion-detail {
    font-size: var(--text-xs);
    color: var(--text-secondary);
  }

  .help-text {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }

  .address-fields-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-3);

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .field-group {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);

    label {
      font-size: var(--text-sm);
      font-weight: var(--font-medium);
      color: var(--text-primary);
    }

    // Adjust grid spans for better layout
    &:nth-child(1) { // Calle
      grid-column: span 2;

      @media (max-width: 640px) {
        grid-column: span 1;
      }
    }
    
    &:nth-child(5) { // Ciudad
      grid-column: span 2;

      @media (max-width: 640px) {
        grid-column: span 1;
      }
    }

    &:nth-child(6) { // Provincia
      grid-column: span 2;

      @media (max-width: 640px) {
        grid-column: span 1;
      }
    }
  }
</style>

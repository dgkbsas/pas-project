<script lang="ts">
  interface Props {
    value?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
  }

  let {
    value = $bindable(""),
    error,
    disabled = false,
    required = false,
  }: Props = $props();

  let areaCode = $state("");
  let phoneNumber = $state("");

  // Parse initial value if provided
  $effect(() => {
    if (value && value.startsWith("+54 9")) {
      const parts = value.replace("+54 9 ", "").split(" ");
      if (parts.length >= 2) {
        areaCode = parts[0];
        phoneNumber = parts.slice(1).join("");
      }
    }
  });

  // Update value when area code or phone number changes
  function updateValue() {
    if (areaCode && phoneNumber) {
      value = `+54 9 ${areaCode} ${phoneNumber}`;
    } else if (areaCode) {
      value = `+54 9 ${areaCode}`;
    } else {
      value = "";
    }
  }

  function handleAreaCodeInput(e: Event) {
    const target = e.target as HTMLInputElement;
    // Solo números, máximo 4 dígitos
    areaCode = target.value.replace(/\D/g, "").slice(0, 4);
    updateValue();
  }

  function handlePhoneInput(e: Event) {
    const target = e.target as HTMLInputElement;
    // Solo números, máximo 8 dígitos (7 en algunos casos)
    phoneNumber = target.value.replace(/\D/g, "").slice(0, 8);
    updateValue();
  }
</script>

<div class="phone-input-argentina" class:has-error={error}>
  <div class="input-group">
    <span class="prefix">+54 9</span>
    <input
      type="text"
      class="area-code-input"
      placeholder="11"
      bind:value={areaCode}
      oninput={handleAreaCodeInput}
      {disabled}
      {required}
      maxlength="4"
    />
    <input
      type="text"
      class="phone-number-input"
      placeholder="1234-5678"
      bind:value={phoneNumber}
      oninput={handlePhoneInput}
      {disabled}
      {required}
      maxlength="8"
    />
  </div>
  {#if error}
    <span class="error-message">{error}</span>
  {/if}
  <div class="help-text">Formato: +54 9 [código de área] [número]</div>
</div>

<style lang="scss">
  .phone-input-argentina {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .input-group {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--border-primary);
    border-radius: var(--radius-md);
    background: var(--bg-primary);
    transition: all var(--transition-fast);

    &:focus-within {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
    }
  }

  .has-error .input-group {
    border-color: var(--error-600);

    &:focus-within {
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }
  }

  .prefix {
    font-size: var(--text-sm);
    color: var(--text-secondary);
    font-weight: var(--font-medium);
    white-space: nowrap;
  }

  .area-code-input,
  .phone-number-input {
    border: none;
    background: none;
    padding: 0;
    font-size: var(--text-sm);
    color: var(--text-primary);
    outline: none;
    font-family: inherit;

    &::placeholder {
      color: var(--text-tertiary);
    }

    &:disabled {
      color: var(--text-tertiary);
      cursor: not-allowed;
    }
  }

  .area-code-input {
    width: 50px;
    border-right: 1px solid var(--border-primary);
    padding-right: var(--space-2);
  }

  .phone-number-input {
    flex: 1;
    min-width: 0;
  }

  .error-message {
    font-size: var(--text-xs);
    color: var(--error-600);
  }

  .help-text {
    font-size: var(--text-xs);
    color: var(--text-tertiary);
  }
</style>

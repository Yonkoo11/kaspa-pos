<script lang="ts">
  import { kasPrice, startPayment, refreshPrice, merchantAddress, error, payments } from '../stores/pos'
  import { usdToKas, kasToUsd } from '../lib/kaspa/price'
  import { onMount } from 'svelte'

  export let onShowHistory: () => void = () => {}

  let inputMode: 'usd' | 'kas' = 'usd'
  let displayValue = ''
  let showSettings = false
  let addressInput = ''
  let loading = false

  $: numericValue = parseFloat(displayValue) || 0
  $: kasAmount = inputMode === 'usd' ? usdToKas(numericValue, $kasPrice) : numericValue
  $: usdAmount = inputMode === 'kas' ? kasToUsd(numericValue, $kasPrice) : numericValue
  $: hasValue = numericValue > 0
  $: canCharge = kasAmount > 0 && $merchantAddress && !loading

  onMount(() => {
    refreshPrice()
    addressInput = $merchantAddress
  })

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && showSettings) {
      showSettings = false
    }
  }

  function pressKey(key: string) {
    if (key === 'CLR') {
      displayValue = ''
      return
    }
    if (key === '.' && displayValue.includes('.')) return
    if (key === '.' && !displayValue) {
      displayValue = '0.'
      return
    }
    const parts = displayValue.split('.')
    if (parts[1] && parts[1].length >= (inputMode === 'usd' ? 2 : 8)) return
    displayValue += key
  }

  function backspace() {
    displayValue = displayValue.slice(0, -1)
  }

  async function charge() {
    if (kasAmount <= 0) return
    loading = true
    await startPayment(kasAmount, usdAmount)
    loading = false
  }

  function saveAddress() {
    merchantAddress.set(addressInput.trim())
    showSettings = false
  }

  function toggleMode() {
    inputMode = inputMode === 'usd' ? 'kas' : 'usd'
    displayValue = ''
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'CLR']
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="terminal-layout">
  <!-- Header -->
  <div class="header-bar">
    <div class="header-brand">
      <span class="brand-kaspa">KASPA</span><span class="brand-dot">.</span><span class="brand-pos">POS</span>
    </div>
    <div class="header-actions">
      {#if $payments.length > 0}
        <button
          onclick={onShowHistory}
          class="icon-btn hover-text-primary"
          aria-label="Transaction history"
        >
          <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      {/if}
      <button
        onclick={() => { showSettings = !showSettings; if (showSettings) addressInput = $merchantAddress }}
        class="icon-btn hover-text-primary"
        aria-label="Settings"
      >
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Status strip -->
  <div class="status-strip">
    <div class="status-left">
      <div class="status-dot"></div>
      <span class="status-text">LIVE</span>
    </div>
    <div class="status-right">
      <span class="status-price">KAS ${$kasPrice.toFixed(4)}</span>
    </div>
  </div>

  <!-- Settings Panel -->
  {#if showSettings}
    <div class="settings-panel">
      <label for="merchant-address" class="settings-label">Merchant Kaspa Address</label>
      <input
        id="merchant-address"
        type="text"
        bind:value={addressInput}
        placeholder="kaspa:qr..."
        class="settings-input"
      />
      <button
        onclick={saveAddress}
        class="settings-save hover-opacity-90"
      >
        Save Address
      </button>
    </div>
  {/if}

  <!-- Amount Display -->
  <div class="amount-zone" class:amount-zone-active={hasValue}>
    <div class="amount-zone-glow"></div>
    <div class="amount-content">
      <button onclick={toggleMode} class="currency-toggle hover-text-secondary">
        {inputMode === 'usd' ? 'US DOLLAR' : 'KASPA'}
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      </button>

      <div class="amount-display">
        {#if inputMode === 'usd'}
          <span class="amount-prefix">$</span><span class="amount-hero" class:amount-hero-active={hasValue}>{displayValue || '0'}</span>
        {:else}
          <span class="amount-hero" class:amount-hero-active={hasValue}>{displayValue || '0'}</span>
          <span class="amount-suffix">KAS</span>
        {/if}
      </div>

      <div class="amount-conversion">
        {#if inputMode === 'usd'}
          <span class="conversion-value">{kasAmount.toFixed(2)} KAS</span>
        {:else}
          <span class="conversion-value">${usdAmount.toFixed(2)} USD</span>
        {/if}
      </div>
    </div>
    <div class="amount-line" class:amount-line-active={hasValue}></div>
  </div>

  {#if $error}
    <div class="error-bar">
      {$error}
    </div>
  {/if}

  <!-- Keypad + Actions -->
  <div class="keypad-zone">
    <div class="keypad">
      {#each keys as key}
        {#if key === 'CLR'}
          <button onclick={() => pressKey(key)} class="key key-action">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        {:else}
          <button onclick={() => pressKey(key)} class="key key-digit">
            {key}
          </button>
        {/if}
      {/each}
    </div>

    <!-- Backspace -->
    <button onclick={backspace} class="backspace-btn hover-text-secondary">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l7-7 11 0v14H10L3 12z" />
      </svg>
    </button>

    <!-- Charge Button -->
    <button
      onclick={charge}
      disabled={!canCharge}
      class="charge-btn"
      class:charge-btn-active={canCharge}
      class:charge-btn-disabled={!canCharge}
    >
      {#if loading}
        CONNECTING...
      {:else if !$merchantAddress}
        SET ADDRESS TO CONTINUE
      {:else if kasAmount <= 0}
        ENTER AMOUNT
      {:else}
        CHARGE {kasAmount.toFixed(2)} KAS
      {/if}
    </button>
  </div>
</div>

<style>
  .terminal-layout {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* ---- Header ---- */
  .header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 12px;
  }

  .header-brand {
    display: flex;
    align-items: center;
  }

  .brand-kaspa {
    font-family: var(--font-family-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-text-primary);
  }

  .brand-dot {
    font-family: var(--font-family-mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-tertiary);
  }

  .brand-pos {
    font-family: var(--font-family-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--color-accent);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 0;
  }

  .icon-btn {
    color: var(--color-text-tertiary);
    transition: color 0.15s ease;
    padding: 10px;
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
  }

  /* ---- Status Strip ---- */
  .status-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 12px;
    border-bottom: 1px solid var(--color-border);
  }

  .status-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .status-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-accent);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  .status-text {
    font-family: var(--font-family-mono);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.15em;
    color: var(--color-accent);
  }

  .status-right {
    display: flex;
    align-items: center;
  }

  .status-price {
    font-family: var(--font-family-mono);
    font-size: 10px;
    font-weight: 500;
    color: var(--color-text-tertiary);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.04em;
  }

  /* ---- Settings ---- */
  .settings-panel {
    margin: 0 20px 8px;
    padding: 16px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
  }

  .settings-label {
    display: block;
    font-family: var(--font-family-mono);
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-text-tertiary);
    margin-bottom: 8px;
  }

  .settings-input {
    width: 100%;
    background: var(--color-surface-2);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    color: var(--color-text-primary);
    font-family: var(--font-family-mono);
    font-size: 16px;
    transition: border-color 0.15s ease;
  }

  .settings-input::placeholder {
    color: var(--color-text-tertiary);
  }

  .settings-input:focus {
    outline: none;
    border-color: rgba(73, 234, 203, 0.4);
  }

  .settings-save {
    margin-top: 12px;
    width: 100%;
    background: var(--color-accent);
    color: #000;
    font-family: var(--font-family-mono);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    padding: 10px;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    min-height: 44px;
    transition: opacity 0.15s ease;
  }

  /* ---- Amount Zone ---- */
  .amount-zone {
    position: relative;
    flex: none;
    padding: 32px 20px 24px;
    transition: background 0.3s ease;
    overflow: hidden;
  }

  .amount-zone-glow {
    position: absolute;
    inset: 0;
    opacity: 0;
    background:
      radial-gradient(ellipse 300px 200px at 80% 30%, rgba(73, 234, 203, 0.12) 0%, transparent 70%);
    transition: opacity 0.5s ease;
    pointer-events: none;
  }

  .amount-zone-active .amount-zone-glow {
    opacity: 1;
  }

  .amount-content {
    position: relative;
    z-index: 1;
  }

  .currency-toggle {
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 500;
    transition: color 0.15s ease;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .amount-display {
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    min-height: 72px;
    font-variant-numeric: tabular-nums;
  }

  .amount-prefix {
    font-family: var(--font-family-serif);
    font-size: 42px;
    font-weight: 400;
    line-height: 1;
    color: var(--color-text-tertiary);
    margin-right: 2px;
  }

  .amount-hero {
    font-family: var(--font-family-serif);
    font-size: 56px;
    font-weight: 400;
    line-height: 1;
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
    transition: text-shadow 0.3s ease;
  }

  .amount-hero-active {
    text-shadow: 0 0 40px rgba(73, 234, 203, 0.15);
  }

  .amount-suffix {
    font-family: var(--font-family-mono);
    font-size: 16px;
    font-weight: 500;
    color: var(--color-accent);
    margin-left: 12px;
  }

  .amount-conversion {
    margin-top: 8px;
    text-align: right;
  }

  .conversion-value {
    font-family: var(--font-family-mono);
    font-size: 12px;
    color: var(--color-text-secondary);
    font-variant-numeric: tabular-nums;
  }

  .amount-line {
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    background: var(--color-border);
    transition: background 0.3s ease;
  }

  .amount-line-active {
    background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border) 100%);
  }

  /* ---- Error ---- */
  .error-bar {
    margin: 0 20px 8px;
    padding: 8px 12px;
    background: var(--color-surface);
    border: 1px solid rgba(255, 68, 68, 0.2);
    border-radius: var(--radius-sm);
    color: var(--color-danger);
    font-family: var(--font-family-mono);
    font-size: 12px;
  }

  /* ---- Keypad Zone ---- */
  .keypad-zone {
    flex: 1;
    padding: 12px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .keypad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    flex: 1;
  }

  .key {
    font-family: var(--font-family-mono);
    min-height: 52px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: background-color 0.1s ease, border-color 0.1s ease;
    background: var(--color-surface);
  }

  .key:active {
    background: var(--color-surface-2);
    border-color: var(--color-accent);
  }

  .key-digit {
    color: var(--color-text-primary);
    font-size: 20px;
    font-weight: 400;
  }

  .key-action {
    color: var(--color-text-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (hover: hover) {
    .key:hover {
      background: var(--color-surface-2);
      border-color: var(--color-border-light);
    }
  }

  /* ---- Backspace ---- */
  .backspace-btn {
    width: 100%;
    padding: 8px 0;
    color: var(--color-text-tertiary);
    transition: color 0.15s ease;
    font-family: var(--font-family-mono);
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-height: 44px;
    background: none;
    border: none;
    cursor: pointer;
  }

  /* ---- Charge Button ---- */
  .charge-btn {
    width: 100%;
    min-height: 56px;
    border-radius: var(--radius-sm);
    font-family: var(--font-family-mono);
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    transition: transform 0.15s ease, box-shadow 0.3s ease;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
  }

  .charge-btn:active {
    transform: scale(0.97);
  }

  .charge-btn-active {
    background: var(--color-accent);
    color: #000;
    box-shadow: 0 0 24px rgba(73, 234, 203, 0.2), 0 0 48px rgba(73, 234, 203, 0.08);
  }

  .charge-btn-disabled {
    background: var(--color-surface);
    color: var(--color-text-tertiary);
    border: 1px solid var(--color-border);
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (hover: hover) {
    .charge-btn-active:hover {
      box-shadow: 0 0 32px rgba(73, 234, 203, 0.3), 0 0 64px rgba(73, 234, 203, 0.12);
    }
  }
</style>

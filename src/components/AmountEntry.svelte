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

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="header-bar">
    <div class="flex items-center gap-0">
      <span class="font-mono text-xs font-semibold uppercase tracking-wide text-text-primary">KASPA</span><span class="font-mono text-xs font-semibold uppercase tracking-wide text-text-tertiary">.</span><span class="font-mono text-xs font-semibold uppercase tracking-wide text-accent">POS</span>
    </div>
    <div class="flex items-center gap-1">
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

  <!-- Settings Panel -->
  {#if showSettings}
    <div class="mx-5 mb-3 p-4 bg-surface border border-border rounded-[--radius-md]">
      <label for="merchant-address" class="block text-text-tertiary text-[10px] font-mono uppercase tracking-widest mb-2 font-medium">Merchant Kaspa Address</label>
      <input
        id="merchant-address"
        type="text"
        bind:value={addressInput}
        placeholder="kaspa:qr..."
        class="w-full bg-surface-2 border border-border rounded-[--radius-sm] px-3 py-2.5 text-text-primary text-base font-mono placeholder:text-text-tertiary focus:outline-none focus:border-accent/40 transition-[border-color] duration-150"
      />
      <button
        onclick={saveAddress}
        class="mt-3 w-full bg-accent text-black font-mono font-bold py-2.5 rounded-[--radius-sm] uppercase tracking-wide text-sm transition-[opacity] duration-150 hover-opacity-90 min-h-[44px]"
      >
        Save Address
      </button>
    </div>
  {/if}

  <!-- Amount Display -->
  <div class="amount-zone" class:amount-zone-active={hasValue}>
    <button onclick={toggleMode} class="currency-toggle hover-text-secondary">
      {inputMode === 'usd' ? 'US DOLLAR' : 'KASPA'}
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    </button>
    <div class="font-mono tabular-nums min-h-[4rem] flex items-baseline justify-end text-right">
      {#if inputMode === 'usd'}
        <span class="amount-prefix">$</span><span class="amount-value">{displayValue || '0'}</span>
      {:else}
        <span class="amount-value">{displayValue || '0'}</span>
        <span class="text-text-tertiary text-lg ml-3 font-normal font-mono">KAS</span>
      {/if}
    </div>
    <div class="text-text-secondary text-xs mt-2 font-mono tabular-nums text-right">
      {#if inputMode === 'usd'}
        {kasAmount.toFixed(2)} KAS
      {:else}
        ${usdAmount.toFixed(2)} USD
      {/if}
      <span class="text-text-tertiary ml-2">@ ${$kasPrice.toFixed(4)}</span>
    </div>
    <!-- Accent underline that grows with value -->
    <div class="amount-line" class:amount-line-active={hasValue}></div>
  </div>

  {#if $error}
    <div class="mx-5 mb-2 px-3 py-2 bg-surface border border-danger/20 rounded-[--radius-sm] text-danger text-sm font-mono">
      {$error}
    </div>
  {/if}

  <!-- Keypad -->
  <div class="flex-1 px-5 pb-5 flex flex-col gap-2">
    <div class="keypad">
      {#each keys as key}
        <button
          onclick={() => pressKey(key)}
          class="key {key === 'CLR' ? 'key-action' : 'key-digit'}"
        >
          {key}
        </button>
      {/each}
    </div>

    <!-- Backspace -->
    <button
      onclick={backspace}
      class="backspace-btn hover-text-secondary"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l7-7 11 0v14H10L3 12z" />
      </svg>
      Delete
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
  /* ---- Header ---- */
  .header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 12px;
    border-bottom: 1px solid var(--color-border);
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

  /* ---- Amount Zone ---- */
  .amount-zone {
    flex: none;
    padding: 24px 20px 20px;
    position: relative;
    transition: background 0.3s ease;
  }

  .amount-zone-active {
    background: linear-gradient(180deg, rgba(73, 234, 203, 0.03) 0%, transparent 100%);
  }

  .currency-toggle {
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 500;
    transition: color 0.15s ease;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
  }

  .amount-prefix {
    font-size: 48px;
    font-weight: 700;
    line-height: 1;
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
  }

  .amount-value {
    font-size: 48px;
    font-weight: 700;
    line-height: 1;
    color: var(--color-text-primary);
    font-family: var(--font-family-mono);
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

  /* ---- Keypad ---- */
  .keypad {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    flex: 1;
  }

  .key {
    font-family: var(--font-family-mono);
    min-height: 56px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: background-color 0.1s ease, border-color 0.1s ease;
    background: linear-gradient(180deg, var(--color-surface) 0%, rgba(17, 17, 17, 0.8) 100%);
  }

  .key:active {
    background: var(--color-border);
    border-color: var(--color-border-light);
  }

  .key-digit {
    color: var(--color-text-primary);
    font-size: 18px;
    font-weight: 500;
  }

  .key-action {
    color: var(--color-text-secondary);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
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
    padding: 12px 0;
    color: var(--color-text-tertiary);
    transition: color 0.15s ease;
    font-family: var(--font-family-mono);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
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
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    transition: transform 0.15s ease, box-shadow 0.3s ease;
    border: none;
    cursor: pointer;
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

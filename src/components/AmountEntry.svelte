<script lang="ts">
  import { kasPrice, startPayment, refreshPrice, merchantAddress, error } from '../stores/pos'
  import { usdToKas, kasToUsd } from '../lib/kaspa/price'
  import { onMount } from 'svelte'

  let inputMode: 'usd' | 'kas' = 'usd'
  let displayValue = ''
  let showSettings = false
  let addressInput = ''

  $: numericValue = parseFloat(displayValue) || 0
  $: kasAmount = inputMode === 'usd' ? usdToKas(numericValue, $kasPrice) : numericValue
  $: usdAmount = inputMode === 'kas' ? kasToUsd(numericValue, $kasPrice) : numericValue

  onMount(() => {
    refreshPrice()
    addressInput = $merchantAddress
  })

  function pressKey(key: string) {
    if (key === 'C') {
      displayValue = ''
      return
    }
    if (key === '.' && displayValue.includes('.')) return
    if (key === '.' && !displayValue) {
      displayValue = '0.'
      return
    }
    // Limit decimal places
    const parts = displayValue.split('.')
    if (parts[1] && parts[1].length >= (inputMode === 'usd' ? 2 : 8)) return
    displayValue += key
  }

  function backspace() {
    displayValue = displayValue.slice(0, -1)
  }

  function charge() {
    if (kasAmount <= 0) return
    startPayment(kasAmount, usdAmount)
  }

  function saveAddress() {
    merchantAddress.set(addressInput.trim())
    showSettings = false
  }

  function toggleMode() {
    inputMode = inputMode === 'usd' ? 'kas' : 'usd'
    displayValue = ''
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'C']
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="flex items-center justify-between px-4 pt-4 pb-2">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-kaspa-teal/20 flex items-center justify-center">
        <span class="text-kaspa-teal font-bold text-sm">K</span>
      </div>
      <span class="text-white/80 font-medium text-sm tracking-wide">KaspaPOS</span>
    </div>
    <button
      onclick={() => showSettings = !showSettings}
      class="text-white/40 hover:text-white/80 transition-colors p-2"
      aria-label="Settings"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  </div>

  <!-- Settings Panel -->
  {#if showSettings}
    <div class="mx-4 mb-3 p-4 bg-kaspa-surface rounded-xl border border-kaspa-border">
      <label for="merchant-address" class="block text-white/50 text-xs uppercase tracking-wider mb-2">Merchant Kaspa Address</label>
      <input
        id="merchant-address"
        type="text"
        bind:value={addressInput}
        placeholder="kaspa:qr..."
        class="w-full bg-kaspa-dark border border-kaspa-border rounded-lg px-3 py-2.5 text-white/90 text-sm font-mono placeholder:text-white/20 focus:outline-none focus:border-kaspa-teal/50 transition-colors"
      />
      <button
        onclick={saveAddress}
        class="mt-3 w-full bg-kaspa-teal/20 hover:bg-kaspa-teal/30 text-kaspa-teal font-medium py-2 rounded-lg transition-colors text-sm"
      >
        Save Address
      </button>
    </div>
  {/if}

  <!-- Amount Display -->
  <div class="flex-none px-4 py-6">
    <button onclick={toggleMode} class="text-white/40 text-xs uppercase tracking-wider hover:text-white/60 transition-colors mb-1">
      {inputMode === 'usd' ? 'USD' : 'KAS'} &darr;
    </button>
    <div class="text-5xl font-bold text-white tracking-tight font-mono tabular-nums min-h-[3.5rem]">
      {#if inputMode === 'usd'}
        <span class="text-white/30">$</span>{displayValue || '0'}
      {:else}
        {displayValue || '0'} <span class="text-white/30 text-2xl">KAS</span>
      {/if}
    </div>
    <div class="text-white/40 text-sm mt-1 font-mono">
      {#if inputMode === 'usd'}
        {kasAmount.toFixed(2)} KAS
      {:else}
        ${usdAmount.toFixed(2)} USD
      {/if}
      <span class="text-white/20 ml-2">@ ${$kasPrice.toFixed(4)}</span>
    </div>
  </div>

  {#if $error}
    <div class="mx-4 mb-2 px-3 py-2 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
      {$error}
    </div>
  {/if}

  <!-- Keypad -->
  <div class="flex-1 px-4 pb-4 flex flex-col gap-2">
    <div class="grid grid-cols-3 gap-2 flex-1">
      {#each keys as key}
        <button
          onclick={() => pressKey(key)}
          class="rounded-xl text-xl font-medium transition-all active:scale-95
            {key === 'C'
              ? 'bg-white/5 text-white/50 hover:bg-white/10'
              : 'bg-kaspa-surface hover:bg-kaspa-surface/80 text-white border border-kaspa-border/50'
            }"
        >
          {key}
        </button>
      {/each}
    </div>

    <!-- Backspace -->
    <button
      onclick={backspace}
      class="w-full py-3 rounded-xl bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 transition-all text-sm"
    >
      &larr; Delete
    </button>

    <!-- Charge Button -->
    <button
      onclick={charge}
      disabled={kasAmount <= 0 || !$merchantAddress}
      class="w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-[0.98]
        {kasAmount > 0 && $merchantAddress
          ? 'bg-kaspa-teal text-kaspa-dark hover:brightness-110 shadow-lg shadow-kaspa-teal/20'
          : 'bg-white/5 text-white/20 cursor-not-allowed'
        }"
    >
      {#if !$merchantAddress}
        Set Address to Continue
      {:else if kasAmount <= 0}
        Enter Amount
      {:else}
        Charge {kasAmount.toFixed(2)} KAS
      {/if}
    </button>
  </div>
</div>

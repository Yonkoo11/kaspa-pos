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
  <div class="flex items-center justify-between px-5 pt-5 pb-3">
    <div class="flex items-center gap-2.5">
      <div class="w-7 h-7 rounded-[--radius-sm] bg-kaspa-teal/15 flex items-center justify-center">
        <span class="text-kaspa-teal font-bold text-xs">K</span>
      </div>
      <span class="text-l3 font-medium text-sm tracking-wide">KaspaPOS</span>
    </div>
    <div class="flex items-center gap-1">
    {#if $payments.length > 0}
    <button
      onclick={onShowHistory}
      class="text-l4 hover:text-l2 transition-[color] duration-150 p-2"
      aria-label="Transaction history"
    >
      <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
    {/if}
    <button
      onclick={() => { showSettings = !showSettings; if (showSettings) addressInput = $merchantAddress }}
      class="text-l4 hover:text-l2 transition-[color] duration-150 p-2"
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
    <div class="mx-5 mb-3 p-4 glass rounded-[--radius-md]">
      <label for="merchant-address" class="block text-l4 text-[11px] uppercase tracking-[0.08em] mb-2 font-medium">Merchant Kaspa Address</label>
      <input
        id="merchant-address"
        type="text"
        bind:value={addressInput}
        placeholder="kaspa:qr..."
        class="w-full bg-white/[0.03] border border-white/[0.06] rounded-[--radius-sm] px-3 py-2.5 text-l1 text-base font-mono placeholder:text-l5 focus:outline-none focus:border-kaspa-teal/40 transition-[border-color] duration-150"
      />
      <button
        onclick={saveAddress}
        class="mt-3 w-full bg-kaspa-teal/15 hover:bg-kaspa-teal/25 text-kaspa-teal font-medium py-2.5 rounded-[--radius-sm] transition-[background-color] duration-150 text-sm"
      >
        Save Address
      </button>
    </div>
  {/if}

  <!-- Amount Display -->
  <div class="flex-none px-5 pt-4 pb-6">
    <button onclick={toggleMode} class="text-l4 text-[11px] uppercase tracking-[0.08em] font-medium hover:text-l3 transition-[color] duration-150 mb-2 flex items-center gap-1.5">
      {inputMode === 'usd' ? 'US DOLLAR' : 'KASPA'}
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    </button>
    <div class="font-mono tabular-nums min-h-[5rem] flex items-baseline">
      {#if inputMode === 'usd'}
        <span class="text-l4 text-[56px] font-extralight leading-none tracking-tight">$</span><span class="text-l1 text-[72px] font-extralight leading-none tracking-tighter">{displayValue || '0'}</span>
      {:else}
        <span class="text-l1 text-[72px] font-extralight leading-none tracking-tighter">{displayValue || '0'}</span>
        <span class="text-l4 text-lg ml-3 font-normal">KAS</span>
      {/if}
    </div>
    <div class="text-l3 text-sm mt-3 font-mono tabular-nums">
      {#if inputMode === 'usd'}
        {kasAmount.toFixed(2)} KAS
      {:else}
        ${usdAmount.toFixed(2)} USD
      {/if}
      <span class="text-l4 ml-2">@ ${$kasPrice.toFixed(4)}</span>
    </div>
  </div>

  {#if $error}
    <div class="mx-5 mb-2 px-3 py-2 glass rounded-[--radius-sm] border-danger/20 text-danger text-sm">
      {$error}
    </div>
  {/if}

  <!-- Keypad -->
  <div class="flex-1 px-5 pb-5 flex flex-col gap-2">
    <div class="grid grid-cols-3 gap-1.5 flex-1 glass rounded-[--radius-md] p-2">
      {#each keys as key}
        <button
          onclick={() => pressKey(key)}
          class="rounded-[--radius-sm] text-xl transition-[transform,background-color] duration-100 active:scale-[0.97]
            {key === 'CLR'
              ? 'text-l4 hover:bg-white/[0.06] text-sm tracking-[0.05em] font-medium'
              : 'text-l2 hover:bg-white/[0.06]'
            }"
        >
          {key}
        </button>
      {/each}
    </div>

    <!-- Backspace -->
    <button
      onclick={backspace}
      class="w-full py-3 rounded-[--radius-sm] text-l4 hover:text-l3 hover:bg-white/[0.04] transition-[background-color,color] duration-150 text-sm flex items-center justify-center gap-1.5"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l7-7 11 0v14H10L3 12z" />
      </svg>
      Delete
    </button>

    <!-- Charge Button -->
    <button
      onclick={charge}
      disabled={kasAmount <= 0 || !$merchantAddress || loading}
      class="w-full py-4 rounded-[--radius-md] font-semibold text-lg transition-[transform,opacity] duration-150 active:scale-[0.97]
        {kasAmount > 0 && $merchantAddress && !loading
          ? 'bg-kaspa-teal text-kaspa-dark shadow-[0_0_30px_rgba(73,234,203,0.15)]'
          : 'glass text-l4 cursor-not-allowed'
        }"
    >
      {#if loading}
        Connecting...
      {:else if !$merchantAddress}
        Set address to continue
      {:else if kasAmount <= 0}
        Enter Amount
      {:else}
        Charge {kasAmount.toFixed(2)} KAS
      {/if}
    </button>
  </div>
</div>

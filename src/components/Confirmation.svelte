<script lang="ts">
  import { currentPayment, resetToIdle, elapsedMs } from '../stores/pos'
  import { onMount } from 'svelte'

  let showContent = false
  let showBars = false

  $: confirmMs = $currentPayment?.confirmationMs ?? $elapsedMs
  $: confirmSec = (confirmMs / 1000).toFixed(1)

  // Comparison data (average confirmation times) - must be reactive
  $: kaspaTime = confirmMs / 1000
  $: chains = [
    { name: 'Kaspa', time: kaspaTime, color: '#49eacb', confirmed: true },
    { name: 'Solana', time: 12, color: '#9945FF', confirmed: false },
    { name: 'Ethereum', time: 180, color: '#627EEA', confirmed: false },
    { name: 'Bitcoin', time: 600, color: '#F7931A', confirmed: false },
  ]

  const maxTime = 600

  onMount(() => {
    requestAnimationFrame(() => {
      showContent = true
      setTimeout(() => { showBars = true }, 400)
    })
  })
</script>

<div class="flex flex-col items-center justify-center h-full px-4 py-5 overflow-hidden">
  <!-- Success Animation -->
  <div class="relative mb-4">
    <!-- Glow ring -->
    <div
      class="absolute inset-0 rounded-full bg-success/20 blur-xl transition-[transform,opacity] duration-700"
      class:scale-150={showContent}
      class:opacity-100={showContent}
      class:opacity-0={!showContent}
    ></div>

    <!-- Checkmark circle -->
    <div
      class="relative w-20 h-20 rounded-full bg-success/20 border-2 border-success flex items-center justify-center transition-[transform,opacity] duration-500"
      class:scale-100={showContent}
      class:scale-0={!showContent}
    >
      <svg class="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="3"
          d="M5 13l4 4L19 7"
          class="transition-[transform,opacity] duration-300 delay-300"
          style="stroke-dasharray: 24; stroke-dashoffset: {showContent ? 0 : 24}"
        />
      </svg>
    </div>
  </div>

  <!-- Confirmed Text -->
  <div class="text-center mb-1 transition-[transform,opacity] duration-500 delay-200" class:opacity-100={showContent} class:opacity-0={!showContent} class:translate-y-0={showContent} class:translate-y-4={!showContent}>
    <div class="text-success text-xs font-medium uppercase tracking-wider">Payment Confirmed</div>
    <div class="text-3xl font-bold text-white font-mono tabular-nums mt-1">
      {$currentPayment?.amountKAS.toFixed(2)} <span class="text-kaspa-teal">KAS</span>
    </div>
    <div class="text-white/40 text-sm font-mono">${$currentPayment?.amountUSD.toFixed(2)} USD</div>
  </div>

  <!-- Confirmation Time -->
  <div class="text-center mb-4 transition-[transform,opacity] duration-500 delay-300" class:opacity-100={showContent} class:opacity-0={!showContent}>
    <div class="text-5xl font-bold font-mono tabular-nums text-kaspa-teal">
      {confirmSec}<span class="text-xl text-kaspa-teal/50">s</span>
    </div>
    <div class="text-white/30 text-[10px] uppercase tracking-wider mt-1">Confirmation Time</div>
  </div>

  <!-- Speed Comparison -->
  <div class="w-full max-w-sm space-y-2 transition-[transform,opacity] duration-500 delay-500" class:opacity-100={showBars} class:opacity-0={!showBars}>
    <div class="text-white/30 text-[10px] uppercase tracking-wider text-center mb-2">Speed Comparison</div>
    {#each chains as chain}
      <div class="flex items-center gap-2">
        <div class="w-16 text-right text-[11px] font-medium shrink-0" style="color: {chain.color}">{chain.name}</div>
        <div class="flex-1 h-6 bg-white/5 rounded-full overflow-hidden relative">
          <div
            class="h-full rounded-full transition-[transform,opacity] duration-1000 ease-out"
            style="
              width: {showBars ? Math.max(3, (chain.time / maxTime) * 100) : 0}%;
              background: {chain.color}22;
              border: 1px solid {chain.color}44;
            "
          ></div>
          <span class="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono {chain.confirmed ? 'font-bold' : 'text-white/30'}" style="{chain.confirmed ? `color: ${chain.color}` : ''}">
            {#if chain.confirmed}
              {chain.time.toFixed(1)}s &#10003;
            {:else}
              ~{chain.time}s
            {/if}
          </span>
        </div>
      </div>
    {/each}
  </div>

  <!-- TX ID -->
  {#if $currentPayment?.txId}
    <div class="mt-3 text-white/15 text-[10px] font-mono break-all text-center max-w-[280px]">
      TX: {$currentPayment.txId.slice(0, 20)}...
    </div>
  {/if}

  <!-- New Sale Button -->
  <button
    onclick={resetToIdle}
    class="mt-4 w-full max-w-sm py-3.5 rounded-[--radius-lg] bg-kaspa-teal text-kaspa-dark font-bold text-lg transition-[transform] duration-150 ease-out active:scale-[0.97] shadow-lg shadow-kaspa-teal/20"
  >
    New Sale
  </button>
</div>

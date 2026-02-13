<script lang="ts">
  import { currentPayment, resetToIdle, elapsedMs } from '../stores/pos'
  import { onMount } from 'svelte'

  let showContent = false
  let showBars = false

  $: confirmMs = $currentPayment?.confirmationMs ?? $elapsedMs
  $: confirmSec = (confirmMs / 1000).toFixed(1)

  $: kaspaTime = confirmMs / 1000
  $: chains = [
    { name: 'Kaspa', time: kaspaTime, display: `${kaspaTime.toFixed(1)}s`, accent: true },
    { name: 'Solana', time: 12, display: '~12s', accent: false },
    { name: 'Ethereum', time: 180, display: '~3m', accent: false },
    { name: 'Bitcoin', time: 600, display: '~10m', accent: false },
  ]

  const maxTime = 600

  onMount(() => {
    requestAnimationFrame(() => {
      showContent = true
      setTimeout(() => { showBars = true }, 500)
    })
  })
</script>

<div class="flex flex-col items-center justify-center h-full px-5 py-6 overflow-hidden">
  <!-- Confirmed Label -->
  <div
    class="transition-[opacity] duration-300"
    class:opacity-100={showContent}
    class:opacity-0={!showContent}
  >
    <div class="text-accent text-[10px] font-mono font-medium uppercase tracking-[0.1em] text-center">Confirmed</div>
  </div>

  <!-- Giant Confirmation Time -->
  <div
    class="mt-3 text-center transition-[transform,opacity] duration-500"
    class:opacity-100={showContent}
    class:opacity-0={!showContent}
    class:scale-100={showContent}
    class:scale-95={!showContent}
  >
    <div class="text-[80px] font-serif font-normal text-accent leading-none tracking-tighter tabular-nums">
      {confirmSec}<span class="text-[28px] text-text-tertiary font-mono">s</span>
    </div>
  </div>

  <!-- Accent Line -->
  <div class="mt-4 flex justify-center">
    {#if showContent}
      <div class="accent-line"></div>
    {/if}
  </div>

  <!-- Amount -->
  <div
    class="mt-6 text-center transition-[opacity] duration-500 delay-200"
    class:opacity-100={showContent}
    class:opacity-0={!showContent}
  >
    <div class="text-text-tertiary text-[10px] font-mono uppercase tracking-widest mb-1">Received</div>
    <div class="text-[32px] font-serif text-text-primary leading-none tracking-tight tabular-nums">
      {$currentPayment?.amountKAS.toFixed(2)} <span class="text-accent text-lg font-mono">KAS</span>
    </div>
    <div class="text-text-tertiary text-sm font-mono mt-1 tabular-nums">${$currentPayment?.amountUSD.toFixed(2)} USD</div>
  </div>

  <!-- Speed Comparison -->
  <div
    class="w-full max-w-sm mt-8 transition-[opacity] duration-500 delay-500"
    class:opacity-100={showBars}
    class:opacity-0={!showBars}
  >
    <div class="text-text-tertiary text-[10px] font-mono uppercase tracking-widest mb-4">vs. Traditional</div>
    {#each chains as chain}
      <div class="flex items-center py-2.5 border-t border-border">
        <div class="w-[48px] text-[10px] font-mono uppercase shrink-0 {chain.accent ? 'text-accent font-medium' : 'text-text-secondary'}">{chain.name}</div>
        <div class="flex-1 h-[3px] bg-border rounded-[--radius-sm] mx-3 overflow-hidden">
          <div
            class="h-full rounded-[--radius-sm] transition-[width] duration-1000"
            style="
              width: {showBars ? Math.max(2, (chain.time / maxTime) * 100) : 0}%;
              background: {chain.accent ? 'var(--color-accent)' : 'var(--color-border-light)'};
            "
          ></div>
        </div>
        <div class="w-12 text-right text-[13px] font-mono tabular-nums shrink-0 {chain.accent ? 'text-accent font-medium' : 'text-text-tertiary'}">
          {chain.display}
        </div>
      </div>
    {/each}
  </div>

  <!-- TX ID -->
  {#if $currentPayment?.txId}
    <div class="mt-4 text-text-tertiary text-[10px] font-mono break-all text-center max-w-[260px]">
      TX: {$currentPayment.txId.slice(0, 20)}...
    </div>
  {/if}

  <!-- New Sale Button -->
  <button
    onclick={resetToIdle}
    class="mt-6 w-full max-w-sm min-h-[56px] rounded-[--radius-sm] bg-accent text-black font-mono font-bold text-sm uppercase tracking-[0.08em] transition-[transform] duration-150 active:scale-[0.97]"
  >
    New Transaction
  </button>
</div>

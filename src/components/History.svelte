<script lang="ts">
  import { payments, sessionTotal, kasPrice } from '../stores/pos'
  import { kasToUsd } from '../lib/kaspa/price'

  export let onClose: () => void

  $: sortedPayments = [...$payments].reverse()
  $: sessionUSD = kasToUsd($sessionTotal, $kasPrice)

  function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function clearHistory() {
    payments.set([])
  }
</script>

<div class="flex flex-col h-full">
  <!-- Header -->
  <div class="flex items-center justify-between px-4 pt-4 pb-3 border-b border-kaspa-border">
    <h2 class="text-white font-medium">Transaction History</h2>
    <button onclick={onClose} class="text-white/40 hover:text-white/80 transition-colors p-1" aria-label="Close">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <!-- Session Summary -->
  <div class="px-4 py-4 bg-kaspa-surface/50 border-b border-kaspa-border">
    <div class="text-white/40 text-xs uppercase tracking-wider mb-1">Today's Total</div>
    <div class="flex items-baseline gap-2">
      <span class="text-2xl font-bold text-white font-mono tabular-nums">{$sessionTotal.toFixed(2)}</span>
      <span class="text-kaspa-teal font-medium">KAS</span>
      <span class="text-white/30 text-sm font-mono ml-auto">${sessionUSD.toFixed(2)}</span>
    </div>
    <div class="text-white/30 text-xs mt-1">{sortedPayments.length} transaction{sortedPayments.length !== 1 ? 's' : ''}</div>
  </div>

  <!-- Transaction List -->
  <div class="flex-1 overflow-y-auto">
    {#if sortedPayments.length === 0}
      <div class="flex flex-col items-center justify-center h-full text-white/20 gap-2">
        <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text-sm">No transactions yet</span>
      </div>
    {:else}
      {#each sortedPayments as payment}
        <div class="px-4 py-3 border-b border-kaspa-border/50 hover:bg-white/[0.02] transition-colors">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-white font-mono font-medium tabular-nums">{payment.amountKAS.toFixed(2)} KAS</span>
              <span class="text-white/30 text-xs ml-2">${payment.amountUSD.toFixed(2)}</span>
            </div>
            <div class="text-right">
              {#if payment.confirmationMs}
                <span class="text-kaspa-teal text-xs font-mono">{(payment.confirmationMs / 1000).toFixed(1)}s</span>
              {/if}
            </div>
          </div>
          <div class="flex items-center justify-between mt-1">
            <span class="text-white/20 text-xs font-mono">
              {payment.txId ? payment.txId.slice(0, 16) + '...' : 'pending'}
            </span>
            <span class="text-white/20 text-xs">
              {payment.confirmedAt ? formatTime(payment.confirmedAt) : ''}
            </span>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Clear -->
  {#if sortedPayments.length > 0}
    <div class="px-4 py-3 border-t border-kaspa-border">
      <button
        onclick={clearHistory}
        class="w-full py-2 text-sm text-white/30 hover:text-danger transition-colors rounded-lg hover:bg-danger/5"
      >
        Clear History
      </button>
    </div>
  {/if}
</div>

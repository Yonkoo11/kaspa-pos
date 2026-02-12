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
  <div class="flex items-center justify-between px-5 pt-5 pb-4">
    <h2 class="text-l1 font-medium text-sm">Transaction History</h2>
    <button onclick={onClose} class="text-l4 hover:text-l2 transition-[color] duration-150 p-2.5" aria-label="Close">
      <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <!-- Session Summary -->
  <div class="mx-5 mb-4 p-4 glass rounded-[--radius-md]">
    <div class="text-l4 text-[10px] uppercase tracking-[0.08em] mb-2 font-medium">Today's Total</div>
    <div class="flex items-baseline gap-2">
      <span class="text-[28px] font-light text-l1 font-mono tabular-nums leading-none">{$sessionTotal.toFixed(2)}</span>
      <span class="text-kaspa-teal text-sm font-medium">KAS</span>
      <span class="text-l4 text-sm font-mono ml-auto">${sessionUSD.toFixed(2)}</span>
    </div>
    <div class="text-l4 text-[11px] mt-2">{sortedPayments.length} transaction{sortedPayments.length !== 1 ? 's' : ''}</div>
  </div>

  <!-- Transaction List -->
  <div class="flex-1 overflow-y-auto px-5">
    {#if sortedPayments.length === 0}
      <div class="flex flex-col items-center justify-center h-full text-l5 gap-3">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="text-sm">No transactions yet</span>
      </div>
    {:else}
      {#each sortedPayments as payment}
        <div class="py-3 border-b border-white/[0.04]">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-l1 font-mono font-medium text-sm tabular-nums">{payment.amountKAS.toFixed(2)} KAS</span>
              <span class="text-l4 text-xs ml-2">${payment.amountUSD.toFixed(2)}</span>
            </div>
            <div class="text-right">
              {#if payment.confirmationMs}
                <span class="text-kaspa-teal text-xs font-mono tabular-nums">{(payment.confirmationMs / 1000).toFixed(1)}s</span>
              {/if}
            </div>
          </div>
          <div class="flex items-center justify-between mt-1">
            <span class="text-l5 text-[10px] font-mono">
              {payment.txId ? payment.txId.slice(0, 16) + '...' : 'pending'}
            </span>
            <span class="text-l5 text-[10px]">
              {payment.confirmedAt ? formatTime(payment.confirmedAt) : ''}
            </span>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Clear -->
  {#if sortedPayments.length > 0}
    <div class="px-5 py-4">
      <button
        onclick={clearHistory}
        class="w-full py-2.5 text-sm text-l4 hover:text-danger transition-[color] duration-150 rounded-[--radius-sm] hover:bg-danger/5"
      >
        Clear History
      </button>
    </div>
  {/if}
</div>

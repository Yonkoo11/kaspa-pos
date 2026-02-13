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

<div class="history-screen">
  <!-- Atmospheric bg -->
  <div class="history-bg">
    <div class="history-glow"></div>
  </div>

  <div class="history-content">
    <!-- Header -->
    <div class="history-header">
      <h2 class="history-title">Transaction History</h2>
      <button onclick={onClose} class="history-close-btn hover-text-primary" aria-label="Close">
        <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Session Summary -->
    <div class="history-summary">
      <div class="history-summary-glow"></div>
      <div class="history-summary-label">Today's Total</div>
      <div class="history-summary-row">
        <span class="history-summary-value">{$sessionTotal.toFixed(2)}</span>
        <span class="history-summary-unit">KAS</span>
        <span class="history-summary-usd">${sessionUSD.toFixed(2)}</span>
      </div>
      <div class="history-summary-count">{sortedPayments.length} transaction{sortedPayments.length !== 1 ? 's' : ''}</div>
    </div>

    <!-- Transaction List -->
    <div class="history-list">
      {#if sortedPayments.length === 0}
        <div class="history-empty">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="history-empty-text">No transactions yet</span>
        </div>
      {:else}
        {#each sortedPayments as payment}
          <div class="history-tx">
            <div class="history-tx-top">
              <div>
                <span class="history-tx-amount">{payment.amountKAS.toFixed(2)} KAS</span>
                <span class="history-tx-usd">${payment.amountUSD.toFixed(2)}</span>
              </div>
              <div class="text-right">
                {#if payment.confirmationMs}
                  <span class="history-tx-speed">{(payment.confirmationMs / 1000).toFixed(1)}s</span>
                {/if}
              </div>
            </div>
            <div class="history-tx-bottom">
              <span class="history-tx-id">
                {payment.txId ? payment.txId.slice(0, 16) + '...' : 'pending'}
              </span>
              <span class="history-tx-time">
                {payment.confirmedAt ? formatTime(payment.confirmedAt) : ''}
              </span>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Clear -->
    {#if sortedPayments.length > 0}
      <div class="history-clear-wrap">
        <button onclick={clearHistory} class="history-clear-btn hover-text-danger">
          Clear History
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .history-screen {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .history-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .history-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 300px 200px at 50% 10%, rgba(73, 234, 203, 0.15) 0%, transparent 70%),
      linear-gradient(180deg, rgba(73, 234, 203, 0.06) 0%, transparent 30%);
  }

  .history-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* ---- Header ---- */
  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 16px;
  }

  .history-title {
    font-family: var(--font-family-serif);
    font-size: 16px;
    color: var(--color-text-primary);
    margin: 0;
  }

  .history-close-btn {
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

  /* ---- Session Summary ---- */
  .history-summary {
    position: relative;
    margin: 0 20px 16px;
    padding: 16px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  .history-summary-glow {
    position: absolute;
    inset: -1px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, rgba(73, 234, 203, 0.15), transparent 50%, rgba(73, 234, 203, 0.06));
    pointer-events: none;
  }

  .history-summary-label {
    font-family: var(--font-family-mono);
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-text-tertiary);
    margin-bottom: 8px;
  }

  .history-summary-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .history-summary-value {
    font-family: var(--font-family-mono);
    font-size: 28px;
    font-weight: 300;
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .history-summary-unit {
    font-family: var(--font-family-mono);
    font-size: 14px;
    font-weight: 500;
    color: var(--color-accent);
  }

  .history-summary-usd {
    font-family: var(--font-family-mono);
    font-size: 14px;
    color: var(--color-text-tertiary);
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }

  .history-summary-count {
    font-family: var(--font-family-mono);
    font-size: 11px;
    color: var(--color-text-tertiary);
    margin-top: 8px;
  }

  /* ---- Transaction List ---- */
  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;
  }

  .history-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--color-text-tertiary);
    gap: 12px;
  }

  .history-empty-text {
    font-family: var(--font-family-mono);
    font-size: 14px;
  }

  .history-tx {
    padding: 12px 0;
    border-bottom: 1px solid var(--color-border);
  }

  .history-tx-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .history-tx-amount {
    font-family: var(--font-family-mono);
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
  }

  .history-tx-usd {
    font-family: var(--font-family-mono);
    font-size: 12px;
    color: var(--color-text-tertiary);
    margin-left: 8px;
    font-variant-numeric: tabular-nums;
  }

  .history-tx-speed {
    font-family: var(--font-family-mono);
    font-size: 12px;
    color: var(--color-accent);
    font-variant-numeric: tabular-nums;
  }

  .history-tx-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 4px;
  }

  .history-tx-id {
    font-family: var(--font-family-mono);
    font-size: 10px;
    color: var(--color-text-tertiary);
  }

  .history-tx-time {
    font-family: var(--font-family-mono);
    font-size: 10px;
    color: var(--color-text-tertiary);
  }

  /* ---- Clear ---- */
  .history-clear-wrap {
    padding: 16px 20px;
  }

  .history-clear-btn {
    width: 100%;
    padding: 10px 0;
    font-family: var(--font-family-mono);
    font-size: 14px;
    color: var(--color-text-tertiary);
    transition: color 0.15s ease;
    background: none;
    border: none;
    cursor: pointer;
  }
</style>

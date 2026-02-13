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

<div class="confirm-screen">
  <!-- Atmospheric glow behind the big number -->
  <div class="confirm-bg">
    <div class="confirm-glow"></div>
  </div>

  <div class="confirm-content">
    <!-- Confirmed Label -->
    <div
      class="transition-[opacity] duration-300"
      class:opacity-100={showContent}
      class:opacity-0={!showContent}
    >
      <div class="confirm-label">Confirmed</div>
    </div>

    <!-- Giant Confirmation Time -->
    <div
      class="mt-3 text-center transition-[transform,opacity] duration-500"
      class:opacity-100={showContent}
      class:opacity-0={!showContent}
      class:scale-100={showContent}
      class:scale-95={!showContent}
    >
      <div class="confirm-time">
        {confirmSec}<span class="confirm-time-unit">s</span>
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
      <div class="confirm-received-label">Received</div>
      <div class="confirm-amount">
        {$currentPayment?.amountKAS.toFixed(2)} <span class="confirm-amount-unit">KAS</span>
      </div>
      <div class="confirm-usd">${$currentPayment?.amountUSD.toFixed(2)} USD</div>
    </div>

    <!-- Speed Comparison -->
    <div
      class="w-full max-w-sm mt-8 transition-[opacity] duration-500 delay-500"
      class:opacity-100={showBars}
      class:opacity-0={!showBars}
    >
      <div class="confirm-compare-label">vs. Traditional</div>
      {#each chains as chain}
        <div class="confirm-bar-row">
          <div class="confirm-bar-name" class:confirm-bar-accent={chain.accent}>{chain.name}</div>
          <div class="confirm-bar-track">
            <div
              class="confirm-bar-fill"
              style="
                width: {showBars ? Math.max(2, (chain.time / maxTime) * 100) : 0}%;
                background: {chain.accent ? 'var(--color-accent)' : 'var(--color-border-light)'};
              "
            ></div>
          </div>
          <div class="confirm-bar-value" class:confirm-bar-accent={chain.accent}>
            {chain.display}
          </div>
        </div>
      {/each}
    </div>

    <!-- TX ID -->
    {#if $currentPayment?.txId}
      <div class="confirm-txid">
        TX: {$currentPayment.txId.slice(0, 20)}...
      </div>
    {/if}

    <!-- New Sale Button -->
    <button onclick={resetToIdle} class="confirm-new-btn">
      New Transaction
    </button>
  </div>
</div>

<style>
  .confirm-screen {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    overflow: hidden;
  }

  .confirm-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .confirm-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 300px 250px at 50% 25%, rgba(73, 234, 203, 0.20) 0%, transparent 70%),
      radial-gradient(ellipse 200px 150px at 50% 22%, rgba(73, 234, 203, 0.10) 0%, transparent 50%);
  }

  .confirm-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 20px 32px;
  }

  .confirm-label {
    color: var(--color-accent);
    font-family: var(--font-family-mono);
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-align: center;
  }

  .confirm-time {
    font-family: var(--font-family-serif);
    font-size: 80px;
    font-weight: 400;
    color: var(--color-accent);
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  .confirm-time-unit {
    font-family: var(--font-family-mono);
    font-size: 28px;
    color: var(--color-text-tertiary);
  }

  .confirm-received-label {
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 4px;
  }

  .confirm-amount {
    font-family: var(--font-family-serif);
    font-size: 32px;
    color: var(--color-text-primary);
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
  }

  .confirm-amount-unit {
    font-family: var(--font-family-mono);
    font-size: 18px;
    color: var(--color-accent);
    margin-left: 4px;
  }

  .confirm-usd {
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    font-size: 14px;
    margin-top: 4px;
    font-variant-numeric: tabular-nums;
  }

  .confirm-compare-label {
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    margin-bottom: 16px;
  }

  .confirm-bar-row {
    display: flex;
    align-items: center;
    padding: 10px 0;
    border-top: 1px solid var(--color-border);
  }

  .confirm-bar-name {
    width: 48px;
    font-family: var(--font-family-mono);
    font-size: 10px;
    text-transform: uppercase;
    flex-shrink: 0;
    color: var(--color-text-secondary);
  }

  .confirm-bar-accent {
    color: var(--color-accent);
    font-weight: 500;
  }

  .confirm-bar-track {
    flex: 1;
    height: 3px;
    background: var(--color-border);
    border-radius: var(--radius-sm);
    margin: 0 12px;
    overflow: hidden;
  }

  .confirm-bar-fill {
    height: 100%;
    border-radius: var(--radius-sm);
    transition: width 1s var(--ease-out);
  }

  .confirm-bar-value {
    width: 48px;
    text-align: right;
    font-family: var(--font-family-mono);
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
    color: var(--color-text-tertiary);
  }

  .confirm-txid {
    margin-top: 16px;
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    font-size: 10px;
    word-break: break-all;
    text-align: center;
    max-width: 260px;
  }

  .confirm-new-btn {
    margin-top: 24px;
    width: 100%;
    max-width: 384px;
    min-height: 56px;
    border-radius: var(--radius-sm);
    background: var(--color-accent);
    color: #000;
    font-family: var(--font-family-mono);
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    border: none;
    cursor: pointer;
    transition: transform 0.15s ease;
    box-shadow: 0 0 24px rgba(73, 234, 203, 0.15), 0 0 48px rgba(73, 234, 203, 0.06);
  }

  .confirm-new-btn:active {
    transform: scale(0.97);
  }

  @media (hover: hover) {
    .confirm-new-btn:hover {
      box-shadow: 0 0 32px rgba(73, 234, 203, 0.25), 0 0 64px rgba(73, 234, 203, 0.1);
    }
  }
</style>

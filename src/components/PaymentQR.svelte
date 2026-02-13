<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import QRCode from 'qrcode'
  import { amountKAS, amountUSD, merchantAddress, elapsedMs, cancelPayment } from '../stores/pos'
  import { buildPaymentURI } from '../lib/kaspa/payment'

  let canvas: HTMLCanvasElement
  let paymentURI = ''

  onMount(() => {
    paymentURI = buildPaymentURI($merchantAddress, $amountKAS)
    QRCode.toCanvas(canvas, paymentURI, {
      width: 240,
      margin: 2,
      color: {
        dark: '#0a0e17',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
  })

  $: formattedTime = ($elapsedMs / 1000).toFixed(1)
</script>

<div class="qr-screen">
  <!-- Amount -->
  <div class="text-center">
    <div class="qr-label">Payment Request</div>
    <div class="qr-amount">
      {$amountKAS.toFixed(2)}<span class="qr-amount-unit">KAS</span>
    </div>
    <div class="text-text-tertiary text-xs mt-1.5 font-mono tabular-nums">${$amountUSD.toFixed(2)} USD</div>
  </div>

  <!-- QR Code with glow -->
  <div class="qr-card">
    <div class="qr-glow"></div>
    <canvas bind:this={canvas}></canvas>
  </div>

  <!-- Timer -->
  <div class="text-center">
    <div class="flex items-center gap-2 justify-center">
      <div class="pulse-dot"></div>
      <span class="qr-label">Waiting for Payment</span>
    </div>
    <div class="qr-timer">
      {formattedTime}<span class="qr-timer-unit">s</span>
    </div>
  </div>

  <!-- Address -->
  <div class="text-text-tertiary text-[10px] font-mono break-all text-center max-w-[280px]">
    {$merchantAddress}
  </div>

  <!-- Cancel -->
  <button
    onclick={cancelPayment}
    class="cancel-btn hover-text-secondary"
  >
    Cancel
  </button>
</div>

<style>
  .qr-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 20px 20px 32px;
    gap: 32px;
  }

  .qr-label {
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 500;
    margin-bottom: 12px;
  }

  .qr-amount {
    font-family: var(--font-family-serif);
    font-size: 48px;
    color: var(--color-text-primary);
    line-height: 1;
    letter-spacing: -0.02em;
    font-variant-numeric: tabular-nums;
    display: flex;
    align-items: baseline;
    justify-content: center;
  }

  .qr-amount-unit {
    font-family: var(--font-family-mono);
    font-size: 18px;
    color: var(--color-accent);
    font-weight: 400;
    margin-left: 8px;
  }

  .qr-card {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 24px;
  }

  .qr-glow {
    position: absolute;
    inset: -1px;
    border-radius: var(--radius-sm);
    background: linear-gradient(135deg, rgba(73, 234, 203, 0.1), transparent 50%, rgba(73, 234, 203, 0.05));
    pointer-events: none;
  }

  .pulse-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-accent);
    animation: pulse-dot 1.5s ease-in-out infinite;
  }

  .qr-timer {
    font-family: var(--font-family-mono);
    font-size: 40px;
    font-weight: 300;
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
    margin-top: 12px;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .qr-timer-unit {
    font-size: 18px;
    color: var(--color-text-tertiary);
  }

  .cancel-btn {
    color: var(--color-text-tertiary);
    font-family: var(--font-family-mono);
    font-size: 13px;
    transition: color 0.15s ease;
    padding: 12px 24px;
    min-height: 44px;
    background: none;
    border: none;
    cursor: pointer;
  }
</style>

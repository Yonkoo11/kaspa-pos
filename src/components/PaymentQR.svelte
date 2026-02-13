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

<div class="flex flex-col items-center justify-center h-full px-5 py-8 gap-8">
  <!-- Amount -->
  <div class="text-center">
    <div class="text-text-tertiary text-[10px] font-mono uppercase tracking-widest font-medium mb-3">Payment Request</div>
    <div class="text-[48px] font-serif text-text-primary leading-none tracking-tight flex items-baseline justify-center tabular-nums">
      {$amountKAS.toFixed(2)}<span class="text-accent text-lg ml-2 font-mono font-normal">KAS</span>
    </div>
    <div class="text-text-tertiary text-xs mt-1.5 font-mono tabular-nums">${$amountUSD.toFixed(2)} USD</div>
  </div>

  <!-- QR Code -->
  <div class="bg-surface border border-border rounded-[--radius-sm] p-6">
    <canvas bind:this={canvas}></canvas>
  </div>

  <!-- Timer -->
  <div class="text-center">
    <div class="flex items-center gap-2 justify-center">
      <div class="w-1.5 h-1.5 rounded-full bg-accent" style="animation: pulse-dot 1.5s ease-in-out infinite;"></div>
      <span class="text-text-tertiary text-[10px] font-mono uppercase tracking-widest">Waiting for Payment</span>
    </div>
    <div class="text-[40px] font-mono font-light text-text-primary tabular-nums mt-3 leading-none tracking-tight">
      {formattedTime}<span class="text-lg text-text-tertiary">s</span>
    </div>
  </div>

  <!-- Address -->
  <div class="text-text-tertiary text-[10px] font-mono break-all text-center max-w-[280px]">
    {$merchantAddress}
  </div>

  <!-- Cancel -->
  <button
    onclick={cancelPayment}
    class="text-text-tertiary hover:text-text-secondary font-mono text-[13px] transition-[color] duration-150 py-3 px-6 min-h-[44px]"
  >
    Cancel
  </button>
</div>

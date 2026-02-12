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
    <div class="text-l4 text-[11px] uppercase tracking-[0.08em] font-medium mb-2">Payment Request</div>
    <div class="text-[48px] font-light text-l1 font-mono tabular-nums leading-none tracking-tight">
      {$amountKAS.toFixed(2)}
    </div>
    <div class="text-kaspa-teal text-sm font-medium mt-1">KAS</div>
    <div class="text-l4 text-sm mt-1 font-mono">${$amountUSD.toFixed(2)} USD</div>
  </div>

  <!-- QR Code -->
  <div class="glass-strong rounded-[--radius-lg] p-5 qr-glow">
    <canvas bind:this={canvas}></canvas>
  </div>

  <!-- Timer -->
  <div class="text-center">
    <div class="flex items-center gap-2 justify-center">
      <div class="w-1.5 h-1.5 rounded-full bg-kaspa-teal animate-pulse"></div>
      <span class="text-l3 text-sm">Waiting for payment</span>
    </div>
    <div class="text-[40px] font-mono font-light text-l1 tabular-nums mt-3 leading-none tracking-tight">
      {formattedTime}<span class="text-lg text-l4">s</span>
    </div>
  </div>

  <!-- Address -->
  <div class="text-l5 text-[10px] font-mono break-all text-center max-w-[280px]">
    {$merchantAddress}
  </div>

  <!-- Cancel -->
  <button
    onclick={cancelPayment}
    class="text-l4 hover:text-l3 text-sm transition-[color] duration-150 py-2 px-6"
  >
    Cancel
  </button>
</div>

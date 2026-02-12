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
      width: 280,
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

<div class="flex flex-col items-center justify-center h-full px-4 py-6 gap-6">
  <!-- Amount -->
  <div class="text-center">
    <div class="text-white/40 text-sm uppercase tracking-wider mb-1">Payment Request</div>
    <div class="text-4xl font-bold text-white font-mono tabular-nums">
      {$amountKAS.toFixed(2)} <span class="text-kaspa-teal">KAS</span>
    </div>
    <div class="text-white/40 text-sm mt-0.5 font-mono">${$amountUSD.toFixed(2)} USD</div>
  </div>

  <!-- QR Code -->
  <div class="bg-white rounded-2xl p-4 shadow-2xl shadow-kaspa-teal/10">
    <canvas bind:this={canvas}></canvas>
  </div>

  <!-- Timer -->
  <div class="text-center">
    <div class="flex items-center gap-2 justify-center">
      <div class="w-2 h-2 rounded-full bg-kaspa-teal animate-pulse"></div>
      <span class="text-white/50 text-sm">Waiting for payment</span>
    </div>
    <div class="text-3xl font-mono font-bold text-white/80 tabular-nums mt-2">
      {formattedTime}s
    </div>
  </div>

  <!-- Address (truncated) -->
  <div class="text-white/20 text-xs font-mono break-all text-center max-w-[300px]">
    {$merchantAddress}
  </div>

  <!-- Cancel -->
  <button
    onclick={cancelPayment}
    class="text-white/30 hover:text-white/60 text-sm transition-colors py-2 px-6"
  >
    Cancel
  </button>
</div>

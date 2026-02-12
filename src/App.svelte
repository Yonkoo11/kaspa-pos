<script lang="ts">
  import { state } from './stores/pos'
  import AmountEntry from './components/AmountEntry.svelte'
  import PaymentQR from './components/PaymentQR.svelte'
  import Confirmation from './components/Confirmation.svelte'
  import History from './components/History.svelte'

  let showHistory = false
</script>

<div class="w-full h-full bg-kaspa-dark flex items-center justify-center">
  <div class="w-full max-w-md h-full max-h-[900px] flex flex-col relative overflow-hidden">
    {#if $state === 'idle'}
      <AmountEntry onShowHistory={() => showHistory = true} />
    {:else if $state === 'waiting'}
      <PaymentQR />
    {:else if $state === 'confirmed'}
      <Confirmation />
    {/if}

    <!-- History Drawer -->
    {#if showHistory}
      <div
        class="absolute inset-0 z-50 bg-kaspa-dark transition-transform duration-300"
        class:translate-x-0={showHistory}
      >
        <History onClose={() => showHistory = false} />
      </div>
    {/if}
  </div>
</div>

<script lang="ts">
  import { state } from '../stores/pos'
  import AmountEntry from '../components/AmountEntry.svelte'
  import PaymentQR from '../components/PaymentQR.svelte'
  import Confirmation from '../components/Confirmation.svelte'
  import History from '../components/History.svelte'

  let showHistory = false
</script>

<div class="w-full h-full bg-bg flex items-center justify-center relative">
  <main class="w-full max-w-[420px] h-full max-h-[900px] flex flex-col relative z-10">
    {#if $state === 'idle'}
      <AmountEntry onShowHistory={() => showHistory = true} />
    {:else if $state === 'waiting'}
      <PaymentQR />
    {:else if $state === 'confirmed'}
      <Confirmation />
    {/if}

    {#if showHistory}
      <div
        class="absolute inset-0 z-50 bg-bg/95 transition-[opacity] duration-200"
        class:opacity-100={showHistory}
      >
        <History onClose={() => showHistory = false} />
      </div>
    {/if}
  </main>
</div>

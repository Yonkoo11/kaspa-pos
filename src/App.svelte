<script lang="ts">
  import { state } from './stores/pos'
  import AmountEntry from './components/AmountEntry.svelte'
  import PaymentQR from './components/PaymentQR.svelte'
  import Confirmation from './components/Confirmation.svelte'
</script>

<div class="w-full h-full bg-kaspa-dark flex items-center justify-center">
  <div class="w-full max-w-md h-full max-h-[900px] flex flex-col relative overflow-hidden">
    {#if $state === 'idle'}
      <AmountEntry />
    {:else if $state === 'waiting'}
      <PaymentQR />
    {:else if $state === 'confirmed'}
      <Confirmation />
    {/if}
  </div>
</div>

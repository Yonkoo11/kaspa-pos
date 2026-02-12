<script lang="ts">
  import { state } from '../stores/pos'
  import AmountEntry from '../components/AmountEntry.svelte'
  import PaymentQR from '../components/PaymentQR.svelte'
  import Confirmation from '../components/Confirmation.svelte'
  import History from '../components/History.svelte'

  let showHistory = false
</script>

<div class="w-full h-full bg-kaspa-dark flex items-center justify-center overflow-hidden relative">
  <!-- Background Blobs -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      class="blob w-[300px] h-[300px] -top-[80px] -right-[60px] opacity-[0.25]"
      style="background: rgba(73, 234, 203, 0.4); animation: blob-drift-1 18s ease-in-out infinite;"
    ></div>
    <div
      class="blob w-[250px] h-[250px] top-[40%] -left-[80px] opacity-[0.15]"
      style="background: rgba(56, 189, 248, 0.4); animation: blob-drift-2 22s ease-in-out infinite;"
    ></div>
    <div
      class="blob w-[200px] h-[200px] bottom-[10%] right-[10%] opacity-[0.12]"
      style="background: rgba(73, 234, 203, 0.3); animation: blob-drift-3 25s ease-in-out infinite;"
    ></div>
  </div>

  <!-- Content -->
  <main class="w-full max-w-md h-full max-h-[900px] flex flex-col relative z-10">
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
        class="absolute inset-0 z-50 bg-kaspa-dark/90 backdrop-blur-sm transition-[opacity] duration-200"
        class:opacity-100={showHistory}
      >
        <History onClose={() => showHistory = false} />
      </div>
    {/if}
  </main>
</div>

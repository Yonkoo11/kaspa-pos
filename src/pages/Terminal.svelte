<script lang="ts">
  import { state } from '../stores/pos'
  import AmountEntry from '../components/AmountEntry.svelte'
  import PaymentQR from '../components/PaymentQR.svelte'
  import Confirmation from '../components/Confirmation.svelte'
  import History from '../components/History.svelte'

  let showHistory = false
</script>

<div class="terminal-shell">
  <!-- Atmospheric background layers -->
  <div class="terminal-bg">
    <div class="bg-gradient"></div>
    <div class="bg-grid"></div>
    <div class="bg-vignette"></div>
  </div>

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
        class="absolute inset-0 z-50 transition-[opacity] duration-200"
        class:opacity-100={showHistory}
        style="background: rgba(10, 10, 10, 0.95); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);"
      >
        <History onClose={() => showHistory = false} />
      </div>
    {/if}
  </main>
</div>

<style>
  .terminal-shell {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .terminal-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  /* Radial teal glow centered behind terminal */
  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 600px 500px at 50% 40%, rgba(73, 234, 203, 0.06) 0%, transparent 70%),
      radial-gradient(ellipse 400px 300px at 50% 35%, rgba(73, 234, 203, 0.03) 0%, transparent 60%),
      var(--color-bg);
  }

  /* Fine dot grid for texture/depth */
  .bg-grid {
    position: absolute;
    inset: 0;
    opacity: 0.3;
    background-image: radial-gradient(circle at center, var(--color-border) 0.5px, transparent 0.5px);
    background-size: 24px 24px;
    mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%);
  }

  /* Edge vignette */
  .bg-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, var(--color-bg) 100%);
  }
</style>

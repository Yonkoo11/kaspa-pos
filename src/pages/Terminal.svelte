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

  <!-- Terminal device frame -->
  <main class="terminal-frame">
    <!-- Device LED strip -->
    <div class="terminal-led"></div>

    <div class="terminal-inner">
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
    </div>
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

  .bg-gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 600px 500px at 50% 40%, rgba(73, 234, 203, 0.18) 0%, transparent 70%),
      radial-gradient(ellipse 400px 300px at 50% 35%, rgba(73, 234, 203, 0.08) 0%, transparent 60%),
      var(--color-bg);
  }

  .bg-grid {
    position: absolute;
    inset: 0;
    opacity: 0.3;
    background-image: radial-gradient(circle at center, var(--color-border) 0.5px, transparent 0.5px);
    background-size: 24px 24px;
    mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 45%, black 30%, transparent 80%);
  }

  .bg-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, var(--color-bg) 100%);
  }

  /* ---- Device Frame ---- */
  .terminal-frame {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 420px;
    height: 100%;
    max-height: 900px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--color-border);
    border-right: 1px solid var(--color-border);
    background: linear-gradient(180deg, rgba(17, 17, 17, 0.6) 0%, rgba(10, 10, 10, 0.9) 100%);
  }

  /* Thin accent LED at very top of device */
  .terminal-led {
    height: 2px;
    background: linear-gradient(90deg, transparent 10%, var(--color-accent) 30%, var(--color-accent) 70%, transparent 90%);
    opacity: 0.6;
    flex-shrink: 0;
  }

  .terminal-inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
</style>

<script lang="ts">
  import { page, navigate } from '../../stores/router'
  import PriceTicker from './PriceTicker.svelte'

  let scrollY = $state(0)

  $effect(() => {
    function onScroll() { scrollY = window.scrollY }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  const visible = $derived(scrollY > 100)
  const isTerminal = $derived($page === 'terminal')
</script>

{#if !isTerminal}
  <nav
    class="fixed top-0 left-0 right-0 z-50 h-12 flex items-center border-b border-border"
    style="
      background: rgba(10, 10, 10, 0.85);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      transform: translateY({visible ? '0%' : '-100%'});
      opacity: {visible ? 1 : 0};
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    "
  >
    <div class="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
      <!-- Logo -->
      <button
        onclick={() => navigate('landing')}
        class="flex items-center gap-0 font-mono text-xs font-semibold uppercase tracking-widest text-text-primary"
      >
        KASPA<span class="text-accent">.</span>POS
      </button>

      <!-- Center nav links -->
      <div class="flex items-center gap-6">
        <button
          onclick={() => navigate('terminal')}
          class="nav-link"
          class:active={$page === 'terminal'}
        >
          Terminal
        </button>
        <button
          onclick={() => navigate('dashboard')}
          class="nav-link"
          class:active={$page === 'dashboard'}
        >
          Dashboard
        </button>
      </div>

      <!-- Right: PriceTicker -->
      <PriceTicker />
    </div>
  </nav>
  <div class="h-12" style="display: {visible ? 'block' : 'none'}"></div>
{/if}

<style>
  .nav-link {
    font-family: var(--font-family-mono);
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-secondary);
    background: none;
    border: none;
    padding: 12px 4px;
    cursor: pointer;
    transition: color 0.2s ease;
    min-height: 44px;
    display: flex;
    align-items: center;
  }
  @media (hover: hover) {
    .nav-link:hover {
      color: var(--color-text-primary);
    }
  }
  .nav-link:active {
    opacity: 0.7;
  }
  .nav-link.active {
    color: var(--color-accent);
  }
</style>

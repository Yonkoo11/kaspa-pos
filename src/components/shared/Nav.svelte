<script lang="ts">
  import { page, navigate } from '../../stores/router'
  import PriceTicker from './PriceTicker.svelte'

  let scrollY = $state(0)

  function onScroll() {
    scrollY = window.scrollY
  }

  $effect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  })

  const isScrolled = $derived(scrollY > 20)
  const isTerminal = $derived($page === 'terminal')
  const isLanding = $derived($page === 'landing')
</script>

{#if !isTerminal}
  <nav
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    class:nav-glass={isScrolled || !isLanding}
    class:nav-transparent={!isScrolled && isLanding}
  >
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <button onclick={() => navigate('landing')} class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-lg bg-kaspa-teal/15 flex items-center justify-center group-hover:bg-kaspa-teal/25 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 5V11L8 15L2 11V5L8 1Z" stroke="#49eacb" stroke-width="1.5" fill="none"/>
            <circle cx="8" cy="8" r="2" fill="#49eacb"/>
          </svg>
        </div>
        <span class="text-l1 font-semibold text-sm tracking-wide">KaspaPOS</span>
      </button>

      <!-- Right side -->
      <div class="flex items-center gap-4">
        <PriceTicker />

        <div class="flex items-center gap-1">
          <button
            onclick={() => navigate('terminal')}
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors {$page === 'terminal' ? 'bg-kaspa-teal/15 text-kaspa-teal' : 'text-l2 hover:text-l1 hover:bg-white/5'}"
          >
            Terminal
          </button>
          <button
            onclick={() => navigate('dashboard')}
            class="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors {$page === 'dashboard' ? 'bg-kaspa-teal/15 text-kaspa-teal' : 'text-l2 hover:text-l1 hover:bg-white/5'}"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  </nav>
  <div class="h-16"></div>
{/if}

<style>
  .nav-glass {
    background: rgba(10, 14, 23, 0.8);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  }
  .nav-transparent {
    background: transparent;
  }
</style>

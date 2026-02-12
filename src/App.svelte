<script lang="ts">
  import { fade } from 'svelte/transition'
  import { page } from './stores/router'
  import Landing from './pages/Landing.svelte'
  import Terminal from './pages/Terminal.svelte'
  import Dashboard from './pages/Dashboard.svelte'
  import Nav from './components/shared/Nav.svelte'

  $effect(() => {
    if ($page === 'terminal') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  })
</script>

<Nav />

{#key $page}
  <div in:fade={{ duration: 150, delay: 100 }} out:fade={{ duration: 100 }}>
    {#if $page === 'landing'}
      <Landing />
    {:else if $page === 'terminal'}
      <Terminal />
    {:else if $page === 'dashboard'}
      <Dashboard />
    {/if}
  </div>
{/key}

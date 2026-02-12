<script lang="ts">
  import { kasPrice, refreshPrice } from '../../stores/pos'
  import { onMount } from 'svelte'

  onMount(() => {
    refreshPrice()
    const interval = setInterval(refreshPrice, 60_000)
    return () => clearInterval(interval)
  })
</script>

<div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-medium">
  <div class="w-1.5 h-1.5 rounded-full bg-kaspa-teal animate-pulse"></div>
  <span class="text-l2">KAS</span>
  <span class="text-l1 font-mono">${$kasPrice.toFixed(4)}</span>
</div>

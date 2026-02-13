<script lang="ts">
  import { kasPrice, refreshPrice } from '../../stores/pos'
  import { onMount } from 'svelte'

  onMount(() => {
    refreshPrice()
    const interval = setInterval(refreshPrice, 60_000)
    return () => clearInterval(interval)
  })
</script>

<div class="ticker">
  <span class="dot"></span>
  <span class="label">KAS</span>
  <span class="price">${$kasPrice.toFixed(4)}</span>
</div>

<style>
  .ticker {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    font-family: var(--font-family-mono);
    font-size: 10px;
  }
  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--color-accent);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  .label {
    color: var(--color-text-secondary);
  }
  .price {
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
  }
</style>

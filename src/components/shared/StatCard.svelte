<script lang="ts">
  import { onMount } from 'svelte'
  let { label, value, suffix = '', change = '' }: { label: string; value: string; suffix?: string; change?: string } = $props()

  let displayed = $state('')
  let mounted = $state(false)

  onMount(() => {
    mounted = true
    const numVal = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(numVal) || numVal === 0) {
      displayed = value
      return
    }
    const prefix = value.replace(/[0-9.,]+.*/, '')
    const trailing = value.replace(/^[^0-9]*[0-9.,]+/, '')
    const hasDot = value.includes('.')
    const decimals = hasDot ? (value.split('.')[1]?.replace(/[^0-9]/g, '').length ?? 0) : 0
    const duration = 600
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = numVal * eased
      displayed = prefix + current.toFixed(decimals) + trailing + suffix
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
</script>

<div class="bg-(--color-surface) border border-(--color-border) rounded-[var(--radius-sm)] p-6">
  <div class="font-(family-name:--font-family-mono) text-[10px] uppercase tracking-[0.1em] text-(--color-text-tertiary) mb-2">
    {label}
  </div>
  <div
    class="font-(family-name:--font-family-mono) text-[24px] font-bold text-(--color-text-primary) leading-tight"
    style="font-variant-numeric: tabular-nums;"
  >
    {mounted ? displayed : value + suffix}
  </div>
  {#if change}
    <div
      class="font-(family-name:--font-family-mono) text-[10px] font-medium mt-1"
      style="color: {change.startsWith('+') ? 'var(--color-accent)' : change.startsWith('-') ? 'var(--color-danger)' : 'var(--color-text-tertiary)'};"
    >
      {change}
    </div>
  {/if}
</div>

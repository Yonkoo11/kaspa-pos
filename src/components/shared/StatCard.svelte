<script lang="ts">
  import { onMount } from 'svelte'

  let { label, value, suffix = '' }: { label: string; value: string; suffix?: string } = $props()

  let displayed = $state('')
  let mounted = $state(false)

  onMount(() => {
    mounted = true
    // Animate number count-up
    const numVal = parseFloat(value.replace(/[^0-9.]/g, ''))
    if (isNaN(numVal) || numVal === 0) {
      displayed = value
      return
    }

    const prefix = value.replace(/[0-9.,]+.*/, '')
    const hasDot = value.includes('.')
    const decimals = hasDot ? (value.split('.')[1]?.replace(/[^0-9]/g, '').length ?? 0) : 0
    const duration = 800
    const start = performance.now()

    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      const current = numVal * eased
      displayed = prefix + current.toFixed(decimals) + suffix
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
</script>

<div class="glass rounded-2xl p-6 flex flex-col gap-1">
  <span class="text-xs text-l3 uppercase tracking-wider">{label}</span>
  <span class="text-2xl font-bold text-l1 font-mono">
    {mounted ? displayed : value + suffix}
  </span>
</div>

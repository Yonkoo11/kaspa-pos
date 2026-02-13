<script lang="ts">
  let { data, labels }: { data: number[]; labels: string[] } = $props()

  const padding = { top: 8, right: 8, bottom: 20, left: 40 }
  const width = 500
  const height = 200

  const maxVal = $derived(Math.max(...data, 1))
  const minVal = $derived(Math.min(...data, 0))
  const range = $derived(maxVal - minVal || 1)

  function x(i: number): number {
    const plotW = width - padding.left - padding.right
    return padding.left + (i / (data.length - 1)) * plotW
  }

  function y(val: number): number {
    const plotH = height - padding.top - padding.bottom
    return padding.top + (1 - (val - minVal) / range) * plotH
  }

  const linePath = $derived(
    data.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(v)}`).join(' ')
  )

  const areaPath = $derived(
    linePath + ` L${x(data.length - 1)},${height - padding.bottom} L${x(0)},${height - padding.bottom} Z`
  )

  const gridLines = $derived([0.25, 0.5, 0.75].map(pct => {
    const val = minVal + range * (1 - pct)
    return { y: padding.top + pct * (height - padding.top - padding.bottom), label: '$' + val.toFixed(0) }
  }))
</script>

<svg viewBox="0 0 {width} {height}" class="w-full h-full" preserveAspectRatio="xMidYMid meet">
  <defs>
    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.2" />
      <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Grid lines -->
  {#each gridLines as line}
    <line
      x1={padding.left}
      y1={line.y}
      x2={width - padding.right}
      y2={line.y}
      stroke="var(--color-border)"
      stroke-width="0.5"
      stroke-dasharray="4 4"
    />
    <text
      x={padding.left - 4}
      y={line.y + 3}
      text-anchor="end"
      fill="var(--color-text-tertiary)"
      style="font-family: var(--font-family-mono); font-size: 9px;"
    >
      {line.label}
    </text>
  {/each}

  <!-- Area fill -->
  <path d={areaPath} fill="url(#chartGrad)" />

  <!-- Line -->
  <path
    d={linePath}
    stroke="var(--color-accent)"
    stroke-width="1.5"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Data points -->
  {#each data as val, i}
    <circle
      cx={x(i)}
      cy={y(val)}
      r="3"
      fill="var(--color-accent)"
    />
  {/each}

  <!-- X-axis labels -->
  {#each labels as lbl, i}
    <text
      x={x(i)}
      y={height - 4}
      text-anchor="middle"
      fill="var(--color-text-tertiary)"
      style="font-family: var(--font-family-mono); font-size: 9px;"
    >
      {lbl}
    </text>
  {/each}
</svg>

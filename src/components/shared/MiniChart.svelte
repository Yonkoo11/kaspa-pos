<script lang="ts">
  let { data, labels }: { data: number[]; labels: string[] } = $props()

  const padding = 8
  const barGap = 6
  const width = 100
  const height = 50

  const maxVal = $derived(Math.max(...data, 1))
  const barWidth = $derived((width - padding * 2 - barGap * (data.length - 1)) / data.length)

  function barHeight(val: number): number {
    return ((val / maxVal) * (height - padding * 2 - 14)) // 14px for label space
  }

  function barX(i: number): number {
    return padding + i * (barWidth + barGap)
  }

  function barY(val: number): number {
    return height - padding - 14 - barHeight(val)
  }
</script>

<svg viewBox="0 0 {width} {height}" class="w-full h-full" preserveAspectRatio="xMidYMid meet">
  {#each data as val, i}
    <!-- Bar -->
    <rect
      x={barX(i)}
      y={barY(val)}
      width={barWidth}
      height={Math.max(barHeight(val), 1)}
      rx="1.5"
      fill={val > 0 ? 'rgba(73, 234, 203, 0.6)' : 'rgba(255, 255, 255, 0.06)'}
      class="transition-all duration-500"
    >
      <animate
        attributeName="height"
        from="0"
        to={Math.max(barHeight(val), 1)}
        dur="0.6s"
        begin="{i * 0.05}s"
        fill="freeze"
        calcMode="spline"
        keySplines="0.22 1 0.36 1"
      />
      <animate
        attributeName="y"
        from={height - padding - 14}
        to={barY(val)}
        dur="0.6s"
        begin="{i * 0.05}s"
        fill="freeze"
        calcMode="spline"
        keySplines="0.22 1 0.36 1"
      />
    </rect>

    <!-- Value on hover -->
    {#if val > 0}
      <text
        x={barX(i) + barWidth / 2}
        y={barY(val) - 2}
        text-anchor="middle"
        fill="#b8bcc5"
        font-size="3"
        font-family="JetBrains Mono, monospace"
        opacity="0"
        class="bar-label"
      >
        ${val.toFixed(0)}
      </text>
    {/if}

    <!-- Day label -->
    <text
      x={barX(i) + barWidth / 2}
      y={height - padding - 2}
      text-anchor="middle"
      fill="#5c6370"
      font-size="3.2"
      font-family="Inter, sans-serif"
    >
      {labels[i] ?? ''}
    </text>
  {/each}
</svg>

<style>
  rect:hover + .bar-label,
  rect:hover ~ .bar-label {
    opacity: 1;
  }
  svg:hover .bar-label {
    opacity: 0;
  }
  svg rect:hover + text.bar-label {
    opacity: 1 !important;
  }
</style>

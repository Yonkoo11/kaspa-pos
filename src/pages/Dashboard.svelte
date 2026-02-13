<script lang="ts">
  import { payments } from '../stores/pos'
  import { totalStats, dailyRevenue, recentPayments, loadDemoData } from '../stores/analytics'
  import { navigate } from '../stores/router'
  import StatCard from '../components/shared/StatCard.svelte'
  import MiniChart from '../components/shared/MiniChart.svelte'

  const isEmpty = $derived($payments.length === 0)

  let activePeriod = $state('7d')

  function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
  }

  function formatSpeed(ms: number): string {
    return (ms / 1000).toFixed(2) + 's'
  }

  function clearData() {
    if (confirm('Clear all transaction history?')) {
      payments.set([])
    }
  }
</script>

<div class="min-h-screen bg-black">
  <div class="max-w-[1200px] mx-auto px-8 py-12">

    <!-- Section label -->
    <div class="font-(family-name:--font-family-mono) text-[10px] uppercase tracking-[0.1em] text-(--color-text-tertiary) mb-4">
      // DASHBOARD
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="font-(family-name:--font-family-serif) text-[20px] text-(--color-text-primary)">
        Revenue & Analytics
      </h1>
      <button
        onclick={() => navigate('terminal')}
        class="font-(family-name:--font-family-mono) text-[11px] uppercase tracking-[0.05em] bg-(--color-accent) text-black px-5 py-3 rounded-[var(--radius-sm)] font-medium cursor-pointer hover:opacity-90 transition-opacity"
        style="min-height: 44px;"
      >
        OPEN TERMINAL &rarr;
      </button>
    </div>

    {#if isEmpty}
      <!-- Empty state -->
      <div class="bg-(--color-surface) border border-(--color-border) rounded-[var(--radius-md)] p-16 text-center">
        <svg class="mx-auto mb-4 text-(--color-text-tertiary)" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h2 class="font-(family-name:--font-family-serif) text-[20px] text-(--color-text-primary) mb-2">
          No transactions yet
        </h2>
        <p class="font-(family-name:--font-family-mono) text-[12px] text-(--color-text-secondary) mb-8">
          Process your first payment or load sample data to preview the dashboard.
        </p>
        <div class="flex items-center justify-center gap-3">
          <button
            onclick={() => loadDemoData()}
            class="font-(family-name:--font-family-mono) text-[11px] uppercase tracking-[0.05em] bg-(--color-accent) text-black px-5 py-3 rounded-[var(--radius-sm)] font-medium cursor-pointer hover:opacity-90 transition-opacity"
            style="min-height: 44px;"
          >
            Load Demo Data
          </button>
          <button
            onclick={() => navigate('terminal')}
            class="font-(family-name:--font-family-mono) text-[11px] uppercase tracking-[0.05em] border border-(--color-border) text-(--color-text-primary) px-5 py-3 rounded-[var(--radius-sm)] font-medium cursor-pointer bg-transparent hover:bg-(--color-surface-2) transition-colors"
            style="min-height: 44px;"
          >
            Go to Terminal
          </button>
        </div>
      </div>
    {:else}
      <!-- Stats row -->
      <div class="grid grid-cols-4 gap-[2px] mb-6">
        <StatCard
          label="Total Revenue"
          value={'$' + $totalStats.totalUSD.toFixed(2)}
          change="+12.4%"
        />
        <StatCard
          label="Transactions"
          value={String($totalStats.count)}
        />
        <StatCard
          label="Avg Confirmation"
          value={($totalStats.avgMs / 1000).toFixed(2) + 's'}
        />
        <StatCard
          label="Fastest"
          value={($totalStats.fastestMs / 1000).toFixed(2) + 's'}
        />
      </div>

      <!-- Main grid -->
      <div class="grid grid-cols-[1.6fr_1fr] gap-[2px] mb-6">
        <!-- Chart container -->
        <div class="bg-(--color-surface) border border-(--color-border) rounded-[var(--radius-sm)] p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-(family-name:--font-family-serif) text-[16px] text-(--color-text-primary)">
              Revenue (7d)
            </h2>
            <div class="flex items-center gap-1">
              {#each ['7d', '30d', 'All'] as period}
                <button
                  onclick={() => activePeriod = period}
                  class="font-(family-name:--font-family-mono) text-[9px] uppercase px-2 py-1 rounded-[var(--radius-sm)] cursor-pointer transition-colors"
                  style="
                    background: {activePeriod === period ? 'var(--color-surface-2)' : 'transparent'};
                    color: {activePeriod === period ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)'};
                    border: 1px solid {activePeriod === period ? 'var(--color-border-light)' : 'transparent'};
                  "
                >
                  {period}
                </button>
              {/each}
            </div>
          </div>
          <div class="h-[200px]">
            <MiniChart
              data={$dailyRevenue.map(d => d.usd)}
              labels={$dailyRevenue.map(d => d.label)}
            />
          </div>
        </div>

        <!-- Transaction list -->
        <div class="bg-(--color-surface) border border-(--color-border) rounded-[var(--radius-sm)] p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-(family-name:--font-family-serif) text-[16px] text-(--color-text-primary)">
              Recent Transactions
            </h2>
            <button
              onclick={() => loadDemoData()}
              class="font-(family-name:--font-family-mono) text-[11px] text-(--color-text-tertiary) hover:text-(--color-text-secondary) bg-transparent border-none cursor-pointer transition-colors"
            >
              Load Demo Data
            </button>
          </div>

          <!-- Table header -->
          <div class="grid grid-cols-[1fr_1fr_0.8fr] font-(family-name:--font-family-mono) text-[10px] uppercase tracking-[0.1em] text-(--color-text-tertiary) pb-2 border-b border-(--color-border) mb-1">
            <span>Time</span>
            <span>Amount</span>
            <span>Speed</span>
          </div>

          <!-- Table rows -->
          {#each $recentPayments as payment}
            <div class="grid grid-cols-[1fr_1fr_0.8fr] items-center py-2 border-b border-(--color-border)">
              <span class="font-(family-name:--font-family-mono) text-[11px] text-(--color-text-tertiary)">
                {formatTime(payment.confirmedAt!)}
              </span>
              <span
                class="font-(family-name:--font-family-mono) text-[13px] font-medium text-(--color-text-primary)"
                style="font-variant-numeric: tabular-nums;"
              >
                ${payment.amountUSD.toFixed(2)}
              </span>
              <span
                class="font-(family-name:--font-family-mono) text-[11px] text-(--color-accent)"
                style="font-variant-numeric: tabular-nums;"
              >
                {formatSpeed(payment.confirmationMs!)}
              </span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Clear data -->
      <div class="text-center mt-4">
        <button
          onclick={() => clearData()}
          class="font-(family-name:--font-family-mono) text-[11px] text-(--color-text-tertiary) hover:text-(--color-danger) bg-transparent border-none cursor-pointer transition-colors"
        >
          Clear all data
        </button>
      </div>
    {/if}
  </div>
</div>

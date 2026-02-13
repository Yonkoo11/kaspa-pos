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

<div class="dash-shell">
  <!-- Atmospheric background -->
  <div class="dash-bg">
    <div class="dash-glow"></div>
    <div class="dash-grid"></div>
    <div class="dash-vignette"></div>
  </div>

  <div class="dash-content">

    <!-- Section label -->
    <div class="dash-label">// DASHBOARD</div>

    <!-- Header -->
    <div class="dash-header">
      <h1 class="dash-title">Revenue & Analytics</h1>
      <button onclick={() => navigate('terminal')} class="dash-terminal-btn hover-opacity-90">
        OPEN TERMINAL &rarr;
      </button>
    </div>

    {#if isEmpty}
      <!-- Empty state -->
      <div class="dash-empty">
        <svg class="dash-empty-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h2 class="dash-empty-title">No transactions yet</h2>
        <p class="dash-empty-desc">
          Process your first payment or load sample data to preview the dashboard.
        </p>
        <div class="dash-empty-actions">
          <button onclick={() => loadDemoData()} class="dash-btn-primary hover-opacity-90">
            Load Demo Data
          </button>
          <button onclick={() => navigate('terminal')} class="dash-btn-secondary hover-bg-surface-2">
            Go to Terminal
          </button>
        </div>
      </div>
    {:else}
      <!-- Stats row -->
      <div class="dash-stats-row">
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
      <div class="dash-main-grid">
        <!-- Chart container -->
        <div class="dash-panel">
          <div class="dash-panel-glow"></div>
          <div class="dash-panel-header">
            <h2 class="dash-panel-title">Revenue (7d)</h2>
            <div class="dash-period-tabs">
              {#each ['7d', '30d', 'All'] as period}
                <button
                  onclick={() => activePeriod = period}
                  class="dash-period-tab"
                  class:dash-period-tab-active={activePeriod === period}
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
        <div class="dash-panel">
          <div class="dash-panel-header">
            <h2 class="dash-panel-title">Recent Transactions</h2>
            <button onclick={() => loadDemoData()} class="dash-demo-btn hover-text-secondary">
              Load Demo Data
            </button>
          </div>

          <!-- Table header -->
          <div class="dash-table-header">
            <span>Time</span>
            <span>Amount</span>
            <span>Speed</span>
          </div>

          <!-- Table rows -->
          {#each $recentPayments as payment}
            <div class="dash-table-row">
              <span class="dash-cell-time">{formatTime(payment.confirmedAt!)}</span>
              <span class="dash-cell-amount">${payment.amountUSD.toFixed(2)}</span>
              <span class="dash-cell-speed">{formatSpeed(payment.confirmationMs!)}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Clear data -->
      <div class="dash-footer">
        <button onclick={() => clearData()} class="dash-clear-btn hover-text-danger">
          Clear all data
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  /* ---- Shell & Atmosphere ---- */
  .dash-shell {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }

  .dash-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .dash-glow {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 700px 500px at 40% 20%, rgba(73, 234, 203, 0.15) 0%, transparent 70%),
      radial-gradient(ellipse 500px 400px at 70% 60%, rgba(73, 234, 203, 0.08) 0%, transparent 60%),
      var(--color-bg);
  }

  .dash-grid {
    position: absolute;
    inset: 0;
    opacity: 0.25;
    background-image: radial-gradient(circle at center, var(--color-border) 0.5px, transparent 0.5px);
    background-size: 24px 24px;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 70%);
  }

  .dash-vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 90% 80% at 50% 40%, transparent 40%, var(--color-bg) 100%);
  }

  .dash-content {
    position: relative;
    z-index: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 32px;
  }

  /* ---- Header ---- */
  .dash-label {
    font-family: var(--font-family-mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
    margin-bottom: 16px;
  }

  .dash-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  .dash-title {
    font-family: var(--font-family-serif);
    font-size: 20px;
    color: var(--color-text-primary);
    margin: 0;
  }

  .dash-terminal-btn {
    font-family: var(--font-family-mono);
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: var(--color-accent);
    color: #000;
    padding: 12px 20px;
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    min-height: 44px;
    transition: opacity 0.15s ease, transform 0.15s ease;
    box-shadow: 0 0 24px rgba(73, 234, 203, 0.15), 0 0 48px rgba(73, 234, 203, 0.06);
  }

  .dash-terminal-btn:active {
    transform: scale(0.97);
  }

  @media (hover: hover) {
    .dash-terminal-btn:hover {
      box-shadow: 0 0 32px rgba(73, 234, 203, 0.25), 0 0 64px rgba(73, 234, 203, 0.1);
    }
  }

  /* ---- Empty State ---- */
  .dash-empty {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 64px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .dash-empty::before {
    content: '';
    position: absolute;
    inset: -1px;
    border-radius: var(--radius-md);
    background: linear-gradient(180deg, rgba(73, 234, 203, 0.12) 0%, transparent 50%);
    pointer-events: none;
  }

  .dash-empty-icon {
    margin: 0 auto 16px;
    color: var(--color-text-tertiary);
  }

  .dash-empty-title {
    font-family: var(--font-family-serif);
    font-size: 20px;
    color: var(--color-text-primary);
    margin: 0 0 8px;
  }

  .dash-empty-desc {
    font-family: var(--font-family-mono);
    font-size: 12px;
    color: var(--color-text-secondary);
    margin: 0 0 32px;
  }

  .dash-empty-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .dash-btn-primary {
    font-family: var(--font-family-mono);
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: var(--color-accent);
    color: #000;
    padding: 12px 20px;
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    min-height: 44px;
    transition: opacity 0.15s ease, transform 0.15s ease;
    box-shadow: 0 0 24px rgba(73, 234, 203, 0.15), 0 0 48px rgba(73, 234, 203, 0.06);
  }

  .dash-btn-primary:active {
    transform: scale(0.97);
  }

  @media (hover: hover) {
    .dash-btn-primary:hover {
      box-shadow: 0 0 32px rgba(73, 234, 203, 0.25), 0 0 64px rgba(73, 234, 203, 0.1);
    }
  }

  .dash-btn-secondary {
    font-family: var(--font-family-mono);
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: transparent;
    color: var(--color-text-primary);
    padding: 12px 20px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--color-border);
    cursor: pointer;
    min-height: 44px;
    transition: background-color 0.15s ease, transform 0.15s ease;
  }

  .dash-btn-secondary:active {
    transform: scale(0.97);
  }

  /* ---- Stats Row ---- */
  .dash-stats-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    margin-bottom: 24px;
  }

  /* ---- Main Grid ---- */
  .dash-main-grid {
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 2px;
    margin-bottom: 24px;
  }

  .dash-panel {
    position: relative;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    padding: 24px;
    overflow: hidden;
  }

  .dash-panel-glow {
    position: absolute;
    inset: -1px;
    border-radius: var(--radius-sm);
    background: linear-gradient(135deg, rgba(73, 234, 203, 0.15), transparent 50%, rgba(73, 234, 203, 0.06));
    pointer-events: none;
  }

  .dash-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .dash-panel-title {
    font-family: var(--font-family-serif);
    font-size: 16px;
    color: var(--color-text-primary);
    margin: 0;
  }

  /* ---- Period Tabs ---- */
  .dash-period-tabs {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .dash-period-tab {
    font-family: var(--font-family-mono);
    font-size: 9px;
    text-transform: uppercase;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease;
    background: transparent;
    color: var(--color-text-tertiary);
    border: 1px solid transparent;
  }

  .dash-period-tab-active {
    background: var(--color-surface-2);
    color: var(--color-text-primary);
    border-color: var(--color-border-light);
  }

  /* ---- Demo & Clear Buttons ---- */
  .dash-demo-btn {
    font-family: var(--font-family-mono);
    font-size: 11px;
    color: var(--color-text-tertiary);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.15s ease;
  }

  .dash-clear-btn {
    font-family: var(--font-family-mono);
    font-size: 11px;
    color: var(--color-text-tertiary);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.15s ease;
  }

  /* ---- Table ---- */
  .dash-table-header {
    display: grid;
    grid-template-columns: 1fr 1fr 0.8fr;
    font-family: var(--font-family-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-tertiary);
    padding-bottom: 8px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 4px;
  }

  .dash-table-row {
    display: grid;
    grid-template-columns: 1fr 1fr 0.8fr;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--color-border);
  }

  .dash-cell-time {
    font-family: var(--font-family-mono);
    font-size: 11px;
    color: var(--color-text-tertiary);
  }

  .dash-cell-amount {
    font-family: var(--font-family-mono);
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
  }

  .dash-cell-speed {
    font-family: var(--font-family-mono);
    font-size: 11px;
    color: var(--color-accent);
    font-variant-numeric: tabular-nums;
  }

  .dash-footer {
    text-align: center;
    margin-top: 16px;
  }

  /* ---- Responsive ---- */
  @media (max-width: 768px) {
    .dash-stats-row {
      grid-template-columns: repeat(2, 1fr);
    }
    .dash-main-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<script lang="ts">
  import { payments } from '../stores/pos'
  import { totalStats, dailyRevenue, recentPayments, loadDemoData } from '../stores/analytics'
  import { navigate } from '../stores/router'
  import StatCard from '../components/shared/StatCard.svelte'
  import MiniChart from '../components/shared/MiniChart.svelte'

  const isEmpty = $derived($payments.length === 0)
</script>

<div class="min-h-screen relative">
  <!-- Background Blobs -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      class="blob w-[400px] h-[400px] -top-[100px] -right-[80px] opacity-[0.15]"
      style="background: rgba(73, 234, 203, 0.4); animation: blob-drift-1 18s ease-in-out infinite;"
    ></div>
    <div
      class="blob w-[300px] h-[300px] top-[50%] -left-[100px] opacity-[0.1]"
      style="background: rgba(56, 189, 248, 0.4); animation: blob-drift-2 22s ease-in-out infinite;"
    ></div>
  </div>

  <div class="relative z-10 max-w-5xl mx-auto px-6 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-l1">Dashboard</h1>
        <p class="text-sm text-l3 mt-1">Transaction analytics and revenue overview</p>
      </div>
      <button
        onclick={() => navigate('terminal')}
        class="px-4 py-2 rounded-xl bg-kaspa-teal text-kaspa-dark font-semibold text-xs hover:brightness-110 transition-all active:scale-[0.98]"
      >
        Open Terminal
      </button>
    </div>

    {#if isEmpty}
      <!-- Empty State -->
      <div class="glass-strong rounded-3xl p-16 text-center">
        <div class="text-4xl mb-4">📊</div>
        <h2 class="text-xl font-semibold text-l1 mb-2">No transactions yet</h2>
        <p class="text-sm text-l3 mb-8 max-w-sm mx-auto">
          Start accepting payments in the terminal, or load sample data to see the dashboard in action.
        </p>
        <div class="flex gap-4 justify-center">
          <button
            onclick={loadDemoData}
            class="px-6 py-3 rounded-xl bg-kaspa-teal text-kaspa-dark font-semibold text-sm hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Load Demo Data
          </button>
          <button
            onclick={() => navigate('terminal')}
            class="px-6 py-3 rounded-xl glass text-sm text-l1 font-medium hover:bg-white/8 transition-all active:scale-[0.98]"
          >
            Go to Terminal
          </button>
        </div>
      </div>
    {:else}
      <!-- Stat Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={'$' + $totalStats.totalUSD.toFixed(2)} />
        <StatCard label="Transactions" value={String($totalStats.count)} />
        <StatCard label="Avg Confirmation" value={($totalStats.avgMs / 1000).toFixed(2)} suffix="s" />
        <StatCard label="Fastest" value={($totalStats.fastestMs / 1000).toFixed(2)} suffix="s" />
      </div>

      <!-- Revenue Chart -->
      <div class="glass rounded-2xl p-6 mb-8">
        <h2 class="text-sm font-semibold text-l2 mb-4">7-Day Revenue (USD)</h2>
        <div class="h-48">
          <MiniChart
            data={$dailyRevenue.map((d) => d.usd)}
            labels={$dailyRevenue.map((d) => d.label)}
          />
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="glass rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-sm font-semibold text-l2">Recent Transactions</h2>
          <button onclick={loadDemoData} class="text-xs text-l4 hover:text-l2 transition-colors">
            Load Demo Data
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-white/6">
                <th class="text-xs text-l4 font-medium pb-3 pr-4">Time</th>
                <th class="text-xs text-l4 font-medium pb-3 pr-4">Amount (KAS)</th>
                <th class="text-xs text-l4 font-medium pb-3 pr-4">USD</th>
                <th class="text-xs text-l4 font-medium pb-3 text-right">Speed</th>
              </tr>
            </thead>
            <tbody>
              {#each $recentPayments as payment}
                <tr class="border-b border-white/3 last:border-0">
                  <td class="py-3 pr-4 text-xs text-l3">
                    {new Date(payment.confirmedAt!).toLocaleString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td class="py-3 pr-4 text-sm text-l1 font-mono">{payment.amountKAS.toFixed(1)}</td>
                  <td class="py-3 pr-4 text-sm text-l2 font-mono">${payment.amountUSD.toFixed(2)}</td>
                  <td class="py-3 text-right">
                    <span class="text-xs font-mono text-kaspa-teal">
                      {((payment.confirmationMs ?? 0) / 1000).toFixed(2)}s
                    </span>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Clear demo data -->
      <div class="text-center mt-6">
        <button
          onclick={() => payments.set([])}
          class="text-xs text-l4 hover:text-danger transition-colors"
        >
          Clear All Data
        </button>
      </div>
    {/if}
  </div>
</div>

<script lang="ts">
  import { navigate } from '../stores/router'
  import { onMount } from 'svelte'

  let sections: HTMLElement[] = []

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )
    sections.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  })

  const features = [
    {
      icon: '⚡',
      title: 'Sub-Second Confirmation',
      desc: 'Kaspa\'s BlockDAG confirms payments in under 1 second. No more waiting.',
    },
    {
      icon: '🚫',
      title: 'Zero Fees',
      desc: 'No processing fees, no monthly charges, no middlemen. Keep 100% of every sale.',
    },
    {
      icon: '🔐',
      title: 'Self-Custody',
      desc: 'Funds go directly to your wallet. No third-party holds your money.',
    },
  ]

  const steps = [
    { num: '01', title: 'Set Your Address', desc: 'Paste your Kaspa wallet address. One-time setup, stored locally.' },
    { num: '02', title: 'Customer Scans QR', desc: 'Enter the amount, show the QR code. Customer scans with any Kaspa wallet.' },
    { num: '03', title: 'Instant Confirmation', desc: 'Payment confirmed in under a second. You hear the cha-ching.' },
  ]
</script>

<div class="landing">
  <!-- Background Blobs -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      class="blob w-[500px] h-[500px] -top-[150px] -right-[100px] opacity-[0.2]"
      style="background: rgba(73, 234, 203, 0.4); animation: blob-drift-1 18s ease-in-out infinite;"
    ></div>
    <div
      class="blob w-[400px] h-[400px] top-[30%] -left-[150px] opacity-[0.12]"
      style="background: rgba(56, 189, 248, 0.4); animation: blob-drift-2 22s ease-in-out infinite;"
    ></div>
    <div
      class="blob w-[350px] h-[350px] bottom-[20%] right-[5%] opacity-[0.1]"
      style="background: rgba(73, 234, 203, 0.3); animation: blob-drift-3 25s ease-in-out infinite;"
    ></div>
  </div>

  <!-- Hero -->
  <section class="relative min-h-[85vh] flex items-center justify-center px-6">
    <div class="max-w-3xl mx-auto text-center">
      <div class="fade-in-up" bind:this={sections[0]}>
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-l2 mb-8">
          <div class="w-1.5 h-1.5 rounded-full bg-kaspa-teal animate-pulse"></div>
          Built for Kaspathon 2025
        </div>

        <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-l1 leading-tight mb-6">
          Accept Kaspa Payments in
          <span class="text-kaspa-teal">Sub-Second</span> Time
        </h1>

        <p class="text-lg sm:text-xl text-l2 max-w-xl mx-auto mb-10 leading-relaxed">
          A point-of-sale terminal that turns any device into a Kaspa payment processor. No fees, no middlemen, no waiting.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onclick={() => navigate('terminal')}
            class="px-8 py-3.5 rounded-xl bg-kaspa-teal text-kaspa-dark font-semibold text-sm hover:brightness-110 transition-all active:scale-[0.98]"
          >
            Launch Terminal
          </button>
          <button
            onclick={() => navigate('dashboard')}
            class="px-8 py-3.5 rounded-xl glass font-semibold text-sm text-l1 hover:bg-white/8 transition-all active:scale-[0.98]"
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="relative px-6 py-24">
    <div class="max-w-5xl mx-auto">
      <div class="fade-in-up" bind:this={sections[1]}>
        <h2 class="text-2xl sm:text-3xl font-bold text-l1 text-center mb-4">Why KaspaPOS?</h2>
        <p class="text-l3 text-center mb-16 max-w-lg mx-auto">Everything a merchant needs, nothing they don't.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each features as feature, i}
          <div class="fade-in-up" bind:this={sections[i + 2]}>
            <div class="glass rounded-2xl p-8 h-full hover:bg-white/6 transition-colors">
              <div class="text-3xl mb-4">{feature.icon}</div>
              <h3 class="text-lg font-semibold text-l1 mb-3">{feature.title}</h3>
              <p class="text-sm text-l3 leading-relaxed">{feature.desc}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- How it Works -->
  <section class="relative px-6 py-24">
    <div class="max-w-4xl mx-auto">
      <div class="fade-in-up" bind:this={sections[5]}>
        <h2 class="text-2xl sm:text-3xl font-bold text-l1 text-center mb-4">How It Works</h2>
        <p class="text-l3 text-center mb-16">Three steps. That's it.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each steps as step, i}
          <div class="fade-in-up" bind:this={sections[i + 6]}>
            <div class="text-center">
              <div class="w-14 h-14 rounded-2xl glass-strong flex items-center justify-center mx-auto mb-5">
                <span class="text-kaspa-teal font-mono font-bold text-sm">{step.num}</span>
              </div>
              <h3 class="text-base font-semibold text-l1 mb-2">{step.title}</h3>
              <p class="text-sm text-l3 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="relative px-6 py-24">
    <div class="max-w-2xl mx-auto text-center fade-in-up" bind:this={sections[9]}>
      <div class="glass-strong rounded-3xl p-12">
        <h2 class="text-2xl sm:text-3xl font-bold text-l1 mb-4">Ready to accept Kaspa?</h2>
        <p class="text-l3 mb-8">Set up takes 30 seconds. Paste your address and go.</p>
        <button
          onclick={() => navigate('terminal')}
          class="px-8 py-3.5 rounded-xl bg-kaspa-teal text-kaspa-dark font-semibold text-sm hover:brightness-110 transition-all active:scale-[0.98]"
        >
          Get Started
        </button>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="relative px-6 py-12 border-t border-white/5">
    <div class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <span class="text-xs text-l4">KaspaPOS - Built for Kaspathon 2025</span>
      <span class="text-xs text-l4">Powered by Kaspa BlockDAG</span>
    </div>
  </footer>
</div>

<style>
  .landing {
    position: relative;
    overflow: visible;
  }

  .fade-in-up {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .fade-in-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .fade-in-up {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
</style>

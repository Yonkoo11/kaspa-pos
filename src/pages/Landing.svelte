<script lang="ts">
  import { navigate } from '../stores/router'
  import { kasPrice } from '../stores/pos'
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

  const dataColumns = [
    { left: '2%', duration: '28s', delay: '0s' },
    { left: '14%', duration: '22s', delay: '-4s' },
    { left: '27%', duration: '32s', delay: '-8s' },
    { left: '39%', duration: '18s', delay: '-2s' },
    { left: '52%', duration: '26s', delay: '-6s' },
    { left: '65%', duration: '20s', delay: '-10s' },
    { left: '78%', duration: '30s', delay: '-3s' },
    { left: '90%', duration: '24s', delay: '-7s' },
  ]

  const dataLines = [
    'kaspa:qz7pes...4f2a', '0.00042 KAS', 'BLK 847291',
    'TX_CONFIRMED', 'fee: 0.00001', 'kaspa:qr8m2k...9e1b',
    '32 BPS', 'HASH: 1.21PH', 'UTXO_SET: 4.2M',
    'kaspa:qp4j7n...3d8c', '1.205 KAS', 'BLK 847292',
    'MEMPOOL: 127', 'DIFF: 2.4E+18', 'PEER: 1847',
    'kaspa:qw2t5v...7g4f', '0.518 KAS', 'BLK 847293',
    'SYNC: 100%', 'DAA: 847291', 'VER: 0.14.1',
    'TX_ACCEPTED', 'MR: a7f2e...', 'TIPS: 18',
  ]

  const networkStats = [
    { label: 'Avg Confirmation', value: '0.42s', highlight: true, bar: 85 },
    { label: 'Blocks / Second', value: '32', highlight: false, bar: null },
    { label: 'Network Hashrate', value: '1.21 PH/s', highlight: false, bar: null },
    { label: 'TX Today', value: '847,291', highlight: false, bar: null },
  ]
</script>

<div class="landing">
  <!-- Hero -->
  <section class="hero-section relative min-h-screen flex items-center overflow-hidden">
    <!-- Data streaming background -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      {#each dataColumns as col}
        <div
          class="data-column"
          style="left: {col.left}; animation-duration: {col.duration}; animation-delay: {col.delay};"
        >
          {#each { length: 3 } as _}
            {#each dataLines as line}
              <div class="data-line">{line}</div>
            {/each}
          {/each}
        </div>
      {/each}
    </div>

    <!-- Hero content -->
    <div class="relative z-10 w-full max-w-7xl mx-auto px-6">
      <div class="hero-grid">
        <!-- Left column -->
        <div class="hero-left fade-in-up" bind:this={sections[0]}>
          <div class="eyebrow">
            <span class="eyebrow-dash"></span>
            POINT OF SALE FOR KASPA
          </div>

          <h1 class="hero-headline">
            Accept payments in <em>under a second</em>
          </h1>

          <p class="hero-subtitle">
            Turn any device into a Kaspa payment terminal. No backend, no fees, no middlemen.
          </p>

          <button
            class="cta-primary"
            onclick={() => navigate('terminal')}
          >
            OPEN TERMINAL &rarr;
          </button>
        </div>

        <!-- Right column: data cards -->
        <div class="hero-right fade-in-up" bind:this={sections[1]}>
          <div class="data-cards">
            {#each networkStats as stat, i}
              <div class="data-card" class:data-card-highlight={stat.highlight}>
                <div class="data-card-label">{stat.label}</div>
                <div class="data-card-value">{stat.value}</div>
                {#if stat.bar !== null}
                  <div class="speed-bar-track">
                    <div class="speed-bar-fill" style="width: {stat.bar}%"></div>
                  </div>
                {/if}
              </div>
            {/each}
            <!-- KAS/USD card from store -->
            <div class="data-card">
              <div class="data-card-label">KAS / USD</div>
              <div class="data-card-value">${$kasPrice.toFixed(4)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Features / Capabilities -->
  <section class="features-section bg-black px-6 py-32">
    <div class="max-w-7xl mx-auto">
      <div class="fade-in-up" bind:this={sections[2]}>
        <div class="section-label mb-12">CAPABILITIES</div>
      </div>

      <div class="features-grid">
        <!-- Large card left -->
        <div class="fade-in-up" bind:this={sections[3]}>
          <div class="feature-card-large">
            <div class="feature-number">&lt;1s</div>
            <div class="feature-title">Payment Finality</div>
            <div class="feature-subtitle">Faster than card terminals</div>
          </div>
        </div>

        <!-- Right stack -->
        <div class="feature-stack fade-in-up" bind:this={sections[4]}>
          <div class="feature-card-small">
            <div class="feature-badge">[ NO BACKEND ]</div>
            <div class="feature-desc">Runs entirely client-side. No servers, no databases, no downtime.</div>
          </div>
          <div class="feature-card-small">
            <div class="feature-badge">[ ZERO FEES ]</div>
            <div class="feature-desc">No processing costs. No monthly charges. Keep 100% of every sale.</div>
          </div>
          <div class="feature-card-small">
            <div class="feature-badge">[ QR + URI ]</div>
            <div class="feature-desc">Universal wallet support. Customer scans, payment confirms.</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Bottom CTA -->
  <section class="cta-section px-6 py-32">
    <div class="max-w-2xl mx-auto text-center fade-in-up" bind:this={sections[5]}>
      <h2 class="cta-headline">Ready to accept Kaspa?</h2>
      <button
        class="cta-primary mt-8"
        onclick={() => navigate('terminal')}
      >
        OPEN TERMINAL &rarr;
      </button>
    </div>
  </section>

  <!-- Footer -->
  <footer class="px-6 py-8 border-t border-border">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <span class="footer-text">KaspaPOS -- Built for Kaspathon 2025</span>
      <span class="footer-text">Kaspa BlockDAG</span>
    </div>
  </footer>
</div>

<style>
  .landing {
    position: relative;
    overflow-x: hidden;
  }

  /* ---- Data streaming background ---- */
  .data-column {
    position: absolute;
    top: 0;
    width: 120px;
    animation-name: scroll-data;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }

  .data-line {
    font-family: var(--font-family-mono);
    font-size: 10px;
    line-height: 2;
    color: var(--color-accent);
    opacity: 0.04;
    white-space: nowrap;
  }

  /* ---- Hero ---- */
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 64px;
    align-items: center;
    min-height: 100vh;
  }

  .hero-left {
    padding-left: 8%;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-family-mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
    margin-bottom: 24px;
  }

  .eyebrow-dash {
    width: 24px;
    height: 1px;
    background: var(--color-accent);
    flex-shrink: 0;
  }

  .hero-headline {
    font-family: var(--font-family-serif);
    font-size: clamp(36px, 5vw, 56px);
    font-weight: 400;
    line-height: 1.15;
    color: var(--color-text-primary);
    margin: 0 0 20px 0;
  }

  .hero-headline em {
    font-style: italic;
    color: var(--color-accent);
  }

  .hero-subtitle {
    font-family: var(--font-family-mono);
    font-size: 13px;
    line-height: 1.7;
    color: var(--color-text-secondary);
    max-width: 380px;
    margin-bottom: 36px;
  }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    padding: 0 32px;
    background: var(--color-accent);
    color: #000;
    font-family: var(--font-family-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border: none;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: opacity 0.2s ease;
    min-height: 44px;
  }

  @media (hover: hover) {
    .cta-primary:hover {
      opacity: 0.85;
    }
  }

  .cta-primary:active {
    transform: scale(0.98);
  }

  /* ---- Data cards ---- */
  .data-cards {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .data-card {
    padding: 14px 18px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .data-card-highlight {
    background: var(--color-accent-dim);
    border-color: rgba(73, 234, 203, 0.15);
  }

  .data-card-label {
    font-family: var(--font-family-mono);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
  }

  .data-card-value {
    font-family: var(--font-family-mono);
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-primary);
    font-variant-numeric: tabular-nums;
  }

  .speed-bar-track {
    height: 2px;
    background: var(--color-border);
    border-radius: 1px;
    margin-top: 4px;
  }

  .speed-bar-fill {
    height: 100%;
    background: var(--color-accent);
    border-radius: 1px;
    transition: width 1s var(--ease-out);
  }

  /* ---- Features ---- */
  .features-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 24px;
    align-items: stretch;
  }

  .feature-card-large {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 48px 40px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .feature-number {
    font-family: var(--font-family-serif);
    font-size: clamp(48px, 6vw, 80px);
    font-weight: 400;
    color: var(--color-accent);
    line-height: 1;
    margin-bottom: 16px;
  }

  .feature-title {
    font-family: var(--font-family-serif);
    font-size: 22px;
    color: var(--color-text-primary);
    margin-bottom: 8px;
  }

  .feature-subtitle {
    font-family: var(--font-family-mono);
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .feature-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .feature-card-small {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 20px 24px;
    flex: 1;
  }

  .feature-badge {
    font-family: var(--font-family-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--color-accent);
    letter-spacing: 0.04em;
    margin-bottom: 6px;
  }

  .feature-desc {
    font-family: var(--font-family-mono);
    font-size: 11px;
    line-height: 1.6;
    color: var(--color-text-secondary);
  }

  /* ---- Bottom CTA ---- */
  .cta-headline {
    font-family: var(--font-family-serif);
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 400;
    color: var(--color-text-primary);
    margin: 0;
  }

  /* ---- Footer ---- */
  .footer-text {
    font-family: var(--font-family-mono);
    font-size: 11px;
    color: var(--color-text-tertiary);
  }

  /* ---- Fade in up animation ---- */
  .fade-in-up {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-in-up.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* ---- Responsive ---- */
  @media (max-width: 768px) {
    .hero-grid {
      grid-template-columns: 1fr;
      gap: 48px;
      padding: 120px 0 64px;
      min-height: auto;
    }

    .hero-left {
      padding-left: 0;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fade-in-up {
      opacity: 1;
      transform: none;
      transition: none;
    }
    .data-column {
      animation: none !important;
    }
  }
</style>

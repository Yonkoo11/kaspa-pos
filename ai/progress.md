# KaspaPOS Progress

## Status: Implementing Proposal 1 design (Bloomberg Terminal aesthetic)

## Design Direction: DNA-A-H-I-M-X
- **Layout:** Asymmetric
- **Nav:** Hidden (appears on scroll)
- **Hero:** Immersive (streaming data background)
- **Color:** Monochrome (#0a0a0a + #fafafa + surgical teal #49eacb)
- **Typography:** DM Serif Display (headlines) + JetBrains Mono (body/data)
- **Radius:** Only 2px and 4px
- **Easing:** cubic-bezier(0.16, 1, 0.3, 1) and cubic-bezier(0.65, 0, 0.35, 1)

## Files to Rewrite (12 total)
1. src/app.css - Full design system overhaul
2. src/App.svelte - Already thin router (minor updates)
3. src/pages/Landing.svelte - Asymmetric hero + data viz + features
4. src/pages/Terminal.svelte - Updated wrapper
5. src/pages/Dashboard.svelte - Dense data layout
6. src/components/shared/Nav.svelte - Hidden scroll-reveal nav
7. src/components/shared/PriceTicker.svelte - Mono data style
8. src/components/shared/StatCard.svelte - Dense stat card
9. src/components/shared/MiniChart.svelte - SVG line chart (not bars)
10. src/components/AmountEntry.svelte - Terminal aesthetic
11. src/components/PaymentQR.svelte - Monochrome QR
12. src/components/Confirmation.svelte - Data-dense confirmation

## What's Already Done
- Multi-page expansion (routing, 3 pages working)
- Deployed to GitHub Pages
- 3 design proposals generated, Proposal 1 selected

## Key Design Tokens (from proposal-1.html)
```css
--bg: #0a0a0a; --surface: #111111; --surface-2: #1a1a1a;
--border: #222222; --border-light: #333333;
--text-primary: #fafafa; --text-secondary: #888888; --text-tertiary: #555555;
--accent: #49eacb; --accent-dim: rgba(73, 234, 203, 0.12);
--font-serif: 'DM Serif Display', Georgia, serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
--radius-sm: 2px; --radius-md: 4px;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

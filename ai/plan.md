# KaspaPOS - Instant Point-of-Sale Terminal

## Concept
Merchant payment terminal that makes Kaspa's sub-second confirmations the entire product.
Flow: Enter amount → QR code → customer scans → payment detected ~500ms → CONFIRMED.

## Target Hackathon Tracks
- **Payments & Commerce** (16,500 KAS)
- **Main Track** top 3 (20,000-35,000 KAS)
- **Best UX/UI** mention (10,000 KAS)
- **Best Real-World Application** mention

## Architecture
- Pure client-side SPA (no backend needed)
- Svelte 5 + Vite + TailwindCSS 4 + TypeScript
- Static deploy to GitHub Pages
- Receive-only (no kaspa-wasm, no transaction building)

## Core Screens

### 1. Amount Entry (Merchant View)
- Large calculator-style number pad
- KAS amount with live USD conversion (via CoinGecko API)
- "Charge" button generates payment request

### 2. Payment QR (Customer-Facing)
- Full-screen QR code with `kaspa:address?amount=X` URI
- Shows amount in KAS + USD
- Timer counting up: "Waiting for payment... 0.0s"
- Can be shown on a second screen / tablet

### 3. Confirmation
- Full-screen success animation
- Transaction time displayed prominently (e.g. "0.8 seconds")
- Speed comparison bar: Kaspa ✓ 0.8s | ETH ~12s | BTC ~600s
- Sound effect on confirmation
- "New Sale" button to reset

### 4. Transaction History (sidebar/drawer)
- List of received payments with timestamps
- Running total for the session

## Technical Approach

### Payment Detection
- Poll `GET https://api.kaspa.org/addresses/{address}/utxos` every 300ms
- Compare UTXO set before/after to detect new incoming payment
- Match expected amount (within tolerance for fees)
- Record time from QR display to UTXO detection

### Address Handling
- User pastes their Kaspa address in settings
- Or generates addresses client-side (stretch goal)
- For demo: use a fixed address, detect any new UTXO

### Price Feed
- CoinGecko API for KAS/USD rate
- Cache with 60s TTL
- Fallback to manual rate entry

## Files
1. `src/App.svelte` - Router/state machine (IDLE → CHARGING → WAITING → CONFIRMED)
2. `src/lib/kaspa/payment.ts` - UTXO polling, payment detection
3. `src/lib/kaspa/price.ts` - KAS/USD price feed
4. `src/components/AmountEntry.svelte` - Calculator keypad
5. `src/components/PaymentQR.svelte` - QR code display + timer
6. `src/components/Confirmation.svelte` - Success screen + speed comparison
7. `src/components/Settings.svelte` - Merchant address config
8. `src/components/History.svelte` - Transaction list
9. `src/stores/pos.ts` - POS state machine
10. `src/stores/settings.ts` - Persisted settings (localStorage)

## Key Dependencies
- `qrcode` - QR code generation
- No wallet SDK needed (receive-only)

## Demo Strategy
- 3-min video: set up address → enter amount → scan QR → send real KAS → sub-second confirmation
- The speed comparison timer is the viral moment
- Show it working on mobile (responsive)

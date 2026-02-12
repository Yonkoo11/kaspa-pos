import { writable, derived, get } from 'svelte/store'
import type { POSState, Payment } from '../lib/kaspa/types'
import { fetchUTXOs, watchForPayment, type PaymentWatcher } from '../lib/kaspa/payment'
import { getKASPrice } from '../lib/kaspa/price'

export const state = writable<POSState>('idle')
export const amountKAS = writable(0)
export const amountUSD = writable(0)
export const kasPrice = writable(0.10)
export const merchantAddress = writable(
  localStorage.getItem('kaspa-pos-address') || ''
)
export const payments = writable<Payment[]>(
  JSON.parse(localStorage.getItem('kaspa-pos-history') || '[]')
)
export const currentPayment = writable<Payment | null>(null)
export const waitStartTime = writable(0)
export const elapsedMs = writable(0)
export const error = writable<string | null>(null)

// Persist address
merchantAddress.subscribe(addr => {
  if (addr) localStorage.setItem('kaspa-pos-address', addr)
})

// Persist history
payments.subscribe(p => {
  localStorage.setItem('kaspa-pos-history', JSON.stringify(p.slice(-50)))
})

// Session totals
export const sessionTotal = derived(payments, $p => {
  const today = new Date().setHours(0, 0, 0, 0)
  return $p
    .filter(p => p.confirmedAt && p.confirmedAt >= today)
    .reduce((sum, p) => sum + p.amountKAS, 0)
})

let watcher: PaymentWatcher | null = null
let timerInterval: ReturnType<typeof setInterval> | null = null

export async function refreshPrice() {
  try {
    const price = await getKASPrice()
    kasPrice.set(price)
  } catch {
    // keep existing
  }
}

export async function startPayment(kas: number, usd: number) {
  const addr = get(merchantAddress)
  if (!addr) {
    error.set('Set your Kaspa address first')
    return
  }

  error.set(null)
  amountKAS.set(kas)
  amountUSD.set(usd)

  // Get baseline UTXOs before showing QR
  let baseline: Set<string>
  try {
    baseline = await fetchUTXOs(addr)
  } catch {
    baseline = new Set()
  }

  const payment: Payment = {
    id: crypto.randomUUID(),
    amountKAS: kas,
    amountUSD: usd,
    address: addr,
    txId: null,
    requestedAt: Date.now(),
    confirmedAt: null,
    confirmationMs: null,
  }

  currentPayment.set(payment)
  state.set('waiting')
  waitStartTime.set(Date.now())

  // Start elapsed timer
  timerInterval = setInterval(() => {
    elapsedMs.set(Date.now() - get(waitStartTime))
  }, 16) // ~60fps updates

  // Start watching for payment
  watcher = watchForPayment(
    addr,
    baseline,
    (txId) => {
      const now = Date.now()
      const start = get(waitStartTime)
      const ms = now - start

      const confirmed: Payment = {
        ...payment,
        txId,
        confirmedAt: now,
        confirmationMs: ms,
      }

      currentPayment.set(confirmed)
      payments.update(p => [...p, confirmed])
      elapsedMs.set(ms)
      state.set('confirmed')

      if (timerInterval) clearInterval(timerInterval)
      timerInterval = null

      // Play sound
      playConfirmationSound()
    },
    (err) => {
      console.warn('Payment watch error:', err)
    }
  )
}

export function cancelPayment() {
  watcher?.stop()
  watcher = null
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = null
  state.set('idle')
  currentPayment.set(null)
  elapsedMs.set(0)
}

export function resetToIdle() {
  state.set('idle')
  currentPayment.set(null)
  elapsedMs.set(0)
  amountKAS.set(0)
  amountUSD.set(0)
}

function playConfirmationSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.connect(gain)
    gain.connect(ctx.destination)

    // Rising two-tone "cha-ching"
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.setValueAtTime(1200, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(1600, ctx.currentTime + 0.2)

    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.4)
  } catch {
    // audio not available
  }
}

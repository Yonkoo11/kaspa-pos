import { derived, get } from 'svelte/store'
import { payments } from './pos'
import type { Payment } from '../lib/kaspa/types'

export const totalStats = derived(payments, ($p) => {
  const confirmed = $p.filter((p) => p.confirmedAt)
  const totalKAS = confirmed.reduce((s, p) => s + p.amountKAS, 0)
  const totalUSD = confirmed.reduce((s, p) => s + p.amountUSD, 0)
  const avgMs = confirmed.length
    ? confirmed.reduce((s, p) => s + (p.confirmationMs ?? 0), 0) / confirmed.length
    : 0
  const fastestMs = confirmed.length
    ? Math.min(...confirmed.map((p) => p.confirmationMs ?? Infinity))
    : 0

  return {
    count: confirmed.length,
    totalKAS,
    totalUSD,
    avgMs,
    fastestMs: fastestMs === Infinity ? 0 : fastestMs,
  }
})

export const dailyRevenue = derived(payments, ($p) => {
  const days: Record<string, number> = {}
  const now = new Date()

  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days[key] = 0
  }

  $p.filter((p) => p.confirmedAt).forEach((p) => {
    const key = new Date(p.confirmedAt!).toISOString().slice(0, 10)
    if (key in days) days[key] += p.amountUSD
  })

  return Object.entries(days).map(([date, usd]) => ({
    date,
    label: new Date(date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' }),
    usd,
  }))
})

export const recentPayments = derived(payments, ($p) =>
  [...$p].filter((p) => p.confirmedAt).reverse().slice(0, 10)
)

export function loadDemoData() {
  const now = Date.now()
  const day = 86_400_000
  const addr = 'kaspa:demo'

  const demoPayments: Payment[] = [
    // 2 days ago
    { id: crypto.randomUUID(), amountKAS: 125.5, amountUSD: 12.55, address: addr, txId: 'tx_demo_01', requestedAt: now - 2 * day + 3_600_000, confirmedAt: now - 2 * day + 3_600_820, confirmationMs: 820 },
    { id: crypto.randomUUID(), amountKAS: 45.0, amountUSD: 4.50, address: addr, txId: 'tx_demo_02', requestedAt: now - 2 * day + 7_200_000, confirmedAt: now - 2 * day + 7_200_710, confirmationMs: 710 },
    { id: crypto.randomUUID(), amountKAS: 300.0, amountUSD: 30.00, address: addr, txId: 'tx_demo_03', requestedAt: now - 2 * day + 14_400_000, confirmedAt: now - 2 * day + 14_400_950, confirmationMs: 950 },
    { id: crypto.randomUUID(), amountKAS: 88.3, amountUSD: 8.83, address: addr, txId: 'tx_demo_04', requestedAt: now - 2 * day + 28_800_000, confirmedAt: now - 2 * day + 28_800_680, confirmationMs: 680 },
    { id: crypto.randomUUID(), amountKAS: 210.0, amountUSD: 21.00, address: addr, txId: 'tx_demo_05', requestedAt: now - 2 * day + 36_000_000, confirmedAt: now - 2 * day + 36_000_770, confirmationMs: 770 },
    // Yesterday
    { id: crypto.randomUUID(), amountKAS: 156.7, amountUSD: 15.67, address: addr, txId: 'tx_demo_06', requestedAt: now - day + 7_200_000, confirmedAt: now - day + 7_200_640, confirmationMs: 640 },
    { id: crypto.randomUUID(), amountKAS: 72.0, amountUSD: 7.20, address: addr, txId: 'tx_demo_07', requestedAt: now - day + 14_400_000, confirmedAt: now - day + 14_400_890, confirmationMs: 890 },
    { id: crypto.randomUUID(), amountKAS: 430.0, amountUSD: 43.00, address: addr, txId: 'tx_demo_08', requestedAt: now - day + 21_600_000, confirmedAt: now - day + 21_600_550, confirmationMs: 550 },
    { id: crypto.randomUUID(), amountKAS: 95.5, amountUSD: 9.55, address: addr, txId: 'tx_demo_09', requestedAt: now - day + 32_400_000, confirmedAt: now - day + 32_400_730, confirmationMs: 730 },
    { id: crypto.randomUUID(), amountKAS: 188.0, amountUSD: 18.80, address: addr, txId: 'tx_demo_10', requestedAt: now - day + 43_200_000, confirmedAt: now - day + 43_200_610, confirmationMs: 610 },
    { id: crypto.randomUUID(), amountKAS: 55.0, amountUSD: 5.50, address: addr, txId: 'tx_demo_11', requestedAt: now - day + 50_400_000, confirmedAt: now - day + 50_400_850, confirmationMs: 850 },
    // Today
    { id: crypto.randomUUID(), amountKAS: 340.0, amountUSD: 34.00, address: addr, txId: 'tx_demo_12', requestedAt: now - 14_400_000, confirmedAt: now - 14_400_000 + 720, confirmationMs: 720 },
    { id: crypto.randomUUID(), amountKAS: 67.8, amountUSD: 6.78, address: addr, txId: 'tx_demo_13', requestedAt: now - 10_800_000, confirmedAt: now - 10_800_000 + 580, confirmationMs: 580 },
    { id: crypto.randomUUID(), amountKAS: 225.0, amountUSD: 22.50, address: addr, txId: 'tx_demo_14', requestedAt: now - 7_200_000, confirmedAt: now - 7_200_000 + 910, confirmationMs: 910 },
    { id: crypto.randomUUID(), amountKAS: 150.0, amountUSD: 15.00, address: addr, txId: 'tx_demo_15', requestedAt: now - 3_600_000, confirmedAt: now - 3_600_000 + 660, confirmationMs: 660 },
    { id: crypto.randomUUID(), amountKAS: 490.0, amountUSD: 49.00, address: addr, txId: 'tx_demo_16', requestedAt: now - 1_800_000, confirmedAt: now - 1_800_000 + 790, confirmationMs: 790 },
    { id: crypto.randomUUID(), amountKAS: 83.2, amountUSD: 8.32, address: addr, txId: 'tx_demo_17', requestedAt: now - 600_000, confirmedAt: now - 600_000 + 530, confirmationMs: 530 },
    { id: crypto.randomUUID(), amountKAS: 178.5, amountUSD: 17.85, address: addr, txId: 'tx_demo_18', requestedAt: now - 120_000, confirmedAt: now - 120_000 + 870, confirmationMs: 870 },
  ]

  payments.set(demoPayments)
}

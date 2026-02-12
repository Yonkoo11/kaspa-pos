import type { UTXOResponse } from './types'

const API_BASE = 'https://api.kaspa.org'

export async function fetchUTXOs(address: string): Promise<Set<string>> {
  const res = await fetch(`${API_BASE}/addresses/${address}/utxos`)
  if (!res.ok) throw new Error(`UTXO fetch failed: ${res.status}`)
  const data: UTXOResponse[] = await res.json()

  const ids = new Set<string>()
  for (const utxo of data) {
    ids.add(`${utxo.outpoint.transactionId}:${utxo.outpoint.index}`)
  }
  return ids
}

export async function fetchBalance(address: string): Promise<number> {
  const res = await fetch(`${API_BASE}/addresses/${address}/balance`)
  if (!res.ok) throw new Error(`Balance fetch failed: ${res.status}`)
  const data = await res.json()
  return Number(data.balance) / 1e8 // sompi to KAS
}

export function isValidKaspaAddress(address: string): boolean {
  return /^kaspa:[a-z0-9]{61,63}$/.test(address)
}

export function buildPaymentURI(address: string, amountKAS: number): string {
  // Standard kaspa: URI scheme
  return `kaspa:${address.replace('kaspa:', '')}?amount=${amountKAS}`
}

export interface PaymentWatcher {
  stop: () => void
}

/**
 * Watch for new UTXOs on an address. Calls onPayment when a new UTXO appears.
 * Returns a stopper function.
 */
export function watchForPayment(
  address: string,
  baselineUTXOs: Set<string>,
  onPayment: (txId: string) => void,
  onError?: (err: Error) => void,
  intervalMs = 300
): PaymentWatcher {
  let stopped = false

  const poll = async () => {
    if (stopped) return

    try {
      const current = await fetchUTXOs(address)
      for (const id of current) {
        if (!baselineUTXOs.has(id)) {
          // New UTXO detected!
          const txId = id.split(':')[0]
          onPayment(txId)
          stopped = true
          return
        }
      }
    } catch (err) {
      onError?.(err as Error)
    }

    if (!stopped) {
      setTimeout(poll, intervalMs)
    }
  }

  poll()

  return {
    stop: () => { stopped = true }
  }
}

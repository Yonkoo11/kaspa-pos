let cachedPrice: number | null = null
let cacheTime = 0
const CACHE_TTL = 60_000 // 60 seconds

export async function getKASPrice(): Promise<number> {
  const now = Date.now()
  if (cachedPrice !== null && now - cacheTime < CACHE_TTL) {
    return cachedPrice
  }

  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=kaspa&vs_currencies=usd'
    )
    if (!res.ok) throw new Error('Price fetch failed')
    const data = await res.json()
    cachedPrice = data.kaspa?.usd ?? null
    cacheTime = now
    if (cachedPrice !== null) return cachedPrice
  } catch {
    // fallback
  }

  // Fallback: try Kaspa API market data
  try {
    const res = await fetch('https://api.kaspa.org/info/price')
    if (res.ok) {
      const data = await res.json()
      cachedPrice = data.price ?? 0.10
      cacheTime = now
      return cachedPrice!
    }
  } catch {
    // use fallback
  }

  return cachedPrice ?? 0.10
}

export function kasToUsd(kas: number, price: number): number {
  return kas * price
}

export function usdToKas(usd: number, price: number): number {
  if (price <= 0) return 0
  return usd / price
}

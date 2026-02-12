export type POSState = 'idle' | 'charging' | 'waiting' | 'confirmed'

export interface Payment {
  id: string
  amountKAS: number
  amountUSD: number
  address: string
  txId: string | null
  requestedAt: number
  confirmedAt: number | null
  confirmationMs: number | null
}

export interface UTXO {
  transactionId: string
  index: number
  amount: number // sompi
  scriptPublicKey: string
  blockDaaScore: number
}

export interface UTXOResponse {
  address: string
  outpoint: {
    transactionId: string
    index: number
  }
  utxoEntry: {
    amount: string
    scriptPublicKey: {
      scriptPublicKey: string
    }
    blockDaaScore: string
    isCoinbase: boolean
  }
}

export interface zkSyncEraListItemType {
  address: string
  marker?: string[]
  eth_balance?: string
  eth_tx_amount?: string
  zkSyncLiteEth?: string
  zkSyncLiteTx?: string
  zkSyncEraEth?: string
  zkSyncEraUsdc?: string
  zkSyncEraTx?: string

  l1Tol2Times?: number
  l2Tol1Times?: number
  l1Tol2Amount?: string
  l2Tol1Amount?: string

  zks2_last_tx?: string
  zks2_last_tx_timestamp?:number
  totalExchangeAmount?: string
  totalFee?: string
  dayActivity?: string
  weekActivity?: string
  monthActivity?: string
  contractActivity?: string

  failedTimes?: number
}
export type zkSyncEraListType = zkSyncEraListItemType[]

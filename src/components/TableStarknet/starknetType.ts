export interface starknetListItemType {
  address: string
  marker?: string[]

  eth_balance?: string
  stark_id?: string
  starknetTx?: string


  DEPOSIT_AND_WITHDRAW: {
    d_eth_amount?: number;
    d_eth_count?: number;
    d_usdc_amount?: number;
    d_usdc_count?: number;
    d_usdt_amount?: number;
    d_usdt_count?: number;
    d_dai_amount?: number;
    d_dai_count?: number;
    d_wbtc_amount?: number;
    d_wbtc_count?: number;
    w_eth_amount?: number;
    w_eth_count?: number;
    w_usdc_amount?: number;
    w_usdc_count?: number;
    w_usdt_amount?: number;
    w_usdt_count?: number;
    w_dai_amount?: number;
    w_dai_count?: number;
    w_wbtc_amount?: number;
    w_wbtc_count?: number;
    total_deposit_count?: number;
    total_withdraw_count?: number;
  }

  starknet_last_tx?: string
  stark_latest_tx_timestamp?: number
  // totalExchangeAmount?: string
  // totalFee?: string
  dayActivity?: string
  weekActivity?: string
  monthActivity?: string
  // contractActivity?: string
}
export type starknetListType = starknetListItemType[]

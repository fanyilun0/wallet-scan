import type { starknetListItemType } from './starknetType'

export const BridgeTokenList = ['ETH', 'USDT', 'USDC', 'DAI', 'WBTC']

const getSorter = (key: keyof starknetListItemType) => {
  if (!key)
    return () => { }
  return (row1: any, row2: any) => row1[key] - row2[key]
}


export const starkBaseCols = [
  {
    title: 'Address',
    key: 'address',
    width: 200,
  },
  {
    title: 'ID',
    key: 'stark_id',
    width: 80,
  },
]

export const starknetBalanceCols = BridgeTokenList.slice(0, -1).map(token => ({
  title: token,
  width: 60,
  key: `balance_${token}`.toLowerCase(),
}))

const starknetTxCols = [
  {
    title: 'TX',
    width: 60,
    key: 'starknetTx',
    sorter: getSorter('starknetTx'),
  },
]


const starknetBridgeDepositCols = BridgeTokenList.map((token) => ({
  title: token,
  key: `D_${token}`,
  width: 60,
}))

const starknetBridgeWithdrawCols = BridgeTokenList.map((token) => ({
  title: token,
  key: `W_${token}`,
  width: 60,
}))

const starknetBridgeCols = [
  {
    title: 'Starkgate bridge cross-chain L1→L2',
    children: [...starknetBridgeDepositCols, {
      title: 'Total',
      key: 'total_deposit_count',
      width: 50,
    }]
  },
  {
    title: 'Starkgate bridge cross-chain L2→L1',
    children: [...starknetBridgeWithdrawCols, {
      title: 'Total',
      key: 'total_withdraw_count',
      width: 50,
    }],
  },
]

const starknetActivityCols = [
  {
    title: 'Activity',
    children: [
      { width: 100, key: 'stark_latest_tx', title: 'Latest', className: 'last-tx', sorter: getSorter('stark_latest_tx_timestamp') },
      { width: 55, key: 'dayActivity', title: 'D' },
      { width: 55, key: 'weekActivity', title: 'W' },
      { width: 60, key: 'monthActivity', title: 'M' },
      // { width: 50, key: 'contractActivity', title: '合约' },
      // {
      //   key: 'totalExchangeAmount',
      //   title: '交易金额(U)',
      //   width: 120,
      //   sorter: getSorter('totalExchangeAmount'),
      // },
      // {
      //   key: 'totalFee',
      //   title: 'Fee',
      //   width: 80,
      //   sorter: getSorter('totalExchangeAmount'),
      // },
    ],
  },
]
export const starknetCols = {
  title: 'starknet',
  key: 'starknet',
  className: 'zks_era',
  children: [
    ...starknetTxCols,
    ...starknetBridgeCols,
    ...starknetActivityCols,
  ],
}

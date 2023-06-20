import type { zkSyncEraListItemType } from './zksyncEraType'

export const etherCols = {
  title: 'ETH',
  key: 'ETH',
  className: 'zks_eth',
  children: [
    {
      title: 'ETH',
      width: 70,
      key: 'eth_balance',
    },
    {
      title: 'TX',
      width: 55,
      key: 'eth_tx_amount',
    },
  ],
}

const getSorter = (key: keyof zkSyncEraListItemType) => {
  if (!key)
    return () => { }
  return (row1: any, row2: any) => row1[key] - row2[key]
}

export const zkSyncLiteCols = {
  title: 'zkSyncLite',
  key: 'zkSyncLite',
  className: 'zks_lite',
  children: [
    {
      title: 'ETH',
      width: 70,
      key: 'zkSyncLiteEth',
    },
    {
      title: 'TX',
      width: 40,
      key: 'zkSyncLiteTx',
    },
  ],
}

const zkSyncEraBalanceCols = [
  {
    title: 'ETH',
    width: 70,
    key: 'zkSyncEraEth',
  },
  {
    title: 'USDC',
    width: 60,
    key: 'zkSyncEraUsdc',
  },
]
const zkSyncEraTxCols = [
  {
    title: 'TX',
    width: 60,
    key: 'zkSyncEraTx',
    sorter: getSorter('zkSyncEraTx'),
  },
  {
    title: 'Failed',
    width: 60,
    key: 'failedTimes',
  },
  { width: 80, key: 'contractActivity', title: 'Contract' },

]
const zkSyncEraBridgeTxCols = [
  {
    title: 'L1→L2',
    key: 'l1Tol2Times',
  },
  {
    title: 'L2→L1',
    key: 'l2Tol1Times',
  },
]
const zkSyncEraBridgeAmountCols = [
  {
    title: 'L1→L2',
    key: 'l1Tol2Amount',

  },
  {
    title: 'L2→L1',
    key: 'l2Tol1Amount',

  },
]
const zkSyncEraBridgeCols = [
  {
    title: 'Bridge Times',
    key: 'zkSyncEraTx',
    width: 100,
    children: zkSyncEraBridgeTxCols,
  },
  {
    title: 'Bridge balance (ETH)',
    width: 100,
    key: 'zkSyncEraBalance',
    children: zkSyncEraBridgeAmountCols,
  },
]

const zkSyncEraActivityCols = [
  {
    title: 'Activity',
    children: [
      { width: 100, key: 'zks2_last_tx', title: 'Latest', className: 'last-tx', sorter: getSorter('zks2_last_tx_timestamp') },
      { width: 40, key: 'dayActivity', title: 'D' },
      { width: 40, key: 'weekActivity', title: 'W' },
      { width: 40, key: 'monthActivity', title: 'M' },
      {
        key: 'totalExchangeAmount',
        title: 'Volume($)',
        width: 110,
        sorter: getSorter('totalExchangeAmount'),
      },
      {
        key: 'totalFee',
        title: 'Fee',
        width: 80,
        sorter: getSorter('totalExchangeAmount'),
      },
    ],
  },
]
export const zkSyncEraCols = {
  title: 'zkSyncEra',
  key: 'zkSyncEra',
  className: 'zks_era',
  children: [
    ...zkSyncEraBalanceCols,
    ...zkSyncEraTxCols,
    ...zkSyncEraBridgeCols,
    ...zkSyncEraActivityCols,
  ],
}

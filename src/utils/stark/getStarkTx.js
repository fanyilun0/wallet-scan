import axios from 'axios'

function getDayNumber(d) {
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`
}

function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}W${weekNo}`
}

function getMonthNumber(d) {
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`
}

async function getStarkTx(address) {
  const days = new Set()
  const weeks = new Set()
  const months = new Set()
  function calcActivity(timestamp) {
    const receivedAt = new Date(timestamp)
    days.add(getDayNumber(receivedAt))
    weeks.add(getWeekNumber(receivedAt))
    months.add(getMonthNumber(receivedAt))
  }


  try {
    let tx = 0
    let hasNextPage
    let endCursor
    const url = 'https://starkscan.stellate.sh/'
    const headers = {
      'authority': 'starkscan.stellate.sh',
      'accept': 'application/json',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'content-type': 'application/json',
    }
    const Json_data = {
      query: 'query TransactionsTableQuery(\n  $first: Int!\n  $after: String\n  $input: TransactionsInput!\n) {\n  ...TransactionsTablePaginationFragment_transactions_2DAjA4\n}\n\nfragment TransactionsTableExpandedItemFragment_transaction on Transaction {\n  entry_point_selector_name\n  calldata_decoded\n  entry_point_selector\n  calldata\n  initiator_address\n  initiator_identifier\n  main_calls {\n    selector\n    selector_name\n    calldata_decoded\n    selector_identifier\n    calldata\n    contract_address\n    contract_identifier\n    id\n  }\n}\n\nfragment TransactionsTablePaginationFragment_transactions_2DAjA4 on Query {\n  transactions(first: $first, after: $after, input: $input) {\n    edges {\n      node {\n        id\n        ...TransactionsTableRowFragment_transaction\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment TransactionsTableRowFragment_transaction on Transaction {\n  id\n  transaction_hash\n  block_number\n  transaction_status\n  transaction_type\n  timestamp\n  initiator_address\n  initiator_identifier\n  initiator {\n    is_social_verified\n    id\n  }\n  main_calls {\n    selector_identifier\n    id\n  }\n  ...TransactionsTableExpandedItemFragment_transaction\n}\n',
      variables: {
        first: 30,
        after: null,
        input: {
          initiator_address: address,
          sort_by: 'timestamp',
          order_by: 'desc',
          min_block_number: null,
          max_block_number: null,
          min_timestamp: null,
          max_timestamp: null,
        },
      },
    }
    const response = await axios.post(url, Json_data, { headers })
    for (let i = 0; i < response.data.data.transactions.edges.length; i++) {
      if (response.data.data.transactions.edges[i].node.transaction_type === 'INVOKE_FUNCTION') {
        tx += 1
        // 计算活跃时间
        calcActivity(response.data.data.transactions.edges[i].node.timestamp * 1000)
      }
    }
    hasNextPage = response.data.data.transactions.pageInfo.hasNextPage
    const timestamp = response.data.data.transactions.edges[0].node.timestamp
    const latestDate = new Date(timestamp * 1000)
    const year = latestDate.getFullYear()
    let month = latestDate.getMonth() + 1
    let date = latestDate.getDate()
    if (month < 10)
      month = `0${month}`
    if (date < 10)
      date = `0${date}`
    const formattedDate = `${year}/${month}/${date}`
    if (hasNextPage === true) {
      endCursor = response.data.data.transactions.pageInfo.endCursor
      while (hasNextPage) {
        Json_data.variables.after = endCursor
        const response = await axios.post(url, Json_data, { headers })
        hasNextPage = response.data.data.transactions.pageInfo.hasNextPage
        endCursor = response.data.data.transactions.pageInfo.endCursor
        for (let i = 0; i < response.data.data.transactions.edges.length; i++) {
          if (response.data.data.transactions.edges[i].node.transaction_type === 'INVOKE_FUNCTION') {
            tx += 1
            // 计算活跃时间
            calcActivity(response.data.data.transactions.edges[i].node.timestamp * 1000)
          }
        }
      }
    }
    console.log(tx, formattedDate)
    return {
      starknetTx:tx, stark_latest_tx: formattedDate, stark_latest_tx_timestamp: timestamp,
      dayActivity: days.size, weekActivity: weeks.size, monthActivity: months.size,
    }
  }
  catch (error) {
    console.error(error)
    return {
      starknetTx: 'Error', stark_latest_tx: 'Error', stark_latest_tx_timestamp: 'Error',
      dayActivity: 'Error', weekActivity: 'Error', monthActivity: 'Error',
    }
  }
}

export default getStarkTx

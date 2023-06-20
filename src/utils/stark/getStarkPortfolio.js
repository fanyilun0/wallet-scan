import axios from 'axios'


async function getStarkPortfolio(address) {
  try {
    const url = 'https://starkscan.stellate.sh/'
    const headers = {
      'authority': 'starkscan.stellate.sh',
      'accept': 'application/json',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6',
      'content-type': 'application/json',
    }
    const Json_data = {
      query: `query ERC20BalancesByOwnerAddressTableQuery(
        $input: ERC20BalancesByOwnerAddressInput!
      ) {
        erc20BalancesByOwnerAddress(input: $input) {
          id
          ...ERC20BalancesByOwnerAddressTableRowFragment_erc20Balance
        }
      }

      fragment ERC20BalancesByOwnerAddressTableRowFragment_erc20Balance on ERC20Balance {
        id
        contract_address
        contract_erc20_identifier
        contract_erc20_contract {
          symbol
          is_social_verified
          icon_url
          id
        }
        balance_display
      }
      `,
      variables: {
        input: {
          owner_address: address
        }
      },
    }
    const response = await axios.post(url, Json_data, { headers })
    const {erc20BalancesByOwnerAddress} = response.data.data;
    const TOKEN_LIST = ['ETH','USDC','USDT','DAI']
    const balances = {}
    for (const token of erc20BalancesByOwnerAddress) {
      const {balance_display, contract_erc20_contract} = token;
      const {symbol} = contract_erc20_contract;
      if (TOKEN_LIST.includes(symbol)) {
        balances[symbol] =parseFloat( balance_display).toFixed(3)
      }
    }

    return {
      balance_eth: balances['ETH'] ?? 0,
      balance_usdc: balances['USDC'] ?? 0,
      balance_usdt: balances['USDT'] ?? 0,
      balance_dai: balances['DAI'] ?? 0,
    }
  }
  catch (e) {
    console.log(e)
    return {
      balance_eth: 'Error',
      balance_usdc: 'Error',
      balance_usdt: 'Error',
      balance_dai: 'Error',
    }
  }
}

export default getStarkPortfolio;

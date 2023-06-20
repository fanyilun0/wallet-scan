import axios from 'axios'

const getGasPrice = async () => {
  try {
    const options = {
      method: 'GET',
      url: 'https://api.blocknative.com/gasprices/blockprices',
    }

    const response = await axios.request(options);
    const { blockPrices } = response.data
    const [{baseFeePerGas}]= blockPrices;
    return baseFeePerGas.toFixed(2)
  }
  catch (e) {
    console.error(e)
    return '/'
  }
}

export default getGasPrice

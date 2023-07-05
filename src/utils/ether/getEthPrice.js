import axios from 'axios'
import { ref } from 'vue'

export const ethPrice = ref(0)

const getEthPrice = async () => {
  try {
    const options = {
      method: 'GET',
      url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
    }
    const response = await axios.request(options)
    // return response.data.USD
    ethPrice.value = response.data.USD;
  }
  catch (e) {
    console.log(e)
    return '/'
  }
}

getEthPrice()
setInterval(getEthPrice, 15 * 1000);

export default getEthPrice

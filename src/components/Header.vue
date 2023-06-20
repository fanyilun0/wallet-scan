<script lang="ts" setup>
import { h } from 'vue'
import { MenuOption, NA, NumberAnimationInst } from 'naive-ui'
import { RouterLink } from 'vue-router'
import getEthPrice from "~/utils/ether/getEthPrice.js";
import getGasPrice from "~/utils/ether/getGasPrice.js";

const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)
const numberAnimationInstRef1 = ref<NumberAnimationInst | null>(null)
const eth_price_from = ref(0);
const eth_price_to = ref(0);
const min_price = ref(1000);
const max_price = ref(1);
const gas_price_from = ref(0);
const gas_price_to = ref(0);
const badgeOffser = [-66,-6];
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'index',
          },
        },
        { default: () => 'zkSync era' },
      ),
    key: 'zkSyncEra',
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: 'starknet',
          },
        },
        { default: () => 'starknet' },
      ),
    key: 'starknet',
  },
]

const requestEthPrice = () => {
  getEthPrice().then((price) => {
    if (price) {
      eth_price_from.value = +eth_price_to.value
      eth_price_to.value = +price

      numberAnimationInstRef1.value?.play()
    }
  })
}

const requestGasPrice = () => {
  getGasPrice().then((price) => {
    if (price) {
      gas_price_from.value = +gas_price_to.value
      gas_price_to.value = +price
      if (min_price.value > gas_price_to.value) {
        min_price.value = gas_price_to.value
      }
      if (max_price.value < gas_price_to.value) {
        max_price.value = gas_price_to.value
      }
      numberAnimationInstRef.value?.play()
    }
  })
}
setInterval(requestEthPrice, 15 * 1000);
setInterval(requestGasPrice, 15 * 1000);
requestEthPrice();
requestGasPrice();
</script>

<template>
  <div text="center" relative>
    <n-menu mode="horizontal" :options="menuOptions" />
    <n-space inline align="center" h="42px" absolute right="0" text-lg>
      <n-a target="_blank" href="https://twitter.com/fanyilun0">
        <div i-carbon-logo-twitter></div>
      </n-a>
      <n-a target="_blank" href="https://github.com/fanyilun0/wallet-scan">
        <div i-carbon-logo-github></div>
      </n-a>

      <router-link to="/coffee">
        <n-a>
          <div i-carbon-star></div>
        </n-a>
      </router-link>

      <n-badge type="success" :value="`${min_price}-${max_price}`" :offset="badgeOffser">
        <n-a target="_blank" href="https://etherscan.io/gastracker">
          <div flex items="center">
            <div i-carbon-gas-station></div>
            <div w="100px"><n-number-animation ref="numberAnimationInstRef" :from="gas_price_from" :to="gas_price_to"
                :duration="600" :precision="2"></n-number-animation> Gwei</div>
          </div>
        </n-a>
      </n-badge>

      <n-a target="_blank" href="https://etherscan.io/chart/etherprice">
        <div w="170px">ETH Price: $
          <n-number-animation ref="numberAnimationInstRef1" :from="eth_price_from" :to="eth_price_to" :duration="600"
            :precision="2"></n-number-animation>
        </div>
      </n-a>
    </n-space>
  </div>
</template>

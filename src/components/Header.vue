<script lang="ts" setup>
import { h } from 'vue'
import { MenuOption, NA, NumberAnimationInst } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { ethPrice } from "~/utils/ether/getEthPrice.js";
import getGasPrice from "~/utils/ether/getGasPrice.js";
import { useLocalStorage } from '@vueuse/core';

interface GasLog {
  gas: string;
  time: string;
}

const minGasLog = useLocalStorage<GasLog[]>('minGasLog', []);
const maxGasLog = useLocalStorage<GasLog[]>('maxGasLog', []);
const showGasLog = ref(false);
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)
const numberAnimationInstRef1 = ref<NumberAnimationInst | null>(null)
const eth_price_from = ref(0);
const eth_price_to = ref(0);
const min_price = ref(minGasLog?.value[0]?.gas || 1000);
const max_price = ref(maxGasLog?.value[0]?.gas || 0);
const gas_price_from = ref(0);
const gas_price_to = ref(0);
const badgeOffser = [-66, -6];
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

// const requestEthPrice = () => {
//   getEthPrice().then((price: string) => {
//     if (price) {
//       eth_price_from.value = +eth_price_to.value
//       eth_price_to.value = +price

//       numberAnimationInstRef1.value?.play()
//     }
//   })
// }

watch(ethPrice,(price: number) => {
  if (price) {
    eth_price_from.value = +eth_price_to.value
    eth_price_to.value = +price

    numberAnimationInstRef1.value?.play()
  }
})

const requestGasPrice = () => {
  getGasPrice().then((price: string) => {
    if (price) {
      gas_price_from.value = +gas_price_to.value
      gas_price_to.value = +price
      if (min_price.value > gas_price_to.value) {
        min_price.value = gas_price_to.value
        minGasLog.value.unshift({ gas: price, time: new Date().toLocaleString() });
        if (minGasLog.value.length > 25) minGasLog.value.pop()
      }
      if (max_price.value < gas_price_to.value) {
        max_price.value = gas_price_to.value
        maxGasLog.value.unshift({ gas: price, time: new Date().toLocaleString() });
        if (minGasLog.value.length > 25) minGasLog.value.pop()
      }
      numberAnimationInstRef.value?.play()
    }
  })
}
// setInterval(requestEthPrice, 1.5 * 1000);
// requestEthPrice();
setInterval(requestGasPrice, 5 * 1000);
requestGasPrice();
</script>

<template>
  <div text="center" relative>
    <n-menu mode="horizontal" :options="menuOptions" text-xl />
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

      <n-badge type="success" :value="`${min_price}-${max_price}`" :offset="badgeOffser" @click="showGasLog = true">
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

    <n-modal v-model:show="showGasLog" preset="dialog" title="Gas Log" width="400px">
      <n-scrollbar style="max-height: 520px">
        <n-space justify="space-between" p="l-2 r-4">
          <n-timeline>
            <n-timeline-item v-for="item in minGasLog" :key="item.time" :type="+item.gas <= 15 ? 'success' : 'info'"
              :title="item.gas" :time="item.time" />
          </n-timeline>
          <n-timeline>
            <n-timeline-item v-for="item in maxGasLog" :key="item.time" :type="+item.gas >= 25 ? 'error' : 'warning'"
              :title="item.gas" :time="item.time" />
          </n-timeline>
        </n-space>
      </n-scrollbar>
    </n-modal>
  </div>
</template>

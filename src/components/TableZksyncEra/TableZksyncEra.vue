<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { last } from 'lodash'
import type { DataTableBaseColumn, DataTableColumn, DataTableRowKey } from 'naive-ui'
import { NA, NButton, NDynamicTags, NPopconfirm, NProgress, NSpin, RowKey } from 'naive-ui'
import { etherCols, zkSyncEraCols, zkSyncLiteCols } from './createCols'
import type { zkSyncEraListItemType, zkSyncEraListType } from './zksyncEraType'
import { useLocalStorage } from './use-local-storage.hook'
import { e } from './address'
import {
  getEthBalance,
  getTxCount,
  getZkSyncBridge,
  getZksEra,
  getZksLite,
} from '~/utils'
import { InternalRowData } from 'naive-ui/es/data-table/src/interface'
import { useClipboard } from '@vueuse/core'

const { text, copy, copied, isSupported } = useClipboard()
const { getDataStorage, updateDataStroage, debounceUpdateDataStorage, createTarget, updateTargetStroage } = useLocalStorage()
const data = ref<zkSyncEraListType>(getDataStorage())
const columns = ref<DataTableColumn[]>(attachColCommonProps(createCols()))
const isCompleteMode = computed(() => {
  return last(columns.value)?.key === 'actions'
})
const addresses = ref('')
const checkedRowKeys = ref<DataTableRowKey[]>([])
const showAddAddressModal = ref(false)
const showTargetModal = ref(false)
const targetModel = reactive(createTarget())
const targetModelForm = reactive(createTarget())
const renderCell = (value: string | number, rowData: zkSyncEraListItemType, column: DataTableBaseColumn) => {
  if (value === undefined)
    return h(NSpin, { size: 20 })

  if (column.key === 'zks2_last_tx') {
    return h(NA, {
      href: `https://explorer.zksync.io/address/${rowData.address}`,
      target: '_blank',
    }, () => value)
  }

  if (column.key === 'address') {
    return h('div', { 'relative': '', }, [
      h(NA, {
        href: `https://zksync2-mainnet.zkscan.io/address/${rowData.address}`,
        target: '_blank',
      }, () => rowData.address),
      isSupported ? h('span', {
        class: [{ 'i-carbon-copy': true, copied: text.value === rowData.address }],
        w: '16px', absolute: '',  cursor: 'pointer',
        style: {'right':'-6px', 'bottom':'4px'},
        onClick: () => copy(rowData.address)
      }) : null
    ])
  }


  if (column.key === 'eth_balance') {
    return h(NA, {
      href: `https://debank.com/profile/${rowData.address}`,
      target: '_blank',
    }, () => value)
  }

  if (column.key === 'zkSyncEraTx') {
    return h(NA, {
      href: `https://byfishh.github.io/zk-flow/?address=${rowData.address}`,
      target: '_blank',
    }, () => value)
  }

  return value
}
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedRowKeys.value = rowKeys
}

function attachColCommonProps(columns: DataTableColumn[]): DataTableColumn[] {
  if (columns) {
    columns.forEach(column => {
      column.align = 'center';
      const { children } = column as any;
      if (children) {
        attachColCommonProps(children)
      }
    })
  }

  return columns;
}

function createCols(): DataTableColumn[] {
  return [
    {
      type: 'selection',
      width: 40
    },
    {
      title: 'Comment',
      key: 'marker',
      width: 160,
      render(row: InternalRowData) {
        return h(NDynamicTags, {
          'value': row.marker,
          'input-style': {
            maxWidth: '120px',
          },
          'onUpdate:value': (m: string[]) => { row.marker = m; updateDataStroage(data.value) },
        })
      },
    },
    {
      title: 'Progress',
      key: 'marker',
      width: 80,
      render(row: InternalRowData) {
        const percentage = (typeof row.zkSyncEraTx === 'number') ? Math.ceil(row.zkSyncEraTx * 100 / targetModel.zkSyncEraTx) : 0
        const isSuccess = percentage > 100
        return h(NA, { target: "_blank", href: `https://minitoolkit.org/?address=${row.address}` },
          () => h(NProgress, {
            type: 'line',
            percentage,
            status: isSuccess ? 'success' : '',
            indicatorPlacement: 'inside',
            processing: !isSuccess,
          }))
      },
    },
    {
      title: 'Address',
      key: 'address',
      width: 200,
    },
    etherCols, zkSyncLiteCols, zkSyncEraCols,
    {
      title: 'Act',
      key: 'actions',
      width: 80,
      render(row: InternalRowData) {
        return h(NPopconfirm, {
          onPositiveClick: () => deleteConfirm(row as unknow as zkSyncEraListItemType),
        }, {
          trigger: () =>
            h(NButton,
              { type: 'error', size: "small" },
              () => h('div', { className: 'i-carbon-trash-can' })),

          default: () => 'Confirm delete',
        })
      },
    },
  ]
}
function createSimpleCols(): DataTableColumn[] {
  // 移除备注/进度/ETH/操作列
  return [
    {
      type: 'selection',
    },
    {
      title: 'Address',
      key: 'address',
      width: 200,
    },
    etherCols, zkSyncLiteCols, zkSyncEraCols,
  ]
}

function deleteConfirm(row: zkSyncEraListItemType) {
  if (row.address) {
    const index = data.value.findIndex(item => item.address === row.address)
    if (index > -1) {
      data.value.splice(index, 1)
      updateDataStroage(data.value)
    }
  }
}
function deleteRows() {
  if (checkedRowKeys.value.length) {
    checkedRowKeys.value.forEach((key) => {
      const row = data.value.find(item => item.address === key)
      if (row)
        deleteConfirm(row)
    })

    debounceUpdateDataStorage(data.value)
  }
}

function getEthByAddress(address: string) {
  Promise.all([
    getEthBalance(address, 'ethereum'),
    getTxCount(address, 'ethereum'),
  ]).then((res) => {
    const [eth_balance, eth_tx_amount] = res
    const padding = {
      eth_balance,
      eth_tx_amount,
    }
    updateData(address, padding)
  })
}

function updateData(address: string, padding: Record<string, any>) {
  if (!address)
    return
  if (!padding)
    return
  const updateData: any = data.value.find(item => item.address === address)
  if (!updateData) {
    return data.value.push({
      address,
      ...padding,
    } as zkSyncEraListItemType)
  }

  // update all properties in data with address
  for (const key in padding) {
    if (Object.prototype.hasOwnProperty.call(padding, key)) {
      const element = padding[key]
      updateData[key] = element
    }
  }
  // update localstorage
  debounceUpdateDataStorage(data.value)
}

function getDataByAddress(address: string) {
  if (address.length !== 42) {
    console.error(`${address} \n 地址解析错误,请输入正确的地址`)
    return
  }

  if (!data.value.find(item => item.address === address)) {
    updateData(address, { marker: [] })
  }

  getEthByAddress(address)
  getZksLite(address).then((res) => {
    const { balance1, tx1 } = res
    const padding = {
      zkSyncLiteEth: String(balance1),
      zkSyncLiteTx: tx1,
    }
    updateData(address, padding)
  })
  getZksEra(address).then((res) => {
    const { balance2, tx2, usdcBalance } = res
    const padding = {
      zkSyncEraEth: String(balance2),
      zkSyncEraUsdc: String(usdcBalance),
      zkSyncEraTx: tx2,
    }
    updateData(address, padding)
  })
  getZkSyncBridge(address).then((res) => {
    const padding = res
    updateData(address, padding)
  })
}

function refresh() {
  checkedRowKeys.value.forEach((address: RowKey) => {
    const index = data.value.findIndex(item => item.address === address)
    const { marker } = data.value[index]
    data.value[index] = { address, marker } as zkSyncEraListItemType
    setTimeout(() => {
      getDataByAddress(address)
    }, 200)
  })
}

function toggleMode() {
  const newColums = !isCompleteMode.value ? createCols() : createSimpleCols()
  columns.value = attachColCommonProps(newColums)
}

function submitAddress() {
  const ads = addresses.value.split('\n').filter(Boolean)
  ads.map(getDataByAddress)
  addresses.value = ''
}

function submitTarget() {
  updateTargetStroage(targetModelForm)
  targetModel.zkSyncEraTx = targetModelForm.zkSyncEraTx;
}

// init
// e.map(getDataByAddress)
</script>

<template>
  <n-space mb="4" justify="space-between">
    <n-space>
      <n-button type="primary" @click="showAddAddressModal = true">
        Add Address
      </n-button>
      <n-button type="info" @click="refresh">
        Refresh
      </n-button>

      <NPopconfirm @positive-click="deleteRows">
        <template #trigger>
          <n-button type="error">
            delete
          </n-button>
        </template>
        Confirm delete chosen address?
      </NPopconfirm>
    </n-space>

    <n-space>
      <n-button secondary round type="info" @click="showTargetModal = true">
        Target Config
      </n-button>
      <n-button secondary round type="info" @click="toggleMode">
        {{ isCompleteMode ? 'Simple' : 'Complete' }} Mode
      </n-button>
    </n-space>
  </n-space>


  <n-data-table size="small" title-align="center" align="center" :data="data" :columns="columns" :single-line="false"
    max-height="72vh" :render-cell="renderCell" :checked-row-keys="checkedRowKeys" :row-key="rowData => rowData.address"
    @update:checked-row-keys="handleCheck" />

  <n-modal v-model:show="showTargetModal" preset="dialog" title="Set wallet interaction target" positive-text="Confirm"
    negative-text="Cancel" @positive-click="submitTarget">
    <n-form ref="formRef" :model="targetModelForm" label-placement="left" label-width="auto"
      require-mark-placement="right-hanging" size="small" :style="{
        maxWidth: '640px',
      }">
      <n-form-item label="zkSyncEra Tx Counts ≥" path="zkSyncEraTx">
        <n-input-number v-model:value="targetModelForm.zkSyncEraTx" />
      </n-form-item>
    </n-form>
  </n-modal>

  <n-modal v-model:show="showAddAddressModal" preset="dialog" title="Add Address" positive-text="Confirm"
    negative-text="Cancel" @positive-click="submitAddress">
    <n-input v-model:value="addresses" type="textarea" placeholder="One line, one address." />
  </n-modal>
</template>

<style src="./index.css"></style>

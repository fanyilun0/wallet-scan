<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { last } from 'lodash'
import { DataTableBaseColumn, DataTableColumn, DataTableRowKey, NText, NBadge } from 'naive-ui'
import { NA, NButton, NDynamicTags, NPopconfirm, NProgress, NSpin, RowKey } from 'naive-ui'
import { starkBaseCols, starknetCols, starknetBalanceCols, BridgeTokenList } from './createCols'
import type { starknetListItemType, starknetListType } from './starknetType'
import { useLocalStorage } from './use-local-storage.hook'
import { s } from './address'
import {
  getStarkTx,
  getStarkInfo,
  getStarkBridge,
  getStarkPortfolio,
} from '~/utils'
import { InternalRowData } from 'naive-ui/es/data-table/src/interface'

const { getDataStorage, updateDataStroage, debounceUpdateDataStorage, createTarget, updateTargetStroage } = useLocalStorage()
const data = ref<starknetListType>(getDataStorage())
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
const DEPOSIT_AND_WITHDRAW_KEYS = BridgeTokenList.map(t => [`D_${t}`, `W_${t}`]).flat()
const renderCell = (value: string | number, rowData: starknetListItemType, column: DataTableBaseColumn) => {
  if (value === undefined && !DEPOSIT_AND_WITHDRAW_KEYS.includes(column.key as string)) {
    return h(NSpin, { size: 20 })
  }

  if (column.key === 'zks2_last_tx') {
    return h(NA, {
      href: `https://starkscan.co/contract/${rowData.address}#transactions`,
      target: '_blank',
    }, () => value)
  }

  if (column.key === 'address') {
    return h(NA, {
      href: `https://starkscan.co/contract/${rowData.address}`,
      target: '_blank',
    }, () => rowData.address)
  }

  if (DEPOSIT_AND_WITHDRAW_KEYS.includes(column.key as string)) {
    const lowerKey = (column.key as string).toLowerCase()
    const amountKey = `${lowerKey}_amount`
    const countKey = `${lowerKey}_count`
    const { DEPOSIT_AND_WITHDRAW } = rowData;
    if (!DEPOSIT_AND_WITHDRAW || Object.keys(DEPOSIT_AND_WITHDRAW).length === 0) return h(NSpin, { size: 20 })
    const amount = DEPOSIT_AND_WITHDRAW[amountKey as keyof starknetListItemType["DEPOSIT_AND_WITHDRAW"]]
    const count = DEPOSIT_AND_WITHDRAW[countKey as keyof starknetListItemType["DEPOSIT_AND_WITHDRAW"]]
    return h(NBadge, { value: count, type: 'success', offset: [8, -4] }, () => h(NText, () => amount))
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
        const percentage = (typeof row.starknetTx === 'number') ? Math.ceil(row.starknetTx * 100 / targetModel.starknetTx) : 0
        const isSuccess = percentage > 100
        return h(NProgress, {
          type: 'line',
          percentage,
          status: isSuccess ? 'success' : '',
          indicatorPlacement: 'inside',
          processing: !isSuccess,
        })
      },
    },
    ...starkBaseCols,
    {
      title: 'Balance',
      key: 'balance',
      children:
        starknetBalanceCols
    },
    starknetCols,
    {
      title: 'Act',
      key: 'actions',
      width: 57,
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
    /* etherCols, zkSyncLiteCols,  */starknetCols,
  ]
}

function deleteConfirm(row: starknetListItemType) {
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
    } as starknetListItemType)
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
  if (address.length !== 66) {
    console.error(`${address} \n 地址解析错误,请输入正确的地址`)
    return
  }

  if (!data.value.find(item => item.address === address)) {
    updateData(address, { marker: [] })

  }

  getStarkInfo(address).then((res) => {
    const {
      stark_id,
      deployed_at_timestamp,
    } = res;
    const padding = {
      stark_id,
      deployed_at_timestamp,
    }
    updateData(address, padding)
  })
  getStarkTx(address).then((res) => {
    const padding = res
    updateData(address, padding)
  })
  getStarkPortfolio(address).then((res) => {
    const padding = res
    updateData(address, padding)
  })

  getStarkBridge(address).then((res) => {
    const padding = res
    const { total_deposit_count, total_withdraw_count } = padding
    updateData(address, { DEPOSIT_AND_WITHDRAW: padding, total_deposit_count, total_withdraw_count })
  })

}

function refresh() {
  checkedRowKeys.value.forEach((address: RowKey) => {
    const index = data.value.findIndex(item => item.address === address)
    const { marker } = data.value[index]
    data.value[index] = { address, marker } as starknetListItemType
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
  targetModel.starknetTx = targetModelForm.starknetTx;
}

// init
s.map(getDataByAddress)
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

      <NPopconfirm  @positive-click="deleteRows">
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

    <n-modal v-model:show="showTargetModal" preset="dialog" title="Set wallet interaction target" positive-text="Confirm" negative-text="Cancel"
    @positive-click="submitTarget">
    <n-form ref="formRef" :model="targetModelForm" label-placement="left" label-width="auto"
      require-mark-placement="right-hanging" size="small" :style="{
        maxWidth: '640px',
      }">
      <n-form-item label="zkSyncEra Tx Counts ≥" path="starknetTx">
        <n-input-number v-model:value="targetModelForm.starknetTx" />
      </n-form-item>
    </n-form>
  </n-modal>

  <n-modal v-model:show="showAddAddressModal" preset="dialog" title="Add Address "
    @positive-click="submitAddress">
    <n-input v-model:value="addresses" type="textarea" placeholder="One line, one address." />
  </n-modal>
</template>

<style src="./index.css"></style>

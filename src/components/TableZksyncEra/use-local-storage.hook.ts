import { debounce } from 'lodash'
import type { zkSyncEraListType } from './zksyncEraType'

export function useLocalStorage() {
  const defaultData: zkSyncEraListType = []
  function getDataStorage() {
    if (localStorage.getItem('zksync-era-data'))
      return JSON.parse(localStorage.getItem('zksync-era-data') ?? JSON.stringify(defaultData))

    else
      return []
  }
  function updateDataStroage(data: zkSyncEraListType) {
    localStorage.setItem('zksync-era-data', JSON.stringify(data))
  }

  const defaultTarget = {
    zkSyncEraTx: 50,
  }
  function createTarget() {
    if (localStorage.getItem('zksync-era-target'))
      return JSON.parse(localStorage.getItem('zksync-era-target') ?? JSON.stringify(defaultTarget))

    else {
      updateTargetStroage(defaultTarget)
      return defaultTarget
    }
  }
  function updateTargetStroage(target) {
    localStorage.setItem('zksync-era-target', JSON.stringify(target))
  }

  return {
    getDataStorage,
    updateDataStroage,
    debounceUpdateDataStorage: debounce(updateDataStroage, 3000),
    createTarget,
    updateTargetStroage,
  }
}

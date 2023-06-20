import { debounce } from 'lodash'
import type { starknetListType } from './starknetType'

export function useLocalStorage() {
  const defaultData: starknetListType = []
  function getDataStorage() {
    if (localStorage.getItem('starknet-data'))
      return JSON.parse(localStorage.getItem('starknet-data') ?? JSON.stringify(defaultData))

    else
      return []
  }
  function updateDataStroage(data: starknetListType) {
    localStorage.setItem('starknet-data', JSON.stringify(data))
  }

  const defaultTarget = {
    starknetTx: 50,
  }
  function createTarget() {
    if (localStorage.getItem('starknet-target'))
      return JSON.parse(localStorage.getItem('starknet-target') ?? JSON.stringify(defaultTarget))

    else {
      updateTargetStroage(defaultTarget)
      return defaultTarget
    }
  }
  function updateTargetStroage(target) {
    localStorage.setItem('starknet-target', JSON.stringify(target))
  }

  return {
    getDataStorage,
    updateDataStroage,
    debounceUpdateDataStorage: debounce(updateDataStroage, 3000),
    createTarget,
    updateTargetStroage,
  }
}

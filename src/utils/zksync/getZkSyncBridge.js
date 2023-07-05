import axios from 'axios'
import { ethers } from 'ethers'
import { ethPrice } from "~/utils/ether/getEthPrice.js";
import { ZkSyncEraBaseUrl } from './baseUrl.js';

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

function getZkSyncLastTX(lastTxDatetime) {
  const date = new Date(lastTxDatetime)
  const offset = 8
  const utc8Date = new Date(date.getTime() + offset * 3600 * 1000)
  const now = new Date()
  const utc8Now = new Date(now.getTime() + offset * 3600 * 1000)
  const diff = utc8Now - utc8Date
  const diffInHours = Math.floor(diff / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays > 0)
    return `${diffInDays} days ago`

  else if (diffInHours > 0)
    return `${diffInHours} hours ago`

  else
    return 'just now'
}

async function getExchangeAmountProcessData(data/* , address */) {
  try {
    let totalExchangeAmount = 0;
    // const ethPrice = await getEthPrice();
    for (let i = 0; i < data.length; i++) {
      // const fromAddress = data[i].from;
      // const toAddress = data[i].to;
      const tokenAddress = data[i].tokenAddress;
      const amount = data[i].amount;
      // if (fromAddress.toLowerCase() == address.toLowerCase()) {
      if (
        tokenAddress.toLowerCase() ===
        "0x000000000000000000000000000000000000800A".toLowerCase()
      ) {
        totalExchangeAmount +=
          (Number(amount) / 10 ** 18) * parseFloat(ethPrice.value);
      }
      if (
        tokenAddress.toLowerCase() ===
        "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4".toLowerCase()
      ) {
        totalExchangeAmount += Number(amount) / 10 ** 6;
      }
      // }
    }
    return { totalExchangeAmount: totalExchangeAmount.toFixed(2) };
  } catch (e) {
    console.log(e)
    return { totalExchangeAmount: "-" }
  }
}

function processData(data, address) {
  let zks2_last_tx = "";
  let totalFee = 0;
  let l1Tol2Times = 0;
  let l1Tol2Amount = 0;
  let l2Tol1Times = 0;
  let l2Tol1Amount = 0;
  let contractActivity = new Set();
  let dayActivity = new Set();
  let weekActivity = new Set();
  let monthActivity = new Set();
  let failedTimes = 0
  let zks2_last_tx_timestamp
  for (let i = 0; i < data.length; i++) {
    const fromAddress = data[i].from;
    const toAddress = data[i].to;
    const fee = (parseInt(data[i].fee, 16) / 10 ** 18).toFixed(5);
    const receivedAt = data[i].receivedAt;
    const isL1Originated = data[i].isL1Originated;
    if (fromAddress.toLowerCase() === address.toLowerCase()) {
      dayActivity.add(getDayNumber(new Date(Date.parse(receivedAt))));
      weekActivity.add(getWeekNumber(new Date(Date.parse(receivedAt))));
      monthActivity.add(getMonthNumber(new Date(Date.parse(receivedAt))));
      if (zks2_last_tx === "") {
        zks2_last_tx = getZkSyncLastTX(receivedAt);
        zks2_last_tx_timestamp = new Date(receivedAt).getTime()
      }
      totalFee += parseFloat(fee);
      if (isL1Originated) {
        l1Tol2Times++;
        const value = ethers.formatEther(data[i].value);
        l1Tol2Amount += parseFloat(value);
      }
      if (
        toAddress.toLowerCase() ===
        "0x000000000000000000000000000000000000800A".toLowerCase()
      ) {
        l2Tol1Times++;
        const value = ethers.formatEther(data[i].value);
        l2Tol1Amount += parseFloat(value);
      }

      // failed time
      if (data[i].status === 'failed')
        failedTimes++
    }
    contractActivity.add(toAddress);
  }
  contractActivity = contractActivity.size;
  dayActivity = dayActivity.size;
  weekActivity = weekActivity.size;
  monthActivity = monthActivity.size;
  return {
    zks2_last_tx: zks2_last_tx === "" ? "无交易" : zks2_last_tx,
    totalFee: totalFee.toFixed(4),
    l1Tol2Times,
    l1Tol2Amount: l1Tol2Amount.toFixed(4),
    l2Tol1Times,
    l2Tol1Amount: l2Tol1Amount.toFixed(4),
    contractActivity,
    dayActivity,
    weekActivity,
    monthActivity,
    failedTimes,
    zks2_last_tx_timestamp
  };
}

async function getExchangeAmount(address) {
  let AllData = [];
  let nextLinks = "";

  const url = `${ZkSyncEraBaseUrl}address/${address}/transfers?&toDate=${encodeURIComponent(new Date().toISOString())}&pageSize=10&page=1`;
  const response = await axios.get(url);
  AllData = [...AllData, ...response.data.items];
  nextLinks =
    ZkSyncEraBaseUrl + response.data.links.next;
  while (nextLinks !== ZkSyncEraBaseUrl) {
    const response = await axios.get(nextLinks);
    AllData = [...AllData, ...response.data.items];
    nextLinks =
      ZkSyncEraBaseUrl +
      response.data.links.next;
  }
  return getExchangeAmountProcessData(AllData, address);
}

async function getZkSyncBridge(address) {
  try {
    let AllData = [];
    let nextLinks = "";
    const url = `${ZkSyncEraBaseUrl}transactions?address=${address}&toDate=${encodeURIComponent(new Date().toISOString())}&pageSize=10&page=1`;

    const response = await axios.get(url);
    AllData = [...AllData, ...response.data.items];
    nextLinks =
      ZkSyncEraBaseUrl + response.data.links.next;
    while (nextLinks !== ZkSyncEraBaseUrl) {
      const response = await axios.get(nextLinks);
      AllData = [...AllData, ...response.data.items];
      nextLinks =
        ZkSyncEraBaseUrl +
        response.data.links.next;
    }
    const promise = [processData(AllData, address), getExchangeAmount(address)];
    const [result, totalExchangeAmount] = await Promise.all(promise);
    console.log({ ...result, ...totalExchangeAmount })
    return {
      ...result,
      ...totalExchangeAmount,
    };
  } catch (e) {
    console.log(e)
    return {
      zks2_last_tx: "-",
      totalFee: "-",
      l1Tol2Times: "-",
      l1Tol2Amount: "-",
      l2Tol1Times: "-",
      l2Tol1Amount: "-",
      contractActivity: "-",
      dayActivity: "-",
      weekActivity: "-",
      monthActivity: "-",
      totalExchangeAmount: "-",
    }
  }

}

export default getZkSyncBridge

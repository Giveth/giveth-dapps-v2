import fetch from 'isomorphic-fetch'
// import Web3 from 'web3'
// import { GET_PROJECT_BY_ADDRESS } from '../apollo/gql/projects'
// import { GET_USER_BY_ADDRESS } from '../apollo/gql/auth'
import ERC20List from './erc20TokenList'
import { Contract } from '@ethersproject/contracts'

const xDaiChainId = 100
const appNetworkId = process.env.NEXT_PUBLIC_NETWORK_ID

export function pollEvery(fn: Function, delay: any) {
  let timer = -1
  let stop = false
  const poll = async (request: any, onResult: Function) => {
    const result = await request()
    if (!stop) {
      onResult(result)
      timer = setTimeout(poll.bind(null, request, onResult), delay)
    }
  }
  return (...params) => {
    const { request, onResult } = fn(...params)
    poll(request, onResult).then()
    return () => {
      stop = true
      clearTimeout(timer)
    }
  }
}

export async function getERC20Info({ library, tokenAbi, contractAddress, chainId }) {
  try {
    const instance = new Contract(contractAddress, tokenAbi, library)
    const name = await instance.name()
    const symbol = await instance.symbol()
    const decimals = await instance.decimals()
    const ERC20Info = {
      name,
      symbol,
      address: contractAddress,
      label: symbol,
      chainId,
      decimals,
      value: {
        symbol
      }
    }
    console.log({ ERC20Info })

    return ERC20Info
  } catch (error) {
    console.log({ error })
    return false
  }
}

export function checkNetwork(networkId) {
  const isXdai = networkId === xDaiChainId
  return networkId?.toString() === appNetworkId || isXdai
}

export function titleCase(str) {
  //TODO hot fix
  return str
  // if (!str) return null
  // return str
  //   ?.toLowerCase()
  //   .split(' ')
  //   .map(function (word) {
  //     return word.replace(word[0], word[0].toUpperCase())
  //   })
  //   .join(' ')
}

export function base64ToBlob(base64) {
  const binaryString = window.atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; ++i) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  return new Blob([bytes], { type: 'application/pdf' })
}

export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })

export const getImageFile = async (base64Data, projectName) => {
  const imageFile = await fetch(base64Data)
    .then(res => res.blob())
    .then(blob => {
      return new File([blob], projectName)
    })
  return imageFile
}

// export async function getEtherscanTxs(address, apolloClient = false, isDonor = false) {
//   try {
//     const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY
//     const api = process.env.NEXT_PUBLIC_NETWORK_ID === '3' ? 'api-ropsten' : 'api'
//     const balance = await fetch(
//       `https://${api}.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
//     )
//       .then(response => response.json())
//       .then(data => {
//         return data?.result
//       })

//     return await fetch(
//       `https://${api}.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}`
//     )
//       .then(response => response.json())
//       .then(async data => {
//         const modified = []
//         if (data?.status === '0' || typeof data?.result === 'string') {
//           return {
//             balance,
//             txs: [],
//             error: data?.result
//           }
//         }
//         for (const t of data?.result) {
//           const extra = apolloClient
//             ? await apolloClient?.query({
//                 query: isDonor ? GET_USER_BY_ADDRESS : GET_PROJECT_BY_ADDRESS,
//                 constiables: {
//                   address: isDonor
//                     ? Web3.utils.toChecksumAddress(t?.from)
//                     : Web3.utils.toChecksumAddress(t?.to)
//                 }
//               })
//             : null
//           modified.push({
//             ...t,
//             extra: extra?.data || null,
//             donor: t.from,
//             createdAt: t.timeStamp,
//             currency: 'ETH'
//           })
//         }
//         return {
//           balance,
//           txs: modified
//         }
//       })
//   } catch (error) {
//     console.log({ error })
//   }
// }

export const getERC20List = ERC20List

export async function checkIfURLisValid(checkUrl) {
  let url = checkUrl
  if (!/^(?:f|ht)tps?:\/\//.test(checkUrl)) {
    url = 'https://' + url
  }
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  )
  return !!pattern.test(url)
}

export const fetchPrices = (chain, tokenAddress, catchFunction) => {
  return fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/${chain}?contract_addresses=${tokenAddress}&vs_currencies=usd`
  )
    .then(response => response.json())
    .then(data => parseFloat(data[Object.keys(data)[0]]?.usd?.toFixed(2)))
    .catch(err => {
      console.log('Error fetching prices: ', err)
      catchFunction(0)
    })
}

export const fetchEthPrice = catchFunction => {
  return fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    .then(response => response.json())
    .then(data => data.ethereum.usd)
    .catch(err => {
      console.log('Error fetching ETH price: ', err)
      catchFunction(0)
    })
}

export const switchToXdai = () => {
  window?.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x64',
        chainName: 'xDai',
        nativeCurrency: { name: 'xDAI', symbol: 'xDai', decimals: 18 },
        rpcUrls: ['https://rpc.xdaichain.com/'],
        blockExplorerUrls: ['https://blockscout.com/xdai/mainnet']
      }
    ]
  })
}

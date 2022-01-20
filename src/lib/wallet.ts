import { EWallets, torusConnector } from '@/lib/wallet/walletTypes'
import { switchNetwork as metamaskSwitchNetwork } from '@/lib/metamask'

export const switchNetwork = async (chainId: number) => {
  const selectedWallet = window.localStorage.getItem('selectedWallet')

  switch (selectedWallet) {
    case EWallets.METAMASK:
      await metamaskSwitchNetwork(chainId)
      break

    case EWallets.TORUS:
      await torusConnector.changeChainId(chainId)
      break

    default:
      console.log('network change is not supported for wallet ', selectedWallet)
  }
}

export function isWalletAddressValid(address: string) {
  // return !(address?.length !== 42 || !Web3.utils.isAddress(address))
  return address?.length === 42
}

export function isAddressENS(ens: string) {
  return ens.toLowerCase().indexOf('.eth') > -1
}

export async function getAddressFromENS(ens: string, web3: any) {
  const isEns = isAddressENS(ens)
  if (!isEns) return new Error('Error addressNotENS')

  const address = await web3.ens.getOwner(ens)

  let zeroXAddress = '0x0000000000000000000000000000000000000000'

  return address === zeroXAddress ? new Error('Error gettingAddressFromENS') : address
}

export const networkInfo = (
  networkId?: number
): { networkToken: string; networkName: string; networkPrefix: string } => {
  let network = { networkName: '', networkToken: '', networkPrefix: '' }
  switch (networkId) {
    case 1:
      network = {
        networkName: 'Mainnet',
        networkToken: 'ETH',
        networkPrefix: 'https://etherscan.io/'
      }
      break
    case 3:
      network = {
        networkName: 'Ropsten',
        networkToken: 'ETH',
        networkPrefix: 'https://ropsten.etherscan.io/'
      }
      break
    case 4:
      network = {
        networkName: 'Rinkeby',
        networkToken: 'ETH',
        networkPrefix: 'https://rinkeby.etherscan.io/'
      }
      break
    case 5:
      network = {
        networkName: 'Goerli',
        networkToken: 'ETH',
        networkPrefix: 'https://goerli.etherscan.io/'
      }
      break
    case 42:
      network = {
        networkName: 'Kovan',
        networkToken: 'ETH',
        networkPrefix: 'https://kovan.etherscan.io/'
      }
      break
    case 100:
      network = {
        networkName: 'xDAI',
        networkToken: 'xDAI',
        networkPrefix: 'https://blockscout.com/poa/xdai/'
      }
      break
  }

  return network
}

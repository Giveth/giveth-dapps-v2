import { INetworkParam } from '@/types/config';

export const networksParams: {
	[key: number]: INetworkParam;
} = {
	1: {
		chainId: '0x1', // A 0x-prefixed hexadecimal string
		chainName: 'Mainnet',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH', // 2-6 characters long
			decimals: 18,
		},
		blockExplorerUrls: ['https://etherscan.io/'],
		rpcUrls: ['https://eth.llamarpc.com/', 'https://mainnet.infura.io/v3/'],
	},
	100: {
		chainId: '0x64',
		chainName: 'Gnosis',
		nativeCurrency: {
			name: 'xDai',
			symbol: 'xDai',
			decimals: 18,
		},
		rpcUrls: ['https://rpc.gnosischain.com/'],
		blockExplorerUrls: ['https://gnosisscan.io/'],
	},
	3: {
		chainId: '0x3',
		chainName: 'Ropsten',
		nativeCurrency: {
			name: 'Ropsten ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://ropsten.etherscan.io/'],
		rpcUrls: ['https://ropsten.infura.io/v3/'],
	},
	4: {
		chainId: '0x4',
		chainName: 'Rinkeby',
		nativeCurrency: {
			name: 'Rinkeby ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://rinkeby.etherscan.io/'],
		rpcUrls: ['https://rinkeby.infura.io/v3/'],
	},
	5: {
		chainId: '0x5',
		chainName: 'Goerli',
		nativeCurrency: {
			name: 'Goerli ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://goerli.etherscan.io/'],
		rpcUrls: ['https://goerli.infura.io/v3/'],
	},
	10: {
		chainId: '0xA',
		chainName: 'Optimism',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://optimistic.etherscan.io/'],
		rpcUrls: ['https://mainnet.optimism.io/'],
	},
	42: {
		chainId: '0x2A',
		chainName: 'Kovan',
		nativeCurrency: {
			name: 'Kovan ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://kovan.etherscan.io/'],
		rpcUrls: ['https://kovan.infura.io/v3/'],
	},
	137: {
		chainId: '0x89',
		chainName: 'Polygon Mainnet',
		nativeCurrency: {
			name: 'MATIC',
			symbol: 'MATIC',
			decimals: 18,
		},
		blockExplorerUrls: ['https://polygonscan.com/'],
		rpcUrls: ['https://polygon-rpc.com/'],
	},
	42220: {
		chainId: '0xa4ec',
		chainName: 'Celo Mainnet',
		nativeCurrency: {
			name: 'Celo',
			symbol: 'CELO',
			decimals: 18,
		},
		blockExplorerUrls: ['https://celoscan.io/'],
		rpcUrls: ['https://forno.celo.org/'],
	},
	44787: {
		chainId: '0xaef3',
		chainName: 'Alfajores Testnet',
		nativeCurrency: {
			name: 'Alfajores Celo',
			symbol: 'CELO',
			decimals: 18,
		},
		rpcUrls: ['https://alfajores-forno.celo-testnet.org/'],
		blockExplorerUrls: ['https://alfajores-blockscout.celo-testnet.org/'],
		iconUrls: ['future'],
	},
};

export const convertIPFSToHTTPS = (url: string) => {
	return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
};

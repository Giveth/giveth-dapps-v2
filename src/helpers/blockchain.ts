import { ethers } from 'ethers';

export interface INetworkParam {
	chainId: string;
	chainName: string;
	blockExplorerUrls: Array<string>;
	rpcUrls?: Array<string>;
	iconUrls?: Array<string>;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
}

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
		blockExplorerUrls: ['https://etherscan.io'],
	},
	100: {
		chainId: '0x64',
		chainName: 'Gnosis',
		iconUrls: [
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
		],
		nativeCurrency: {
			name: 'xDAI',
			symbol: 'xDAI',
			decimals: 18,
		},
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
		rpcUrls: ['https://rpc.gnosischain.com/'],
	},
	3: {
		chainId: '0x3',
		chainName: 'Ropsten',
		nativeCurrency: {
			name: 'Ropsten ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://ropsten.etherscan.io'],
	},
	4: {
		chainId: '0x4',
		chainName: 'Rinkeby',
		nativeCurrency: {
			name: 'Rinkeby ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://rinkeby.etherscan.io'],
	},
	5: {
		chainId: '0x5',
		chainName: 'Goerli',
		nativeCurrency: {
			name: 'Goerli ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://goerli.etherscan.io'],
	},
	42: {
		chainId: '0x2A',
		chainName: 'Kovan',
		nativeCurrency: {
			name: 'Kovan ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		blockExplorerUrls: ['https://kovan.etherscan.io'],
	},
	137: {
		chainId: '0x89',
		chainName: 'Polygon Mainnet',
		nativeCurrency: {
			name: 'Matic',
			symbol: 'MATIC',
			decimals: 18,
		},
		blockExplorerUrls: ['https://polygonscan.com'],
		rpcUrls: ['https://polygon-rpc.com'],
	},
};

export const gwei2wei = (gweiAmount: string): string =>
	ethers.utils.parseUnits(gweiAmount, 'gwei').toString();

export const convertIPFSToHTTPS = (url: string) => {
	return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
};

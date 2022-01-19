interface NetworkParam {
	chainId: string;
	chainName: string;
	blockExplorerUrls: Array<string>;
	iconUrls?: Array<string>;
	nativeCurrency: {
		name: string;
		symbol: string;
		decimals: number;
	};
}

export const networksParams: {
	[key: number]: NetworkParam;
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
		chainName: 'xDAI Chain',
		iconUrls: [
			'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
		],
		nativeCurrency: {
			name: 'xDAI',
			symbol: 'xDAI',
			decimals: 18,
		},
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
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
};

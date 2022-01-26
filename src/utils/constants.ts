export const networksParams: Record<number, any> = {
	1: {
		chainId: '0x1',
		chainName: 'Mainnet',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: [
			'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
		],
		blockExplorerUrls: ['https://etherscan.io'],
	},
	42: {
		chainId: '0x2A',
		chainName: 'Kovan',
		nativeCurrency: {
			name: 'Kovan ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: [
			'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
		],
		blockExplorerUrls: ['https://kovan.etherscan.io'],
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
		rpcUrls: ['https://rpc.xdaichain.com'],
		blockExplorerUrls: ['https://blockscout.com/xdai/mainnet'],
	},
};

export const chainName = (chainId: number) => {
	switch (chainId) {
		case 31337:
			return 'Hardhat';
		case 1:
			return 'Mainnet';
		case 4:
			return 'Rinkeby';
		case 100:
			return 'xDai';
		case 42:
			return 'Mainnet';
		default:
			return 'Unknown';
	}
};
export const NFT_POSITIONS_MANAGER_ADDRESS: Record<string, string> = {
	4: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
	42: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
	1: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
	100: '',
};

export const WETH: Record<string, string> = {
	42: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
	4: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
	1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
	100: '',
};

const size = {
	mobileS: '320px',
	mobileM: '375px',
	mobileL: '425px',
	tablet: '768px',
	laptop: '1024px',
	laptopL: '1280px',
	desktop: '1440px',
};

export const device = {
	mobileS: `(min-width: ${size.mobileS})`,
	mobileM: `(min-width: ${size.mobileM})`,
	mobileL: `(min-width: ${size.mobileL})`,
	tablet: `(min-width: ${size.tablet})`,
	laptop: `(min-width: ${size.laptop})`,
	laptopL: `(min-width: ${size.laptopL})`,
	desktop: `(min-width: ${size.desktop})`,
	desktopL: `(min-width: ${size.desktop})`,
};

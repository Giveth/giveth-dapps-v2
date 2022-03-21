import { brandColors, semanticColors } from '@giveth/ui-design-system';
import config from '@/configuration';

export const networksParams: Record<number, any> = {
	1: {
		chainId: '0x1',
		chainName: 'Mainnet',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
		blockExplorerUrls: ['https://etherscan.io'],
	},
	3: {
		chainId: '0x3',
		chainName: 'Ropsten',
		nativeCurrency: {
			name: 'ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
		blockExplorerUrls: ['https://ropsten.etherscan.io'],
	},
	42: {
		chainId: '0x2A',
		chainName: 'Kovan',
		nativeCurrency: {
			name: 'Kovan ETH',
			symbol: 'ETH',
			decimals: 18,
		},
		rpcUrls: ['https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
		blockExplorerUrls: ['https://kovan.etherscan.io'],
	},
	100: {
		chainId: '0x64',
		chainName: 'Gnosis Chain',
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
			return 'Gnosis Chain';
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

export const deviceSize = {
	mobileS: 320,
	mobileM: 375,
	mobileL: 425,
	tablet: 768,
	laptop: 1024,
	laptopL: 1280,
	desktop: 1440,
};

export const device = {
	mobileS: `(min-width: ${deviceSize.mobileS}px)`,
	mobileM: `(min-width: ${deviceSize.mobileM}px)`,
	mobileL: `(min-width: ${deviceSize.mobileL}px)`,
	tablet: `(min-width: ${deviceSize.tablet}px)`,
	laptop: `(min-width: ${deviceSize.laptop}px)`,
	laptopL: `(min-width: ${deviceSize.laptopL}px)`,
	desktop: `(min-width: ${deviceSize.desktop}px)`,
	desktopL: `(min-width: ${deviceSize.desktop}px)`,
};

export const mediaQueries = {
	mobileS: `@media (min-width: ${deviceSize.mobileS}px)`,
	mobileM: `@media (min-width: ${deviceSize.mobileM}px)`,
	mobileL: `@media (min-width: ${deviceSize.mobileL}px)`,
	tablet: `@media (min-width: ${deviceSize.tablet}px)`,
	laptop: `@media (min-width: ${deviceSize.laptop}px)`,
	laptopL: `@media (min-width: ${deviceSize.laptopL}px)`,
	desktop: `@media (min-width: ${deviceSize.desktop}px)`,
};

export const OurImages = [
	{
		id: 1,
		color: brandColors.giv[500],
		url: '',
	},
	{
		id: 2,
		color: brandColors.mustard[500],
		url: '',
	},
	{
		id: 3,
		color: brandColors.cyan[500],
		url: '',
	},
	{
		id: 4,
		color: semanticColors.blueSky[500],
		url: '',
	},
];

export const givEconomySupportedNetworks = [
	config.MAINNET_NETWORK_NUMBER,
	config.XDAI_NETWORK_NUMBER,
];

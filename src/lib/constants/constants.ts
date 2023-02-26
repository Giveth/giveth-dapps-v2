import { brandColors, semanticColors } from '@giveth/ui-design-system';
import config from '@/configuration';

export const chainName = (chainId: number) => {
	switch (chainId) {
		case 31337:
			return 'Hardhat';
		case 1:
			return 'Mainnet';
		case 42:
			return 'Kovan';
		case 5:
			return 'Goerli';
		case 4:
			return 'Rinkeby';
		case 100:
			return 'Gnosis Chain';
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
	laptopS: 1024,
	laptopL: 1280,
	desktop: 1440,
};

export const device = {
	mobileS: `(min-width: ${deviceSize.mobileS}px)`,
	mobileM: `(min-width: ${deviceSize.mobileM}px)`,
	mobileL: `(min-width: ${deviceSize.mobileL}px)`,
	tablet: `(min-width: ${deviceSize.tablet}px)`,
	laptopS: `(min-width: ${deviceSize.laptopS}px)`,
	laptopL: `(min-width: ${deviceSize.laptopL}px)`,
	desktop: `(min-width: ${deviceSize.desktop}px)`,
};

export const mediaQueries = {
	mobileS: `@media (min-width: ${deviceSize.mobileS}px)`,
	mobileM: `@media (min-width: ${deviceSize.mobileM}px)`,
	mobileL: `@media (min-width: ${deviceSize.mobileL}px)`,
	tablet: `@media (min-width: ${deviceSize.tablet}px)`,
	laptopS: `@media (min-width: ${deviceSize.laptopS}px)`,
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

export const zIndex = {
	BOTTOM_SHEET: 90,
	HEADER: 100,
	DROPDOWN: 1000,
	STICKY: 1020,
	FIXED: 1030,
	MODALBACKDROP: 1040,
	OFFCANVAS: 1050,
	MODAL: 1060,
	POPOVER: 1070,
	TOOLTIP: 1080,
	NAVBAR: 1100,
};

export const searchSuggestions = [
	'open source',
	'blockchain',
	'children',
	'land stewardship',
	'homelessness',
	'indigenous',
];

export const regenFarmStreamCardCol = {
	sm: [12, 6, 12],
	lg: [12, 8, 4],
};

export const TWO_WEEK = 1_209_600_000;

export const minDonationAmount = 0.000001;

export const BACKEND_QUERY_LIMIT = 50;

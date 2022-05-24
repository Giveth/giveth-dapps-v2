import BigNumber from 'bignumber.js';

export interface IPriceState {
	givPrice: string;
	ethPrice: string;
	mainnetThirdPartyTokensPrice: { [tokenAddress: string]: BigNumber };
	xDaiThirdPartyTokensPrice: { [tokenAddress: string]: BigNumber };
}

export interface IGetTokenPrice {
	tokenAddress: string;
	network: number;
}

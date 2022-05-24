import BigNumber from 'bignumber.js';

export interface IPriceState {
	priceValues: IPriceValues;
	mainnetThirdPartyTokensPrice: { [tokenAddress: string]: BigNumber };
	xDaiThirdPartyTokensPrice: { [tokenAddress: string]: BigNumber };
}

export interface IPriceValues {
	givPrice: BigNumber;
	ethPrice: BigNumber;
}

export interface IGetTokenPrice {
	tokenAddress: string;
	network: number;
}

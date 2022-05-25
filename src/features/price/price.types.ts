export interface IPriceState {
	givPrice: string;
	ethPrice: string;
	mainnetPrice: string | undefined;
	xDaiPrice: string | undefined;
	mainnetThirdPartyTokensPrice:
		| { [tokenAddress: string]: string }
		| undefined;
	xDaiThirdPartyTokensPrice: { [tokenAddress: string]: string } | undefined;
}

export interface IGetTokenPrice {
	tokenAddress: string;
	network: number;
}

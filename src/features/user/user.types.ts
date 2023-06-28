export interface ISignToGetToken {
	address: string;
	chainId?: number;
	signer: any;
	pathname?: string;
}

export interface IChainvineSetReferral {
	address: string;
}

export interface IChainvineClickCount {
	referrerId: string;
	walletAddress: string;
}

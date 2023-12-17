export interface ISignToGetToken {
	address: string;
	chainId?: number;
	pathname?: string;
}

export interface ISolanaSignToGetToken extends ISignToGetToken {
	solanaSignedMessage: string;
	nonce: string;
	message: string;
}

export interface IChainvineSetReferral {
	address: string;
}

export interface IChainvineClickCount {
	referrerId: string;
	walletAddress: string;
}

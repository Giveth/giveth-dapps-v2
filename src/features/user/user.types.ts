export interface ISignToGetToken {
	address: string;
	safeAddress?: string;
	chainId?: number;
	pathname?: string;
	connectors?: any; // TODO: CHANGE THIS
	isGSafeConnector?: boolean;
	connector?: any; // TODO: CHANGE THIS TYPE
	expiration?: number;
}

export interface IChainvineSetReferral {
	address: string;
}

export interface IChainvineClickCount {
	referrerId: string;
	walletAddress: string;
}

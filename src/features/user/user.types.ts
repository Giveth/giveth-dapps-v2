export interface ISignToGetToken {
	address: string;
	chainId?: number;
	pathname?: string;
	connectors?: any; // TODO: CHANGE THIS
	isGSafeConnector?: boolean;
}

export interface IChainvineSetReferral {
	address: string;
}

export interface IChainvineClickCount {
	referrerId: string;
	walletAddress: string;
}

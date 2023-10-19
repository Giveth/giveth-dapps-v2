export interface ISignToGetToken {
	address: string;
	chainId?: number;
	pathname?: string;
	connectors?: any; // TODO: CHANGE THIS
	isGSafeConnector?: boolean;
	connector?: any; // TODO: CHANGE THIS TYPE
}

export interface IChainvineSetReferral {
	address: string;
}

export interface IChainvineClickCount {
	referrerId: string;
	walletAddress: string;
}

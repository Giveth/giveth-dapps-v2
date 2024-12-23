import { type Address } from 'viem';

export type IToken = {
	id: Address;
	name: string;
	symbol: string;
	decimals: number;
	isSuperToken?: boolean;
	underlyingToken?: IToken;
	coingeckoId: string;
};

export interface ISuperToken extends IToken {
	underlyingToken: IToken;
	isSuperToken: boolean;
}

export interface ISuperfluidStream {
	receiver: {
		id: Address;
	};
	sender: {
		id: Address;
	};
	token: ISuperToken;
	currentFlowRate: string;
	networkId: number;
}

export interface IStream {
	id: string;
	token: IToken;
}

export interface IProjectStreamsData {
	streams: IStream[];
}

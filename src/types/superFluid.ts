import { type Address } from 'viem';

export type IToken = {
	id: Address;
	name: string;
	symbol: string;
	decimals: number;
	isSuperToken?: boolean;
	underlyingToken?: IToken;
};

export interface ISuperToken extends IToken {
	underlyingToken: IToken;
	isSuperToken: boolean;
	coingeckoId: string;
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
}

export interface IStream {
	id: string;
	token: IToken;
}

export interface IProjectStreamsData {
	streams: IStream[];
}

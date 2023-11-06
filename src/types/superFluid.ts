import type { Address } from 'wagmi';

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
}

export interface ISuperfluidStream {
	receiver: {
		id: Address;
	};
	sender: {
		id: Address;
	};
	token: ISuperToken;
}

import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';

export interface ISelectedToken extends IProjectAcceptedToken {
	value?: IProjectAcceptedToken;
	label?: string;
}

export const prepareTokenList = (tokens: IProjectAcceptedToken[]) => {
	let givIndex: number | undefined;
	const _tokens: ISelectedToken[] = [...tokens];
	tokens.forEach((token: IProjectAcceptedToken, index: number) => {
		if (
			token.symbol === 'GIV' ||
			token.symbol === 'TestGIV' ||
			token.name === 'Giveth'
		) {
			givIndex = index;
		}
		_tokens[index] = {
			...token,
			value: token,
			label: token.symbol,
		};
	});
	const givToken = tokens[givIndex!];
	if (givToken && givIndex) {
		tokens.splice(givIndex, 1);
	}
	_tokens?.sort((a: any, b: any) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();
		if (nameA < nameB) {
			return -1;
		} else if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	if (givToken) {
		_tokens.splice(0, 0, givToken);
	}
	return _tokens;
};

export const filterTokens = (
	tokens: IProjectAcceptedToken[],
	networkId: number,
) => {
	return tokens.filter(i => i.networkId === networkId);
};

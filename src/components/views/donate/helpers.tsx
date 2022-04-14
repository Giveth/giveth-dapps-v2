import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { networksParams } from '@/helpers/blockchain';

export interface ISelectedToken extends IProjectAcceptedToken {
	value?: IProjectAcceptedToken;
	label?: string;
}

interface INetworkIds {
	[key: number]: boolean;
}

export const prepareTokenList = (tokens: IProjectAcceptedToken[]) => {
	let givIndex: number | undefined;
	const _tokens: ISelectedToken[] = [...tokens];
	_tokens.sort((a: IProjectAcceptedToken, b: IProjectAcceptedToken) => {
		const nameA = a.name.toUpperCase();
		const nameB = b.name.toUpperCase();
		if (nameA < nameB) {
			return -1;
		} else if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	_tokens.forEach((token: IProjectAcceptedToken, index: number) => {
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
	const givToken = _tokens[givIndex!];
	if (givToken && givIndex) {
		_tokens.splice(givIndex, 1);
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

export const getNetworkIds = (tokens: IProjectAcceptedToken[]) => {
	const networkIds: INetworkIds = {};
	tokens.forEach(i => {
		networkIds[i.networkId] = true;
	});
	return Object.keys(networkIds).map(i => Number(i));
};

export const getNetworkNames = (networks: number[], text: string) => {
	return networks.map((i, index) => {
		const name = networksParams[i]?.chainName;
		const lastLoop = networks.length === index + 1;
		return (
			<span key={i}>
				{name}
				{!lastLoop && ' ' + text + ' '}
			</span>
		);
	});
};

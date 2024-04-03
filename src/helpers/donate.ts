import { Address } from 'viem';
import config from '@/configuration';
import { type ITokenStreams } from '@/context/donate.context';
import { ISuperfluidStream, IToken } from '@/types/superFluid';

export const findSuperTokenByTokenAddress = (tokenAddress: Address) => {
	return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
		token => token.underlyingToken.id === tokenAddress,
	);
};

export const findUserActiveStreamOnSelectedToken = (
	address?: Address,
	projectAnchorAddress?: string,
	tokenStreams?: ITokenStreams,
	superToken?: IToken,
) => {
	console.log('address', address);
	if (
		!address ||
		!projectAnchorAddress ||
		!tokenStreams ||
		!superToken ||
		!superToken.isSuperToken
	)
		return;
	const tokenStream = tokenStreams[superToken.id];
	if (!tokenStream) return;
	return tokenStream.find(
		stream =>
			stream.receiver.id.toLowerCase() ===
				projectAnchorAddress.toLowerCase() &&
			stream.currentFlowRate !== '0',
	);
};

export const countActiveStreams = (tokenStreams: ISuperfluidStream[]) => {
	return (
		tokenStreams.filter(stream => stream.currentFlowRate !== '0').length ||
		0
	);
};

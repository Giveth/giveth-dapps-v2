import { Address } from 'viem';
import config from '@/configuration';
import {
	type ITokenStreams,
	type ISelectTokenWithBalance,
} from '@/context/donate.context';

export const findSuperTokenByTokenAddress = (tokenAddress: Address) => {
	return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
		token => token.underlyingToken.id === tokenAddress,
	);
};

export const findUserActiveStreamOnSelectedToken = (
	address?: Address,
	projectAnchorAddress?: string,
	tokenStreams?: ITokenStreams,
	selectedSuperToken?: ISelectTokenWithBalance,
) => {
	console.log('address', address);
	if (
		!address ||
		!projectAnchorAddress ||
		!tokenStreams ||
		!selectedSuperToken ||
		!selectedSuperToken.token.isSuperToken
	)
		return;
	const tokenStream = tokenStreams[selectedSuperToken.token.id];
	if (!tokenStream) return;
	return tokenStream.find(
		stream =>
			stream.receiver.id.toLowerCase() ===
				projectAnchorAddress.toLowerCase() &&
			stream.currentFlowRate !== '0',
	);
};

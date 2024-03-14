import { Address } from 'viem';
import config from '@/configuration';
import { IProject } from '@/apollo/types/types';
import {
	type ITokenStreams,
	type ISelectTokenWithBalance,
} from '@/context/donate.context';

export const findSuperTokenByTokenAddress = (tokenAddress: Address) => {
	return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
		token => token.underlyingToken.id === tokenAddress,
	);
};

export const findUserStreamOnSelectedToken = (
	address?: Address,
	project?: IProject,
	tokenStreams?: ITokenStreams,
	selectedSuperToken?: ISelectTokenWithBalance,
) => {
	console.log('address', address);
	if (
		!address ||
		!project ||
		!tokenStreams ||
		!selectedSuperToken ||
		!selectedSuperToken.token.isSuperToken
	)
		return;
	const projectAnchorAddress = project.anchorContracts[0]?.address;
	if (!projectAnchorAddress) return;
	const tokenStream = tokenStreams[selectedSuperToken.token.id];
	if (!tokenStream) return;
	return tokenStream.find(
		stream =>
			stream.receiver.id.toLowerCase() ===
			projectAnchorAddress.toLowerCase(),
	);
};

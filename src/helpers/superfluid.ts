import { Address } from 'viem';
import config from '@/configuration';
import { IAnchorContractData } from '@/apollo/types/types';

export const findTokenByAddress = (
	address?: Address,
	networkId: number = config.BASE_NETWORK_NUMBER,
) => {
	if (!address) return undefined;
	const _address = address.toLowerCase();

	// Choose the token configuration based on networkId
	const tokenConfig =
		networkId === config.BASE_NETWORK_NUMBER
			? config.BASE_CONFIG.SUPER_FLUID_TOKENS
			: networkId === config.OPTIMISM_NETWORK_NUMBER
				? config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS
				: [];

	// Find the token by address in the selected configuration
	return tokenConfig.find(
		superFluidToken =>
			superFluidToken.id.toLowerCase() === _address ||
			(superFluidToken.underlyingToken &&
				superFluidToken.underlyingToken.id.toLowerCase() === _address),
	);
};

export const findAnchorContractAddress = (
	anchorContracts?: IAnchorContractData[],
	chainId?: number,
) => {
	if (!anchorContracts || !chainId) return undefined;
	return anchorContracts.find(
		contract => contract.isActive && contract.networkId == chainId,
	)?.address;
};

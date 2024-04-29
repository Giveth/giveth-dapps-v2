import { Address } from 'viem';
import config from '@/configuration';
import { IAnchorContractData } from '@/apollo/types/types';

export const findTokenByAddress = (address?: Address) => {
	if (!address) return undefined;
	const _address = address.toLowerCase();
	return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
		superFluidToken =>
			superFluidToken.id.toLowerCase() === _address ||
			superFluidToken.underlyingToken.id.toLowerCase() === _address,
	);
};

export const findAnchorContractAddress = (
	anchorContracts?: IAnchorContractData[],
) => {
	if (!anchorContracts) return undefined;
	return anchorContracts.find(contract => contract.isActive)?.address;
};

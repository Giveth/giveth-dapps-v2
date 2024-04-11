import { Address } from 'viem';
import config from '@/configuration';

export const findTokenByAddress = (address?: Address) => {
	if (!address) return undefined;
	return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
		superFluidToken =>
			superFluidToken.id === address ||
			superFluidToken.underlyingToken.id === address,
	);
};

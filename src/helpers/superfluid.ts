import { Address } from 'viem';
import config from '@/configuration';

export const findTokenByAddress = (address?: Address) => {
	if (!address) return undefined;
	const _address = address.toLowerCase();
	return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
		superFluidToken =>
			superFluidToken.id.toLowerCase() === _address ||
			superFluidToken.underlyingToken.id.toLowerCase() === _address,
	);
};

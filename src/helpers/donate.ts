import { Address } from 'viem';
import config from '@/configuration';
import { type ITokenStreams } from '@/context/donate.context';
import { ISuperfluidStream, IToken } from '@/types/superFluid';

/**
 * Finds the corresponding SuperToken for a given token address within a specific network.
 * We for now ONLY USE the Optimism network and the Base network.
 *
 * @param {Address} tokenAddress - The address of the underlying token to search for.
 * @param {number} recurringNetworkID - The ID of the network where the search should occur.
 *        This can be either the Optimism network or the Base network.
 * @returns {Object | undefined} - The matching SuperToken object if found, otherwise undefined.
 *
 * Logic:
 * - If the recurring network ID matches the Optimism network, it searches within the
 *   Optimism configuration's SuperFluid tokens.
 * - Otherwise, it defaults to searching within the Base configuration's SuperFluid tokens.
 */
export const findSuperTokenByTokenAddress = (
	tokenAddress: Address,
	recurringNetworkID: number,
) => {
	if (recurringNetworkID === config.OPTIMISM_NETWORK_NUMBER) {
		return config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS.find(
			token => token.underlyingToken.id === tokenAddress,
		);
	}
	return config.BASE_CONFIG.SUPER_FLUID_TOKENS.find(
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

// Function to check if a flow exists
export const checkIfRecurringFlowExist = async (
	sf: {
		cfaV1: {
			getFlow: (arg0: {
				superToken: any;
				sender: any;
				receiver: any;
				providerOrSigner: any;
			}) => any;
		};
	},
	superTokenAddress: any,
	senderAddress: any,
	receiverAddress: any,
	signer: any,
) => {
	try {
		const flowInfo = await sf.cfaV1.getFlow({
			superToken: superTokenAddress,
			sender: senderAddress,
			receiver: receiverAddress,
			providerOrSigner: signer,
		});
		return { exists: true, flowRate: flowInfo.flowRate };
	} catch (error) {
		return { exists: false, flowRate: '0' };
	}
};

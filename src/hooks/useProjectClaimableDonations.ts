import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';
import { IToken } from '@/types/superFluid';
import config from '@/configuration';
import { fetchRecurringBalance } from '@/services/token';

export interface ITokenWithBalance {
	token: IToken;
	balance: bigint;
}

export const useProjectClaimableDonations = (
	recurringNetworkID: number,
	anchorContractAddress?: Address,
) => {
	const [isLoading, setIsLoading] = useState(false);
	const [balances, setBalances] = useState<ITokenWithBalance[]>([]);
	const allTokens =
		recurringNetworkID === config.OPTIMISM_NETWORK_NUMBER
			? config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS
			: config.BASE_CONFIG.SUPER_FLUID_TOKENS;

	const fetchTokenBalance = useCallback(
		async (token: IToken): Promise<ITokenWithBalance | null> => {
			if (!anchorContractAddress) return null;
			try {
				const balance = await fetchRecurringBalance(
					token.id,
					anchorContractAddress,
					recurringNetworkID,
				);
				if (balance) {
					return {
						token,
						balance: balance,
					};
				}
				return null;
			} catch (error) {
				console.error(
					'Error fetching token balance:',
					error,
					anchorContractAddress,
					recurringNetworkID,
				);
				return null;
			}
		},
		[anchorContractAddress, recurringNetworkID],
	);

	const fetchAllTokensBalances = useCallback(async () => {
		if (!anchorContractAddress) return;
		try {
			setIsLoading(true);
			const tokenBalancesPromises = allTokens.map(token =>
				fetchTokenBalance(token),
			);
			const results = await Promise.all(tokenBalancesPromises);
			const filteredResults = results.filter(
				result => result !== null && result.balance !== 0n,
			) as ITokenWithBalance[];
			setBalances(filteredResults);
		} catch (error) {
			console.error(
				'Error fetching all tokens balances:',
				error,
				anchorContractAddress,
				recurringNetworkID,
			);
		} finally {
			setIsLoading(false);
		}
	}, [fetchTokenBalance, anchorContractAddress, recurringNetworkID]);

	// Initial fetch
	useEffect(() => {
		fetchAllTokensBalances();
	}, [fetchAllTokensBalances]);

	// Return isLoading, balances, and the refetch function
	return { isLoading, balances, refetch: fetchAllTokensBalances };
};

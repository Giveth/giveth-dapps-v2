import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';
import { IToken } from '@/types/superFluid';
import config from '@/configuration';
import { fetchBalance } from '@/services/token';

export interface ITokenWithBalance {
	token: IToken;
	balance: bigint;
}

const allTokens = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS;

export const useProjectClaimableDonations = (
	anchorContractAddress?: Address,
) => {
	const [isLoading, setIsLoading] = useState(false);
	const [balances, setBalances] = useState<ITokenWithBalance[]>([]);

	const fetchTokenBalance = useCallback(
		async (token: IToken): Promise<ITokenWithBalance | null> => {
			if (!anchorContractAddress) return null;
			try {
				const balance = await fetchBalance(
					token.id,
					anchorContractAddress,
				);
				if (balance) {
					return {
						token,
						balance: balance,
					};
				}
				return null;
			} catch (error) {
				console.error('Error fetching token balance:', error);
				return null;
			}
		},
		[anchorContractAddress],
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
			console.error('Error fetching all tokens balances:', error);
		} finally {
			setIsLoading(false);
		}
	}, [fetchTokenBalance, anchorContractAddress]);

	// Initial fetch
	useEffect(() => {
		fetchAllTokensBalances();
	}, [fetchAllTokensBalances]);

	// Return isLoading, balances, and the refetch function
	return { isLoading, balances, refetch: fetchAllTokensBalances };
};

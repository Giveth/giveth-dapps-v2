import { Address } from 'wagmi';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { IStream, IToken } from '@/types/superFluid';
import config from '@/configuration';
import { fetchBalance } from '@/services/token';

export interface IStreamWithBalance extends IStream {
	balance: BigNumber;
}

export interface ITokenWithBalance {
	token: IToken;
	balance: bigint;
}

const allTokens = config.OPTIMISM_CONFIG.SUPER_FLUID_TOKENS;

export const useProjectClaimableDonations = (
	anchorContractAddress?: Address,
) => {
	const [isLoading, setIsLoading] = useState(false); // Add isLoading state
	const [balances, setBalances] = useState<ITokenWithBalance[]>([]);

	const fetchTokenBalance = async (
		token: IToken,
	): Promise<ITokenWithBalance | null> => {
		if (!anchorContractAddress) return null;
		try {
			const balance = await fetchBalance(token.id, anchorContractAddress);
			if (balance) {
				return {
					token,
					balance: balance, // Convert balance to BigNumber
				};
			}
			return null;
		} catch (error) {
			console.error(`Error fetching balance for ${token.symbol}:`, error);
			return null;
		}
	};

	// Initiate all balance fetches concurrently
	const fetchAllBalances = async () => {
		try {
			setIsLoading(true);
			const _allTokensWithBalance = allTokens.map(token => {
				return fetchTokenBalance(token);
			});
			console.log('All tokens with balance', _allTokensWithBalance);
			const results = await Promise.all(_allTokensWithBalance);
			// Filter out null values
			const filteredResults = results.filter(
				result => result !== null && result.balance !== 0n,
			) as ITokenWithBalance[];
			console.log('Filtered results', filteredResults);
			setBalances(filteredResults);
		} catch (error) {
			console.error('Error fetching all balances:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (!anchorContractAddress) return;
		fetchAllBalances();
	}, []);

	console.log('Balances', balances);

	return { isLoading, balances };
};

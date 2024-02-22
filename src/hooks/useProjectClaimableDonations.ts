import { type Address } from 'viem';
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

	useEffect(() => {
		const fetchTokenBalance = async (
			token: IToken,
		): Promise<ITokenWithBalance | null> => {
			if (!anchorContractAddress) return null;
			try {
				const balance = await fetchBalance(
					token.id,
					anchorContractAddress,
				);
				if (balance) {
					return {
						token,
						balance: balance, // Convert balance to BigNumber
					};
				}
				return null;
			} catch (error) {
				return null;
			}
		};

		// Initiate all balance fetches concurrently
		const fetchAllTokensBalances = async () => {
			try {
				setIsLoading(true);
				const _allTokensWithBalance = allTokens.map(token => {
					return fetchTokenBalance(token);
				});
				const results = await Promise.all(_allTokensWithBalance);
				// Filter out null values
				const filteredResults = results.filter(
					result => result !== null && result.balance !== 0n,
				) as ITokenWithBalance[];
				setBalances(filteredResults);
			} catch (error) {
			} finally {
				setIsLoading(false);
			}
		};

		if (!anchorContractAddress) return;
		fetchAllTokensBalances();
	}, []);

	return { isLoading, balances };
};

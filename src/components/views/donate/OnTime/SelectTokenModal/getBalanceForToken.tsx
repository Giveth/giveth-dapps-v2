import { Address } from 'viem';
import { Connection, PublicKey } from '@solana/web3.js';
import { ChainType } from '@/types/config';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { fetchBalance } from '@/services/token';
import { solanaNativeAddress } from '@/lib/constants/constants';

export const getBalanceForToken = async (
	token: IProjectAcceptedToken,
	walletAddress: string | null,
	connection?: Connection,
): Promise<bigint | undefined> => {
	const isEvm = token?.chainType === ChainType.EVM;
	const address = walletAddress as Address | null;

	try {
		if (isEvm) {
			return await fetchBalance(token.address, address!);
		} else {
			const solAddress = new PublicKey(walletAddress!);
			if (!token || (token.address as string) === solanaNativeAddress) {
				return connection
					?.getBalance(solAddress)
					.then(solBalance => BigInt(solBalance));
			}
			let splTokenMintAddress;
			try {
				splTokenMintAddress = new PublicKey(token?.address);
			} catch (e) {
				console.error('Invalid token address:', e);
				return 0n;
			}
			const tokenAccounts =
				await connection?.getParsedTokenAccountsByOwner(solAddress, {
					mint: splTokenMintAddress,
				});
			if (tokenAccounts?.value.length === 0) {
				console.error('No token accounts found');
				return 0n;
			}
			const accountInfo = tokenAccounts?.value[0].account.data;
			const balance = BigInt(accountInfo?.parsed.info.tokenAmount
				.amount);
			return balance;
		}
	} catch (error) {
		console.error('error on fetchBalance', { error });
		return;
	}
};

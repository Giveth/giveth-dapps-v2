import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import { solanaNativeAddress } from '@/lib/constants/constants';

interface ISolanaBalance {
	token?: string;
	address?: string;
}

export const useSolanaBalance = ({ address, token }: ISolanaBalance) => {
	const { connection: solanaConnection } = useConnection();

	const fetchSolanaBalance = async () => {
		try {
			if (!address) {
				console.error('No address provided');
				return 0n;
			}

			let ownerAddress;
			try {
				ownerAddress = new PublicKey(address);
			} catch (e) {
				console.error('Invalid address:', e);
				return 0n;
			}

			// Fetch native SOL balance if no token is provided
			if (!token || token === solanaNativeAddress) {
				const solBalance =
					await solanaConnection.getBalance(ownerAddress);

				return BigInt(solBalance);
			}

			// Fetch SPL token balance
			let splTokenMintAddress;
			try {
				splTokenMintAddress = new PublicKey(token);
			} catch (e) {
				console.error('Invalid token address:', e);
				return 0n;
			}

			const tokenAccounts =
				await solanaConnection.getParsedTokenAccountsByOwner(
					ownerAddress,
					{ mint: splTokenMintAddress },
				);

			if (tokenAccounts.value.length === 0) {
				console.error('No token accounts found');
				return 0n;
			}

			const accountInfo = tokenAccounts.value[0].account.data;
			const balance = accountInfo.parsed.info.tokenAmount
				.amount as bigint;
			return balance;
		} catch (error) {
			console.error('Error fetching Solana balance:', error);
			return 0n;
		}
	};

	const data = useQuery({
		queryKey: ['solanaBalance', address, token],
		queryFn: fetchSolanaBalance,
		enabled: !!address,
	});

	if (data.error) {
		console.error('Query error:', data.error);
	}

	return data;
};

import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

interface ISolanaBalance {
	token?: string;
	address?: string;
}

export const useSolanaBalance = ({ address, token }: ISolanaBalance) => {
	const { connection: solanaConnection } = useConnection();

	const fetchSolanaBalance = async () => {
		try {
			console.log('****fetching solana balance');
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
			if (token === '11111111111111111111111111111111') {
				const solBalance =
					await solanaConnection.getBalance(ownerAddress);
				console.log('*****SOL balance', solBalance);
				return solBalance;
			}

			// Fetch SPL token balance
			let splTokenMintAddress;
			try {
				splTokenMintAddress = new PublicKey(token);
			} catch (e) {
				console.error('Invalid token address:', e);
				return 0n;
			}

			console.log('*****splTokenMintAddress', splTokenMintAddress);

			const tokenAccounts =
				await solanaConnection.getParsedTokenAccountsByOwner(
					ownerAddress,
					{ mint: splTokenMintAddress },
				);
			console.log('*****tokenAccounts', tokenAccounts);

			if (tokenAccounts.value.length === 0) {
				console.error('No token accounts found');
				return 0n;
			}

			const accountInfo = tokenAccounts.value[0].account.data;
			console.log('*****accountInfo', accountInfo);
			const balance = accountInfo.parsed.info.tokenAmount.amount;
			console.log('*****balance', balance);
			return balance;
		} catch (error) {
			console.error('Error fetching Solana balance:', error);
			return 0n;
		}
	};

	const { data, error, isLoading } = useQuery({
		queryKey: ['solanaBalance', address, token],
		queryFn: fetchSolanaBalance,
		enabled: !!address,
	});

	if (error) {
		console.error('Query error:', error);
	}

	return data;
};

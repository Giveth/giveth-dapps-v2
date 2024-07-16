import { useEffect, useState } from 'react';
import { useBalance } from 'wagmi';
import { useSolanaBalance } from '@/hooks/useSolanaBalance';
import { ChainType } from '@/types/config';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import { Address, zeroAddress } from 'viem';

const useFetchBalance = (token: IProjectAcceptedToken) => {
	const { walletAddress } = useGeneralWallet();
	const [balance, setBalance] = useState<bigint | undefined>(undefined);
	const isEvm = token.chainType === ChainType.EVM;
	const address = walletAddress as Address | null;

	const evmBalanceQuery = useBalance({
		token: token?.address === zeroAddress ? undefined : token?.address,
		address: address as Address,
		query: {
			enabled: isEvm && address !== null,
		},
	});

	const solanaBalanceQuery = useSolanaBalance({
		token: token?.address,
		address: !isEvm && address !== null ? address : undefined,
	});

	useEffect(() => {
		if (isEvm && evmBalanceQuery.data) {
			setBalance(evmBalanceQuery.data.value);
		} else if (!isEvm && solanaBalanceQuery.data) {
			setBalance(solanaBalanceQuery.data);
		}
	}, [isEvm, evmBalanceQuery.data, solanaBalanceQuery.data]);

	return balance;
};

export default useFetchBalance;

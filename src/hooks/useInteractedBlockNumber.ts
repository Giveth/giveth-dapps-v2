import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export const useInteractedBlockNumber = (_chainId?: number) => {
	const { chainId: accountChainId } = useAccount();
	return useQuery({
		queryKey: ['interactedBlockNumber', _chainId || accountChainId],
		queryFn: () => 0,
		staleTime: Infinity,
	});
};

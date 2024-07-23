import { useState, useEffect } from 'react';
import { AddressZero } from '@ethersproject/constants';
import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { fetchSubgraphData } from '@/services/subgraph.service';
import config from '@/configuration';

export const defaultTokenDistroHelper = new TokenDistroHelper({
	contractAddress: AddressZero,
	initialAmount: '0',
	lockedAmount: '0',
	totalTokens: '0',
	startTime: 0,
	cliffTime: 0,
	endTime: 0,
});

const useGIVTokenDistroHelper = (hold = false) => {
	const [givTokenDistroHelper, setGIVTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [isLoaded, setIsLoaded] = useState(false);
	const { chain, address } = useAccount();
	const currentValues = useQuery({
		queryKey: ['subgraph', chain?.id, address],
		queryFn: async () => await fetchSubgraphData(chain?.id, address),
		enabled: !hold,
		staleTime: config.SUBGRAPH_POLLING_INTERVAL,
	});
	console.log('rerendered');
	useEffect(() => {
		const sdh = new SubgraphDataHelper(currentValues.data);
		setGIVTokenDistroHelper(new TokenDistroHelper(sdh.getGIVTokenDistro()));
		setIsLoaded(currentValues.isFetched as boolean); //TODO:
	}, [currentValues.data]);
	return { givTokenDistroHelper, isLoaded };
};

export default useGIVTokenDistroHelper;

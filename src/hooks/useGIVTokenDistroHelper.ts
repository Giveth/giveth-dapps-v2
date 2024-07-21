import { useState, useEffect } from 'react';
import { AddressZero } from '@ethersproject/constants';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';

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
	const queryClient = useQueryClient();
	const currentValue = queryClient.getQueryData([
		'subgraph',
		chain?.id,
		address,
	]);
	useEffect(() => {
		const sdh = new SubgraphDataHelper(currentValue);
		setGIVTokenDistroHelper(new TokenDistroHelper(sdh.getGIVTokenDistro()));
		// setIsLoaded(currentValue.isLoaded as boolean); //TODO:
	}, [currentValue]);
	return { givTokenDistroHelper, isLoaded };
};

export default useGIVTokenDistroHelper;

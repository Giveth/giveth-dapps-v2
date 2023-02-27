import { useState, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { AddressZero } from '@ethersproject/constants';
import { useAppSelector } from '@/features/hooks';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { defaultXdaiSubgraphValues } from '@/features/subgraph/subgraph.slice';

export const defaultTokenDistroHelper = new TokenDistroHelper({
	contractAddress: AddressZero,
	initialAmount: '0',
	lockedAmount: '0',
	totalTokens: '0',
	startTime: 0,
	cliffTime: 0,
	endTime: 0,
});

const useGIVTokenDistroHelper = (disable = false) => {
	const [givTokenDistroHelper, setGIVTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [isLoaded, setIsLoaded] = useState(false);
	const currentValue = useAppSelector(
		state =>
			disable ? defaultXdaiSubgraphValues : state.subgraph.currentValues,
		shallowEqual,
	);
	useEffect(() => {
		const sdh = new SubgraphDataHelper(currentValue);
		setGIVTokenDistroHelper(new TokenDistroHelper(sdh.getGIVTokenDistro()));
		setIsLoaded(currentValue.isLoaded as boolean);
	}, [currentValue]);
	return { givTokenDistroHelper, isLoaded };
};

export default useGIVTokenDistroHelper;

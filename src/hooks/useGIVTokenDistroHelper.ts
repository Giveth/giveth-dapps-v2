import { useState, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { AddressZero } from '@ethersproject/constants';
import { useAppSelector } from '@/features/hooks';
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
	const currentValue = useAppSelector(
		state => state.subgraph.currentValues,
		(objA, objB) => (hold ? true : shallowEqual(objA, objB)),
	);
	useEffect(() => {
		const sdh = new SubgraphDataHelper(currentValue);
		setGIVTokenDistroHelper(new TokenDistroHelper(sdh.getGIVTokenDistro()));
		setIsLoaded(currentValue.isLoaded as boolean);
	}, [currentValue]);
	return { givTokenDistroHelper, isLoaded };
};

export default useGIVTokenDistroHelper;

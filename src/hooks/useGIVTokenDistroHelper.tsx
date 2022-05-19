import { useState, useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { AddressZero } from '@ethersproject/constants';
import { useAppSelector } from '@/features/hooks';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';

export const defaultTokenDistroHelper = new TokenDistroHelper({
	contractAddress: AddressZero,
	initialAmount: '0',
	lockedAmount: '0',
	totalTokens: '0',
	startTime: 0,
	cliffTime: 0,
	endTime: 0,
});

const useGIVTokenDistroHelper = () => {
	const [givTokenDistroHelper, setGIVTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const tokenDistroInfo = useAppSelector(
		state => state.subgraph.currentValues.tokenDistroInfo,
		shallowEqual,
	);
	useEffect(() => {
		if (!tokenDistroInfo) return;
		setGIVTokenDistroHelper(new TokenDistroHelper(tokenDistroInfo));
	}, [tokenDistroInfo]);
	return { givTokenDistroHelper };
};

export default useGIVTokenDistroHelper;

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/features/hooks';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { defaultTokenDistroHelper } from '@/context/tokenDistro.context';

const useGIVTokenDistroHelper = () => {
	const [givTokenDistroHelper, setGIVTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const { tokenDistroInfo } = useAppSelector(
		state => state.subgraph.currentValues,
	);
	useEffect(() => {
		if (!tokenDistroInfo) return;
		setGIVTokenDistroHelper(new TokenDistroHelper(tokenDistroInfo));
	}, [tokenDistroInfo]);
	return { givTokenDistroHelper };
};

export default useGIVTokenDistroHelper;

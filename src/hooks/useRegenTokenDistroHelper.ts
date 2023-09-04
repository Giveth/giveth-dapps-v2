import { useState, useEffect } from 'react';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { defaultTokenDistroHelper } from './useGIVTokenDistroHelper';
import { ITokenDistro } from '@/types/subgraph';

const useRegenTokenDistroHelper = (tokenDistro: ITokenDistro) => {
	const [regenTokenDistroHelper, setRegenTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	useEffect(() => {
		if (!tokenDistro) return;
		setRegenTokenDistroHelper(new TokenDistroHelper(tokenDistro));
	}, [tokenDistro]);
	return { regenTokenDistroHelper };
};

export default useRegenTokenDistroHelper;

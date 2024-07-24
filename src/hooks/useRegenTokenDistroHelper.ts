import { useState, useEffect } from 'react';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { defaultTokenDistroHelper } from './useGIVTokenDistroHelper';
import { ITokenDistro } from '@/types/subgraph';

const useRegenTokenDistroHelper = (tokenDistro: ITokenDistro) => {
	const [regenTokenDistroHelper, setRegenTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);

	useEffect(() => {
		const updateHelper = () => {
			if (!tokenDistro) return;
			setRegenTokenDistroHelper(new TokenDistroHelper(tokenDistro));
		};

		updateHelper(); // Initial update

		const interval = setInterval(updateHelper, 5000); // Periodic update every 5 seconds

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, [tokenDistro]);

	return { regenTokenDistroHelper };
};

export default useRegenTokenDistroHelper;

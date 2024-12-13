import { useState, useEffect } from 'react';
import { AddressZero } from '@ethersproject/constants';
import { TokenDistroHelper } from '@/lib/contractHelper/TokenDistroHelper';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
import { useSubgraphInfo } from './useSubgraphInfo';

export const defaultTokenDistroHelper = new TokenDistroHelper({
	contractAddress: AddressZero,
	initialAmount: '0',
	lockedAmount: '0',
	totalTokens: '0',
	//Used gnosis start time (2021-12-24T16:00:00.000Z) to show givbacks tound correctly in https://giveth.io/givbacks
	// https://gnosisscan.io/address/0xc0dbDcA66a0636236fAbe1B3C16B1bD4C84bB1E1#readProxyContract
	startTime: 1640361600000,
	cliffTime: 0,
	endTime: 0,
});

const useGIVTokenDistroHelper = (hold = false) => {
	const [givTokenDistroHelper, setGIVTokenDistroHelper] =
		useState<TokenDistroHelper>(defaultTokenDistroHelper);
	const [isLoaded, setIsLoaded] = useState(false);
	const currentValues = useSubgraphInfo();

	useEffect(() => {
		const updateHelper = () => {
			const sdh = new SubgraphDataHelper(currentValues.data);
			setGIVTokenDistroHelper(
				new TokenDistroHelper(sdh.getGIVTokenDistro()),
			);
			setIsLoaded(currentValues.isFetched as boolean);
		};

		updateHelper(); // Initial update

		const interval = setInterval(updateHelper, 5000); // Periodic update every 5 seconds

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, [currentValues.data]);

	return { givTokenDistroHelper, isLoaded };
};

export default useGIVTokenDistroHelper;

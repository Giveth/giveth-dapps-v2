import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useAppDispatch } from '@/features/hooks';
import config from '@/configuration';
import {
	fetchXDaiInfoAsync,
	fetchMainnetInfoAsync,
	fetchCurrentInfoAsync,
} from '@/features/subgraph/subgraph.thunks';

const SubgraphController = () => {
	const dispatch = useAppDispatch();
	const { chainId, account } = useWeb3React();

	useEffect(() => {
		const _account = account ?? '';
		const _chainId = chainId ?? 0;
		dispatch(fetchXDaiInfoAsync(_account));
		dispatch(fetchMainnetInfoAsync(_account));
		const interval = setInterval(() => {
			dispatch(
				fetchCurrentInfoAsync({
					userAddress: _account,
					chainId: _chainId,
				}),
			);
		}, config.SUBGRAPH_POLLING_INTERVAL);
		return () => {
			clearInterval(interval);
		};
	}, [account, chainId]);
	return null;
};

export default SubgraphController;

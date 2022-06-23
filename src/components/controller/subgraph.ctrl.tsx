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
		if (!account || !chainId) return;
		if (chainId !== config.XDAI_NETWORK_NUMBER)
			dispatch(fetchXDaiInfoAsync(account));
		if (chainId !== config.MAINNET_NETWORK_NUMBER)
			dispatch(fetchMainnetInfoAsync(account));
		dispatch(
			fetchCurrentInfoAsync({
				userAddress: account,
				chainId,
			}),
		);
		const interval = setInterval(() => {
			dispatch(
				fetchCurrentInfoAsync({
					userAddress: account,
					chainId,
				}),
			);
		}, config.SUBGRAPH_POLLING_INTERVAL);
		return () => {
			clearInterval(interval);
		};
	}, [account, chainId, dispatch]);
	return null;
};

export default SubgraphController;

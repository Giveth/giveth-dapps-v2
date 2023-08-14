import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { useAppDispatch } from '@/features/hooks';
import config from '@/configuration';
import {
	fetchCurrentInfoAsync,
	fetchAllInfoAsync,
} from '@/features/subgraph/subgraph.thunks';

const SubgraphController = () => {
	const dispatch = useAppDispatch();
	const { chainId, account } = useWeb3React();

	useEffect(() => {
		const _account = account ? account : undefined;
		const _chainID = chainId || config.MAINNET_NETWORK_NUMBER;
		dispatch(
			fetchAllInfoAsync({ userAddress: _account, chainId: _chainID }),
		);
		const interval = setInterval(() => {
			dispatch(
				fetchCurrentInfoAsync({
					userAddress: _account,
					chainId: _chainID,
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

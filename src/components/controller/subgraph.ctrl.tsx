import { useEffect } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useAppDispatch } from '@/features/hooks';
import config from '@/configuration';
import {
	fetchCurrentInfoAsync,
	fetchAllInfoAsync,
} from '@/features/subgraph/subgraph.thunks';

const SubgraphController = () => {
	const dispatch = useAppDispatch();

	const chainId = useChainId();
	const { address } = useAccount();

	useEffect(() => {
		const _address = address ? address : undefined;
		const _chainID = chainId || config.MAINNET_NETWORK_NUMBER;
		setTimeout(
			() => {
				dispatch(
					fetchAllInfoAsync({
						userAddress: _address,
						chainId: _chainID,
					}),
				);
			},
			_address ? 1000 : 0, // Prevent set no account info after account connected
		);
		const interval = setInterval(() => {
			dispatch(
				fetchCurrentInfoAsync({
					userAddress: _address,
					chainId: _chainID,
				}),
			);
		}, config.SUBGRAPH_POLLING_INTERVAL);
		return () => {
			clearInterval(interval);
		};
	}, [address, chainId, dispatch]);
	return null;
};

export default SubgraphController;

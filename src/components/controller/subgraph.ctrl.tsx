import React, { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { Address } from 'viem';
import config from '@/configuration';
import {
	fetchLatestIndexedBlock,
	fetchSubgraphData,
} from '@/services/subgraph.service';

const SubgraphController: React.FC = () => {
	const { address } = useAccount();
	const queryClient = useQueryClient();
	const pollingIntervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

	useQueries({
		queries: config.CHAINS_WITH_SUBGRAPH.map(chain => ({
			queryKey: ['subgraph', chain.id, address] as [
				string,
				number,
				Address,
			],
			queryFn: async () => await fetchSubgraphData(chain.id, address),
			staleTime: config.SUBGRAPH_POLLING_INTERVAL,
			enabled: !!address,
		})),
	});

	useEffect(() => {
		const handleEvent = (
			event: CustomEvent<{
				type: string;
				chainId: number;
				blockNumber: number;
				address: Address;
			}>,
		) => {
			const {
				type,
				chainId: eventChainId,
				blockNumber,
				address: eventAddress,
			} = event.detail;
			if (type === 'success' && eventChainId) {
				console.log('event.detail', event.detail);
				if (pollingIntervalsRef.current[eventChainId]) {
					clearInterval(pollingIntervalsRef.current[eventChainId]);
				}

				pollingIntervalsRef.current[eventChainId] = setInterval(
					async () => {
						const latestBlockNumber =
							await fetchLatestIndexedBlock(eventChainId);
						console.log('latestBlockNumber', latestBlockNumber);
						if (latestBlockNumber >= blockNumber) {
							queryClient.refetchQueries({
								queryKey: [
									'subgraph',
									eventChainId,
									eventAddress,
								],
							});
							clearInterval(
								pollingIntervalsRef.current[eventChainId],
							);
							delete pollingIntervalsRef.current[eventChainId];
						}
					},
					1000,
				);
			}
		};

		window.addEventListener('chainEvent', handleEvent as EventListener);

		const currentPollingIntervals = pollingIntervalsRef.current;

		return () => {
			window.removeEventListener(
				'chainEvent',
				handleEvent as EventListener,
			);
			Object.values(currentPollingIntervals).forEach(clearInterval);
		};
	}, [queryClient, address]);

	return null;
};

export default SubgraphController;

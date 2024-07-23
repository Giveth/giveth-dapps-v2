import React, { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import { Address } from 'viem';
import config from '@/configuration';
import { fetchSubgraph } from '@/services/subgraph.service';
import { SubgraphQueryBuilder } from '@/lib/subgraph/subgraphQueryBuilder';
import { transformSubgraphData } from '@/lib/subgraph/subgraphDataTransform';
import { ISubgraphState } from '@/types/subgraph';

const SUBGRAPH_METADATA_QUERY = `{
  _meta {
	block {
	  number
	}
  }
}`;

export const fetchSubgraphData = async (
	chainId?: number,
	address?: Address,
): Promise<ISubgraphState> => {
	if (!chainId || !address) return {} as ISubgraphState;
	let response;
	let uri = config.EVM_NETWORKS_CONFIG[chainId]?.subgraphAddress;

	if (!uri) {
		response = {};
	} else {
		response = await fetchSubgraph(
			SubgraphQueryBuilder.getChainQuery(chainId, address),
			chainId,
		);
	}
	return transformSubgraphData({
		...response,
		networkNumber: chainId,
	});
};

export const fetchLatestIndexedBlock = async (chainId: number) => {
	let response;
	let uri = config.EVM_NETWORKS_CONFIG[chainId]?.subgraphAddress;

	if (!uri) {
		response = {};
	} else {
		response = await fetchSubgraph(SUBGRAPH_METADATA_QUERY, chainId);
		return response._meta.block.number;
	}
	return response;
};

const SubgraphController: React.FC = () => {
	const { chain, address } = useAccount();
	const chainId = chain?.id;
	const queryClient = useQueryClient();
	const pollingIntervalsRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

	const queries = useQueries({
		queries: config.CHAINS_WITH_SUBGRAPH.map(chain => ({
			queryKey: ['subgraph', chain.id, address] as [
				string,
				number,
				Address,
			],
			queryFn: async () => await fetchSubgraphData(chain.id, address),
			staleTime:
				chainId === chain.id
					? config.ACTIVE_SUBGRAPH_POLLING_INTERVAL
					: config.SUBGRAPH_POLLING_INTERVAL,
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

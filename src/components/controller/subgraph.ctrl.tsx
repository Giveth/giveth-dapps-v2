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
	const pollingTimeoutsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
	const refetchedChainsRef = useRef<Set<number>>(new Set());

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
			console.log('event', event);
			const {
				type,
				chainId: eventChainId,
				blockNumber,
				address: eventAddress,
			} = event.detail;

			if (type === 'success' && eventChainId) {
				console.log('event.detail', event.detail);

				// Reset refetchedChainsRef for the current chain ID
				refetchedChainsRef.current.delete(eventChainId);

				// Ensure any existing timeout is cleared
				if (pollingTimeoutsRef.current[eventChainId]) {
					clearTimeout(pollingTimeoutsRef.current[eventChainId]);
				}

				const pollLatestBlock = async () => {
					const latestBlockNumber =
						await fetchLatestIndexedBlock(eventChainId);
					console.log('event latestBlockNumber', latestBlockNumber);

					if (
						latestBlockNumber >= blockNumber &&
						!refetchedChainsRef.current.has(eventChainId)
					) {
						refetchedChainsRef.current.add(eventChainId);
						console.log(
							'event Refetching queries for chain',
							latestBlockNumber,
							blockNumber,
						);

						queryClient.refetchQueries({
							queryKey: ['subgraph', eventChainId, eventAddress],
						});
					} else {
						// Schedule next check if condition is not met
						pollingTimeoutsRef.current[eventChainId] = setTimeout(
							pollLatestBlock,
							2000,
						);
					}
				};

				// Start polling with timeout
				pollingTimeoutsRef.current[eventChainId] = setTimeout(
					pollLatestBlock,
					3000,
				);
			}
		};

		window.addEventListener('chainEvent', handleEvent as EventListener);

		return () => {
			window.removeEventListener(
				'chainEvent',
				handleEvent as EventListener,
			);
			Object.values(pollingTimeoutsRef.current).forEach(clearTimeout);
		};
	}, [queryClient, address]);

	return null;
};

export default SubgraphController;

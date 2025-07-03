import React, { useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { Address } from 'viem';
import { fetchLatestIndexedBlock } from '@/services/subgraph.service';
import { useFetchSubgraphDataForAllChains } from '@/hooks/useFetchSubgraphDataForAllChains';
import { useInteractedBlockNumber } from '@/hooks/useInteractedBlockNumber';

const SubgraphController: React.FC = () => {
	const { address } = useAccount();
	const queryClient = useQueryClient();
	const pollingTimeoutsRef = useRef<{ [key: number]: NodeJS.Timeout }>({});
	const refetchedChainsRef = useRef<Set<number>>(new Set());
	useFetchSubgraphDataForAllChains();
	useInteractedBlockNumber();

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

				// Reset refetchedChainsRef for the current chain ID
				refetchedChainsRef.current.delete(eventChainId);
				queryClient.setQueryData(
					['interactedBlockNumber', eventChainId],
					blockNumber,
				);

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

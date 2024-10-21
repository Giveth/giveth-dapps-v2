import { useAccount } from 'wagmi';
import { useMemo } from 'react';
import { useInteractedBlockNumber } from './useInteractedBlockNumber';
import { useSubgraphInfo } from './useSubgraphInfo';

export const useSubgraphSyncInfo = (chainId?: number) => {
	const { chainId: accountChainId } = useAccount();
	const _chainId = chainId || accountChainId;
	const interactedBlockInfo = useInteractedBlockNumber(_chainId);
	const subgraphInfo = useSubgraphInfo();

	const isSynced = useMemo(() => {
		if (!subgraphInfo.data?.indexedBlockNumber) return false;
		if (interactedBlockInfo.data === undefined) return false;
		try {
			const indexedBlockNumber = Number(
				subgraphInfo.data?.indexedBlockNumber,
			);
			const interactedBlockNumber = interactedBlockInfo.data;
			return indexedBlockNumber >= interactedBlockNumber;
		} catch (error) {
			return false;
		}
	}, [interactedBlockInfo.data, subgraphInfo.data?.indexedBlockNumber]);

	return {
		isSynced,
		interactedBlockNumber: interactedBlockInfo.data,
		indexedBlockNumber: subgraphInfo.data?.indexedBlockNumber,
	};
};

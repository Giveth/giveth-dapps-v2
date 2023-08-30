import { ISubgraphState } from './subgraph.types';

export const getDefaultSubgraphValues = (chainId: number): ISubgraphState => ({
	userNotStakedPositions: [],
	userStakedPositions: [],
	allPositions: [],
	networkNumber: chainId,
	isLoaded: false,
});

type ValidKeys = 'mainnetValues' | 'gnosisValues' | 'optimismValues';

export function isKeyValid(key: string): key is ValidKeys {
	return ['mainnetValues', 'gnosisValues', 'optimismValues'].includes(key);
}

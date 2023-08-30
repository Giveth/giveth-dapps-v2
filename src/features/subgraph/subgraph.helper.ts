import { ISubgraphState } from './subgraph.types';

export const getDefaultSubgraphValues = (chainId: number): ISubgraphState => ({
	userNotStakedPositions: [],
	userStakedPositions: [],
	allPositions: [],
	networkNumber: chainId,
	isLoaded: false,
});

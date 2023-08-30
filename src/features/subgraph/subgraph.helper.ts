import config from '@/configuration';
import { ISubgraphState } from './subgraph.types';

export const getDefaultSubgraphValues = (chainId: number): ISubgraphState => ({
	userNotStakedPositions: [],
	userStakedPositions: [],
	allPositions: [],
	networkNumber: chainId,
	isLoaded: false,
});

const chainInfoNames = {
	[config.MAINNET_NETWORK_NUMBER]: 'mainnetValues',
	[config.GNOSIS_NETWORK_NUMBER]: 'gnosisValues',
	[config.OPTIMISM_NETWORK_NUMBER]: 'optimismValues',
} as const;

type ValidKeys = (typeof chainInfoNames)[keyof typeof chainInfoNames];

export function isKeyValid(key: string): key is ValidKeys {
	return Object.values(chainInfoNames).includes(key as ValidKeys);
}

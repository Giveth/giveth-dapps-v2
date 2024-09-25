import { ChainType } from '@/types/config';

export interface ISwitchNetworkToast {
	acceptedChains?: number[];
}

export interface INetworkIdWithChain {
	chainType: ChainType;
	networkId: number;
}

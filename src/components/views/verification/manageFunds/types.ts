import { ChainType } from '@/types/config';

export interface ISelectedNetwork {
	label: string;
	value: number;
	id: number;
	chainType?: ChainType;
}

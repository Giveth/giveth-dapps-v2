import { Position } from '@uniswap/v3-sdk';
export interface LiquidityPosition {
	owner: string;
	staked: boolean;
	tokenId: number;
	uri: string;
	_position: Position | null;
}

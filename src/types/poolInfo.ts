import BigNumber from 'bignumber.js';

export interface UserStakeInfo {
	stakedAmount: bigint;
	notStakedAmount: bigint;
	earned: bigint;
}

export type APR = {
	// Total APR user get. i.e. Giveth Farming Program + ICHI reward
	effectiveAPR: BigNumber;
	vaultIRR?: BigNumber;
} | null;

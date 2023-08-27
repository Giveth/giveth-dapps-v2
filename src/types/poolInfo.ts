export interface UserStakeInfo {
	stakedAmount: bigint;
	notStakedAmount: bigint;
	earned: bigint;
}

export type APR = {
	// Total APR user get. i.e. Giveth Farming Program + ICHI reward
	effectiveAPR: bigint;
	vaultIRR?: bigint;
} | null;

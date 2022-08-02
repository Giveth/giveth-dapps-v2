import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

export interface UserStakeInfo {
	stakedAmount: ethers.BigNumber;
	notStakedAmount: ethers.BigNumber;
	earned: ethers.BigNumber;
}

export type APR = {
	// Total APR user get. i.e. Giveth Farming Program + ICHI reward
	effectiveAPR: BigNumber;
	vaultIRR?: BigNumber;
} | null;

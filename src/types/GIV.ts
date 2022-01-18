import { ethers } from 'ethers';

export interface ClaimData {
	index: number;
	amount: string;
	proof: Array<string>;
	flags: {
		[key: string]: boolean;
	};
}

export interface ITokenDistroBalance {
	claimable: ethers.BigNumber;
	allocatedAmount: ethers.BigNumber;
	claimedAmount: ethers.BigNumber;
}

import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { getNowUnixMS } from '@/helpers/time';
import { IUnipool } from '@/types/subgraph';

const toBN = (value: ethers.BigNumberish): BigNumber => {
	return new BigNumber(value.toString());
};

export class UnipoolHelper {
	private readonly totalSupply: BigNumber;
	private readonly lastUpdateTime: Date;
	private readonly periodFinish: Date;
	private readonly rewardPerTokenStored: BigNumber;
	private readonly rewardRate: BigNumber;

	constructor({
		lastUpdateTime,
		periodFinish,
		rewardPerTokenStored,
		rewardRate,
		totalSupply,
	}: IUnipool) {
		this.totalSupply = toBN(totalSupply);
		this.lastUpdateTime = lastUpdateTime;
		this.rewardRate = toBN(rewardRate);
		this.rewardPerTokenStored = toBN(rewardPerTokenStored);
		this.periodFinish = periodFinish;
	}

	get lastTimeRewardApplicable(): BigNumber {
		const lastTimeRewardApplicableMS: number = Math.min(
			getNowUnixMS(),
			this.periodFinish.getTime(),
		);
		return toBN(Math.floor(lastTimeRewardApplicableMS / 1000));
	}

	get rewardPerToken(): BigNumber {
		if (this.totalSupply.isZero()) {
			return this.rewardPerTokenStored;
		}
		return this.rewardPerTokenStored.plus(
			this.lastTimeRewardApplicable
				.minus(this.lastUpdateTime.getTime() / 1000)
				.times(this.rewardRate)
				.times(1e18)
				.div(this.totalSupply)
				.toFixed(0),
		);
	}

	earned = (
		rewards: ethers.BigNumber,
		userRewardPerTokenPaid: ethers.BigNumber,
		stakedAmount: ethers.BigNumber,
	): ethers.BigNumber => {
		const earndBN = toBN(stakedAmount)
			.times(this.rewardPerToken.minus(toBN(userRewardPerTokenPaid)))
			.div(1e18)
			.plus(rewards.toString());
		// console.log('earned:', earndBN.toFixed(0));
		return ethers.BigNumber.from(earndBN.toFixed(0));
	};
}

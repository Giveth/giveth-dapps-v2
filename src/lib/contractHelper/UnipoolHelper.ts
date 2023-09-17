import { getNowUnixMS } from '@/helpers/time';
import { IUnipool } from '@/types/subgraph';
import { E18 } from '../constants/constants';

export class UnipoolHelper {
	readonly totalSupply: bigint;
	private readonly lastUpdateTime: number;
	private readonly periodFinish: number;
	private readonly rewardPerTokenStored: bigint;
	private readonly _rewardRate: bigint;

	constructor({
		lastUpdateTime,
		periodFinish,
		rewardPerTokenStored,
		rewardRate,
		totalSupply,
	}: IUnipool) {
		this.totalSupply = BigInt(totalSupply);
		this.lastUpdateTime = lastUpdateTime;
		this._rewardRate = BigInt(rewardRate);
		this.rewardPerTokenStored = BigInt(rewardPerTokenStored);
		this.periodFinish = periodFinish;
	}

	get lastTimeRewardApplicable(): bigint {
		const lastTimeRewardApplicableMS: number = Math.min(
			getNowUnixMS(),
			this.periodFinish,
		);
		return BigInt(Math.floor(lastTimeRewardApplicableMS / 1000));
	}

	get rewardRate(): bigint {
		if (getNowUnixMS() > this.periodFinish) return 0n;
		return this._rewardRate;
	}

	get rewardPerToken(): bigint {
		if (this.totalSupply === 0n) {
			return this.rewardPerTokenStored;
		}
		const value1 =
			this.lastTimeRewardApplicable - BigInt(this.lastUpdateTime / 1000);
		const value2 = (this.rewardRate * E18) / this.totalSupply;
		return this.rewardPerTokenStored + value1 * value2;
	}

	earned = (
		rewards: bigint,
		userRewardPerTokenPaid: bigint,
		stakedAmount: bigint,
	): bigint => {
		const value1 = this.rewardPerToken - userRewardPerTokenPaid;
		const value2 = (stakedAmount * value1) / E18;
		return value2 + rewards;
	};
}

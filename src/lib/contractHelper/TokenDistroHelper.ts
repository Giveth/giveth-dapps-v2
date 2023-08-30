import { getNowUnixMS } from '@/helpers/time';
import { ITokenDistro, ITokenDistroBalance } from '@/types/subgraph';

export class TokenDistroHelper {
	public readonly contractAddress: string;
	public readonly initialAmount: bigint;
	public readonly lockedAmount: bigint;
	public readonly totalTokens: bigint;
	public readonly startTime: Date;
	public readonly cliffTime: Date;
	public readonly endTime: Date;
	public readonly duration: number;

	constructor({
		contractAddress,
		initialAmount,
		lockedAmount,
		totalTokens,
		startTime,
		cliffTime,
		endTime,
	}: ITokenDistro) {
		this.contractAddress = contractAddress;
		this.initialAmount = BigInt(initialAmount);
		this.lockedAmount = BigInt(lockedAmount);
		this.totalTokens = BigInt(totalTokens);
		this.startTime = new Date(startTime);
		this.cliffTime = new Date(cliffTime);
		this.endTime = new Date(endTime);
		this.duration = this.endTime.getTime() - this.startTime.getTime();
	}

	get remain(): number {
		return Math.max(this.endTime.getTime() - getNowUnixMS(), 0);
	}

	get percent(): number {
		const { duration, remain } = this;
		if (!duration) return 0;
		return (Math.max(duration - remain, 0) / duration) * 100;
	}

	get globallyClaimableNow(): bigint {
		const now = getNowUnixMS();

		if (now < this.startTime.getTime()) return 0n;
		if (now <= this.cliffTime.getTime()) return this.initialAmount;
		if (now > this.endTime.getTime()) return this.totalTokens;

		const deltaTime = now - this.startTime.getTime();

		const releasedAmount =
			(this.lockedAmount * BigInt(deltaTime)) / BigInt(this.duration);
		return this.initialAmount + releasedAmount;
	}

	public getLiquidPart = (amount: bigint): bigint => {
		if (this.totalTokens === 0n) return 0n;
		return (this.globallyClaimableNow * amount) / this.totalTokens;
	};

	public getStreamPartTokenPerSecond = (amount: bigint): bigint => {
		const toFinish = this.remain / 1000;
		if (toFinish <= 0) return 0n;
		const lockAmount = amount - this.getLiquidPart(amount);
		return lockAmount / BigInt(toFinish);
	};

	public getStreamPartTokenPerWeek = (amount: bigint): bigint => {
		return this.getStreamPartTokenPerSecond(amount) * 604800n;
	};

	public getUserClaimableNow(
		tokenDistroBalance: ITokenDistroBalance,
	): bigint {
		return this.getLiquidPart(
			BigInt(tokenDistroBalance.allocatedTokens),
		).sub(tokenDistroBalance.claimed);
	}

	public get GlobalReleasePercentage(): number {
		if (this.totalTokens.isZero()) return 0;
		return new BigNumber(this.globallyClaimableNow.toString())
			.times(100)
			.div(this.totalTokens.toString())
			.toNumber();
	}
}

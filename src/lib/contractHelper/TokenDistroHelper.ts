import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { Zero } from '@ethersproject/constants';
import { getNowUnixMS } from '@/helpers/time';
import { ITokenDistro, ITokenDistroBalance } from '@/types/subgraph';
import { BN } from '@/helpers/number';

export class TokenDistroHelper {
	public readonly contractAddress: string;
	public readonly initialAmount: ethers.BigNumber;
	public readonly lockedAmount: ethers.BigNumber;
	public readonly totalTokens: ethers.BigNumber;
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
		this.initialAmount = BN(initialAmount);
		this.lockedAmount = BN(lockedAmount);
		this.totalTokens = BN(totalTokens);
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

	get globallyClaimableNow(): ethers.BigNumber {
		const now = getNowUnixMS();

		if (now < this.startTime.getTime()) return Zero;
		if (now <= this.cliffTime.getTime()) return this.initialAmount;
		if (now > this.endTime.getTime()) return this.totalTokens;

		const deltaTime = now - this.startTime.getTime();

		const releasedAmount = this.lockedAmount
			.mul(deltaTime)
			.div(this.duration);
		return this.initialAmount.add(releasedAmount);
	}

	public getLiquidPart = (amount: ethers.BigNumber): ethers.BigNumber => {
		if (this.totalTokens.isZero()) return Zero;
		return this.globallyClaimableNow.mul(amount).div(this.totalTokens);
	};

	public getStreamPartTokenPerSecond = (
		amount: ethers.BigNumber,
	): BigNumber => {
		const toFinish = this.remain / 1000;
		if (toFinish <= 0) return new BigNumber(0);
		const lockAmount = amount.sub(this.getLiquidPart(amount));
		return new BigNumber(lockAmount.toString()).div(toFinish);
	};

	public getStreamPartTokenPerWeek = (
		amount: ethers.BigNumber,
	): BigNumber => {
		return this.getStreamPartTokenPerSecond(amount).times(604800);
	};

	public getUserClaimableNow(
		tokenDistroBalance: ITokenDistroBalance,
	): ethers.BigNumber {
		return this.getLiquidPart(BN(tokenDistroBalance.allocatedTokens)).sub(
			tokenDistroBalance.claimed,
		);
	}

	public get GlobalReleasePercentage(): number {
		if (this.totalTokens.isZero()) return 0;
		return new BigNumber(this.globallyClaimableNow.toString())
			.times(100)
			.div(this.totalTokens.toString())
			.toNumber();
	}
}

import BigNumber from 'bignumber.js';
import { getNowUnixMS } from './time';
import { IGIVpower } from '@/types/subgraph';

export const getGIVpowerRoundsInfo = (
	initialDate: string,
	roundDuration: number,
): {
	currentRound: number;
	nextRoundDate: string;
} => {
	if (roundDuration === 0)
		return {
			currentRound: 0,
			nextRoundDate: '0',
		};
	const currentRound = Math.floor(
		(getNowUnixMS() / 1000 - Number(initialDate)) / roundDuration,
	);
	const nextRoundDate: string = (
		(Number(initialDate) + roundDuration * (currentRound + 1)) *
		1000
	).toString();
	return { currentRound, nextRoundDate };
};

export const getUnlockDate = (givPowerInfo: IGIVpower, rounds: number) => {
	const { nextRoundDate, roundDuration } = givPowerInfo;
	return Number(nextRoundDate) + rounds * roundDuration * 1000;
};

export const avgAPR = (
	apr: BigNumber | null,
	gGIV?: string,
	unipoolBalance?: string,
) => {
	if (
		!apr ||
		apr.isZero() ||
		!gGIV ||
		gGIV === '0' ||
		!unipoolBalance ||
		unipoolBalance === '0'
	)
		return new BigNumber(0);
	const avg = new BigNumber(unipoolBalance).dividedBy(gGIV);
	return apr.multipliedBy(avg);
};

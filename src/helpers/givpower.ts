import BigNumber from 'bignumber.js';
import { IGIVpowerInfo } from '@/types/subgraph';
import { getNowUnixMS } from './time';

export const getGIVpowerRoundsInfo = (
	initialDate: number,
	roundDuration: number,
) => {
	const currentRound = Math.floor(
		(getNowUnixMS() / 1000 - initialDate) / roundDuration,
	);
	const nextRoundDate = (
		(initialDate + roundDuration * (currentRound + 1)) *
		1000
	).toString();
	return { currentRound, nextRoundDate };
};

export const getUnlockDate = (givpowerInfo: IGIVpowerInfo, rounds: number) => {
	const { nextRoundDate, roundDuration } = givpowerInfo;
	return Number(nextRoundDate) + rounds * roundDuration * 1000;
};

export const avgAPR = (
	apr: BigNumber | null,
	gGIV?: string,
	givStaked?: string,
) => {
	if (
		!apr ||
		apr.isZero() ||
		!gGIV ||
		gGIV === '0' ||
		!givStaked ||
		givStaked === '0'
	)
		return new BigNumber(0);
	const avg = new BigNumber(givStaked).dividedBy(gGIV);
	return apr.multipliedBy(avg);
};

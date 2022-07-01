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
	return nextRoundDate + rounds * roundDuration * 1000;
};

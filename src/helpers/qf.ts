import { IQFRound } from '@/apollo/types/types';
import { getNowUnixMS } from './time';

export const hasActiveRound = (qfRounds: IQFRound[] | undefined) => {
	if (!qfRounds) return false;
	return qfRounds.some(
		round =>
			round.isActive &&
			new Date(round.beginDate).getTime() < getNowUnixMS(),
	);
};

export const calculateTotalEstimatedMatching = (
	projectDonationsSqrtRootSum?: number,
	allProjectsSum?: number,
	matchingPool?: number,
) => {
	if (!matchingPool || !projectDonationsSqrtRootSum || !allProjectsSum)
		return 0;
	return (
		(Math.pow(projectDonationsSqrtRootSum, 2) / allProjectsSum) *
		matchingPool
	);
};

export const calculateEstimatedMatchingWithDonationAmount = (
	donationAmount: number,
	projectDonationsSqrtRootSum?: number,
	allProjectsSum?: number,
	matchingPool?: number,
) => {
	if (!matchingPool || !donationAmount) return 0;
	const _projectDonationsSqrtRootSum = projectDonationsSqrtRootSum || 0;
	const _allProjectsSum = allProjectsSum || 0;
	const beforeNewDonationPow = Math.pow(_projectDonationsSqrtRootSum, 2);
	const afterNewDonationPow = Math.pow(
		_projectDonationsSqrtRootSum + Math.sqrt(donationAmount),
		2,
	);
	return (
		(afterNewDonationPow /
			(_allProjectsSum + afterNewDonationPow - beforeNewDonationPow)) *
		matchingPool
	);
};

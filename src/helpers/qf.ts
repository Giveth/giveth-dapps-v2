import { IQFRound } from '@/apollo/types/types';

export const hasActiveRound = (qfRounds: IQFRound[] | undefined) => {
	if (!qfRounds) return false;
	return qfRounds.some(round => round.isActive);
};

export const calculateTotalEstimatedMatching = (
	projectDonationsSqrtRootSum?: number,
	allProjectsSum?: number,
	matchingPool?: number,
) => {
	if (!matchingPool) return 0;
	const _allProjectsSum = allProjectsSum || 1;
	const _projectDonationsSqrtRootSum = _allProjectsSum || 1;
	return (
		(Math.pow(_projectDonationsSqrtRootSum, 2) / _allProjectsSum) *
		matchingPool
	);
};

export const calculateEstimatedMatchingWithDonationAmount = (
	donationAmount: number,
	projectDonationsSqrtRootSum?: number,
	allProjectsSum?: number,
	matchingPool?: number,
) => {
	if (!matchingPool) return 0;
	const _allProjectsSum = allProjectsSum || 1;
	const _projectDonationsSqrtRootSum = _allProjectsSum || 1;
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

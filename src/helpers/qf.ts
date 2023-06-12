import { IQFRound } from '@/apollo/types/types';

export const hasActiveRound = (qfRounds: IQFRound[] | undefined) => {
	if (!qfRounds) return false;
	return qfRounds.some(round => round.isActive);
};

export const calculateTotalEstimatedMatching = (
	projectDonationsSqrtRootSum: number,
	allProjectsSum: number,
	matchingPool: number,
) => {
	return (
		(Math.pow(projectDonationsSqrtRootSum, 2) / allProjectsSum) *
		matchingPool
	);
};

export const calculateEstimatedMatchingWithDonationAmount = (
	projectDonationsSqrtRootSum: number,
	allProjectsSum: number,
	matchingPool: number,
	donationAmount: number,
) => {
	const beforeNewDonationPow = Math.pow(projectDonationsSqrtRootSum, 2);
	const afterNewDonationPow = Math.pow(
		projectDonationsSqrtRootSum + Math.sqrt(donationAmount),
		2,
	);
	return (
		(afterNewDonationPow /
			(allProjectsSum + afterNewDonationPow - beforeNewDonationPow)) *
		matchingPool
	);
};

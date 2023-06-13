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
	if (!projectDonationsSqrtRootSum || !allProjectsSum || !matchingPool)
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
	if (!projectDonationsSqrtRootSum || !allProjectsSum || !matchingPool)
		return 0;
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

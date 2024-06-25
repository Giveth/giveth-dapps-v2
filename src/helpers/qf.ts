import { IQFRound } from '@/apollo/types/types';
import { getNowUnixMS } from './time';
import { formatDonation } from '@/helpers/number';

export const hasActiveRound = (qfRounds: IQFRound[] | undefined) => {
	if (!qfRounds) return false;
	return qfRounds.some(
		round =>
			round.isActive &&
			new Date(round.beginDate).getTime() < getNowUnixMS(),
	);
};

export const getActiveRound = (qfRounds: IQFRound[] | undefined) => {
	if (!qfRounds)
		return { activeQFRound: undefined, activeStartedRound: undefined };
	const activeQFRound = qfRounds.find(round => round.isActive);
	const activeStartedRound =
		activeQFRound &&
		new Date(activeQFRound.beginDate).getTime() < getNowUnixMS()
			? activeQFRound
			: undefined;
	return { activeQFRound, activeStartedRound };
};

export const hasRoundStarted = (qfRound: IQFRound | null): boolean => {
	return !!qfRound && new Date(qfRound.beginDate).getTime() < getNowUnixMS();
};

export const calculateTotalEstimatedMatching = (
	projectDonationsSqrtRootSum?: number,
	allProjectsSum?: number,
	matchingPool?: number,
	matchingCapPercentage?: number,
) => {
	if (
		!matchingCapPercentage ||
		!matchingPool ||
		!projectDonationsSqrtRootSum ||
		!allProjectsSum
	)
		return 0;
	const result = Math.min(
		(Math.pow(projectDonationsSqrtRootSum, 2) / allProjectsSum) *
			matchingPool,
		matchingPool * matchingCapPercentage,
	);
	return result > 0 && result < 1 ? 1 : result;
};

export const calculateEstimatedMatchingWithDonationAmount = (
	donationAmount: number,
	projectDonationsSqrtRootSum?: number,
	allProjectsSum?: number,
	matchingPool?: number,
	matchingCapPercentage?: number,
) => {
	if (!matchingCapPercentage || !matchingPool || !donationAmount) return 0;
	const _projectDonationsSqrtRootSum = projectDonationsSqrtRootSum || 0;
	const _allProjectsSum = allProjectsSum || 0;
	const beforeNewDonationPow = Math.pow(_projectDonationsSqrtRootSum, 2);
	const afterNewDonationPow = Math.pow(
		_projectDonationsSqrtRootSum + Math.sqrt(donationAmount),
		2,
	);

	// To address https://github.com/Giveth/giveth-dapps-v2/issues/2886#issuecomment-1634650868
	const newEstimateMatching = Math.min(
		(afterNewDonationPow /
			(_allProjectsSum + afterNewDonationPow - beforeNewDonationPow)) *
			matchingPool,
		matchingPool * matchingCapPercentage,
	);
	return (
		newEstimateMatching *
		((afterNewDonationPow - beforeNewDonationPow) / afterNewDonationPow)
	);
};

export const getEstimatedMatchingRange = (
	amount: number,
	currency: string,
	locale: string,
	allocatedTokenSymbol: string | undefined,
): string => {
	const formatWithCurrency = (amount: number) => {
		const formattedAmount = formatDonation(amount, currency, locale, true);
		return currency
			? formattedAmount
			: `${formattedAmount} ${allocatedTokenSymbol}`;
	};

	if (amount >= 2) {
		return `${formatWithCurrency((amount * 30) / 100)} - ${formatWithCurrency(amount)}`;
	}

	if (amount >= 1) {
		return '< $2';
	}

	return formatWithCurrency(amount);
};

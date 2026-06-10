import { IQFRound } from '@/apollo/types/types';
import { getV6ActiveQfProjectRedirect } from '@/services/v6QF';
import { getNowUnixMS } from './time';
// import { formatDonation } from '@/helpers/number';

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

/**
 * Single source of truth for the Stellar (QR) "sign in for GIVbacks" prompt.
 *
 * Stellar QR donations are matched without connecting a wallet, but GIVbacks
 * attribution still requires the donor to be signed in (the donation is sent
 * anonymously otherwise). The prompt should own the UI when GIVbacks is
 * achievable purely by signing in — i.e. both the project and the token are
 * GIVbacks eligible and the donor isn't fully signed in.
 *
 * Shared by QRDonationCard (renders the prompt when this is true) and
 * EligibilityBadges (renders the badges only when this is false), so the two
 * partition the disconnected-Stellar state with no overlap and no gap.
 */
export const shouldShowGivbacksSignInPrompt = ({
	isProjectGivbacksEligible,
	isTokenGivbacksEligible,
	isSignedIn,
	isEnabled,
}: {
	isProjectGivbacksEligible: boolean;
	isTokenGivbacksEligible: boolean;
	isSignedIn: boolean;
	isEnabled: boolean;
}): boolean =>
	isProjectGivbacksEligible &&
	isTokenGivbacksEligible &&
	(!isEnabled || !isSignedIn);

// TODO remove this once the ethereum security QF round is no longer active
export const isProjectInActiveEthereumSecurityQFRound = async (
	projectId: number | string,
) => {
	const numericProjectId = Number(projectId);
	if (!projectId || Number.isNaN(numericProjectId)) return false;
	return !!(await getV6ActiveQfProjectRedirect(numericProjectId));
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

// export const getEstimatedMatchingRange = (
// 	amount: number,
// 	currency: string,
// 	locale: string,
// 	allocatedTokenSymbol: string | undefined,
// ): string => {
// 	const formatWithCurrency = (amount: number) => {
// 		const formattedAmount = formatDonation(amount, currency, locale, true);
// 		return currency
// 			? formattedAmount
// 			: `${formattedAmount} ${allocatedTokenSymbol}`;
// 	};

// 	if (amount >= 2) {
// 		return `${formatWithCurrency((amount * 30) / 100)} - ${formatWithCurrency(amount)}`;
// 	}

// 	if (amount >= 1) {
// 		return '< $2';
// 	}

// 	return formatWithCurrency(amount);
// };

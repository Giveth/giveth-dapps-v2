import { IProject } from '@/apollo/types/types';

/**
 * @title haveProjectRound
 *
 * @description Check if the project has a round
 * @param project - IProject
 * @returns boolean
 */
export const haveProjectRound = (project: IProject) => {
	return (
		project.qfRounds?.length &&
		project.qfRounds?.length > 0 &&
		project.qfRounds?.some(round => round.isActive)
	);
};

/**
 * @title getProjectTotalRaisedUSD
 *
 * @description Get the project total raised in USD
 * @param project - IProject
 * @returns number
 */
export const getProjectTotalRaisedUSD = (project: IProject) => {
	return project.totalDonations || project.totalRaisedUsd || 0;
};

/**
 * @title getSumDonationValueUsdForActiveQfRound
 *
 * @description Get the sum donation value in USD for the active QF round
 * @param project - IProject
 * @returns number
 */
export const getSumDonationValueUsdForActiveQfRound = (project: IProject) => {
	return (
		project.sumDonationValueUsdForActiveQfRound ||
		project.qfRoundStats?.totalRaisedInRound ||
		0
	);
};

/**
 * @title getCountUniqueDonorsForActiveQfRound
 *
 * @description Get the count of unique donors for the active QF round
 * @param project - IProject
 * @returns number
 */
export const getCountUniqueDonorsForActiveQfRound = (project: IProject) => {
	return (
		project.qfRoundStats?.totalDonorsInRound ||
		project.countUniqueDonorsForActiveQfRound ||
		0
	);
};

import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import { EVerificationSteps, IProjectVerification } from '@/apollo/types/types';

export const getMainCategorySlug = (category?: { slug: string }) =>
	category?.slug === 'all' ? undefined : category?.slug;

export const sortMap = {
	[EProjectsSortBy.MOST_FUNDED.toLowerCase()]: EProjectsSortBy.MOST_FUNDED,
	[EProjectsSortBy.MOST_LIKED.toLowerCase()]: EProjectsSortBy.MOST_LIKED,
	[EProjectsSortBy.NEWEST.toLowerCase()]: EProjectsSortBy.NEWEST,
	[EProjectsSortBy.OLDEST.toLowerCase()]: EProjectsSortBy.OLDEST,
	[EProjectsSortBy.QUALITY_SCORE.toLowerCase()]:
		EProjectsSortBy.QUALITY_SCORE,
	[EProjectsSortBy.INSTANT_BOOSTING.toLowerCase()]:
		EProjectsSortBy.INSTANT_BOOSTING,
	[EProjectsSortBy.GIVPOWER.toLowerCase()]: EProjectsSortBy.GIVPOWER,
	[EProjectsSortBy.RECENTLY_UPDATED.toLowerCase()]:
		EProjectsSortBy.RECENTLY_UPDATED,
	[EProjectsSortBy.ActiveQfRoundRaisedFunds.toLowerCase()]:
		EProjectsSortBy.ActiveQfRoundRaisedFunds,
	[EProjectsSortBy.EstimatedMatching.toLowerCase()]:
		EProjectsSortBy.EstimatedMatching,
};

/**
 * Check if step data exist, if not return false
 *
 * @param stepSlug slug of the step
 * @param verificationData type of IProjectVerification
 *
 * @returns
 */
export function checkVerificationStep(
	stepSlug: string,
	verificationData: IProjectVerification | undefined,
) {
	switch (stepSlug) {
		case EVerificationSteps.BEFORE_START:
			return true;
		case EVerificationSteps.PERSONAL_INFO:
			return (
				verificationData !== undefined &&
				verificationData.personalInfo !== null
			);
		case EVerificationSteps.SOCIAL_PROFILES:
			return (
				verificationData !== undefined &&
				verificationData.socialProfiles !== undefined &&
				verificationData.projectRegistry !== null &&
				verificationData.socialProfiles.length > 0
			);
		case EVerificationSteps.PROJECT_REGISTRY:
			return (
				verificationData !== undefined &&
				verificationData.projectRegistry !== null
			);
		case EVerificationSteps.PROJECT_CONTACTS:
			return (
				verificationData !== undefined &&
				verificationData.projectContacts !== null
			);
		case EVerificationSteps.IMPACT:
			return (
				verificationData !== undefined &&
				verificationData.milestones !== null
			);
		case EVerificationSteps.MANAGING_FUNDS:
			return (
				verificationData !== undefined &&
				verificationData.managingFunds !== null
			);
		case EVerificationSteps.TERM_AND_CONDITION:
			return (
				verificationData !== undefined &&
				verificationData.isTermAndConditionsAccepted
			);
		default:
			return false;
	}
}

/**
 * Check if all steps are completed
 *
 * @param menuList array
 * @param verificationData type of IProjectVerification
 * @returns boolean
 * */
export function checkAllVerificationsSteps(
	menuList: Array<{ label: string; slug: string }>,
	verificationData: IProjectVerification | undefined,
) {
	const checkedArray = menuList.map((item, index) => {
		// skip "social profiles" and last step "done"
		if (index !== 8 && index !== 2) {
			return checkVerificationStep(item.slug, verificationData);
		}
		return true;
	});

	console.log({ checkedArray });

	// Check if all elements are true
	return checkedArray.every(Boolean);
}

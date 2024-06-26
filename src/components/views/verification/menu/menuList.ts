import { EVerificationSteps } from '@/apollo/types/types';

const menuList = [
	{ label: 'label.before_you_start', slug: EVerificationSteps.BEFORE_START },
	{ label: 'label.personal_info', slug: EVerificationSteps.PERSONAL_INFO },
	{
		label: 'label.social_profiles',
		slug: EVerificationSteps.SOCIAL_PROFILES,
	},
	{ label: 'label.registration', slug: EVerificationSteps.PROJECT_REGISTRY },
	{
		label: 'label.project_contact',
		slug: EVerificationSteps.PROJECT_CONTACTS,
	},
	{ label: 'label.impact', slug: EVerificationSteps.IMPACT },
	{
		label: 'label.managing_funds',
		slug: EVerificationSteps.MANAGING_FUNDS,
	},
	{ label: 'label.tos', slug: EVerificationSteps.TERM_AND_CONDITION },
	{ label: 'label.done', slug: 'done' },
];

export default menuList;

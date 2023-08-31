import {
	IconBulbOutline32,
	IconFund32,
	IconGift32,
} from '@giveth/ui-design-system';
import Routes from '@/lib/constants/Routes';

export const projectOwnerCard = {
	icon: <IconBulbOutline32 />,
	title: 'Project Owner',
	description:
		'Learn how to create a project, promote it and raise donations.',
	buttonText: 'Learn how you can start',
	buttonLink: Routes.OnboardingProjects,
};

export const donorCard = {
	icon: <IconGift32 />,
	title: 'Donor',
	description: 'See how Giveth works for donors and it’s benefits.',
	buttonText: 'See how it works',
	buttonLink: Routes.OnboardingDonors,
};

export const GIVeconomyCard = {
	icon: <IconFund32 />,
	title: 'GIVeconomy',
	description:
		'Get into the economy of giving and learn how you can also benefit from it.',
	buttonText: 'Get started with Giveconomy',
	buttonLink: Routes.OnboardingGiveconomy,
};

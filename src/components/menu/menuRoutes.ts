import Routes from '@/lib/constants/Routes';

export const menuRoutes = [
	{
		title: 'label.home',
		href: [Routes.Home],
	},
	{
		title: 'label.projects',
		href: [Routes.Projects],
	},
	{
		title: 'label.giveconomy',
		href: [
			Routes.GIVeconomy,
			Routes.GIVbacks,
			Routes.GIVfarm,
			Routes.GIVgarden,
			Routes.GIVpower,
			Routes.GIVstream,
		],
	},
	{
		title: 'label.community',
		href: [Routes.Join],
	},
];

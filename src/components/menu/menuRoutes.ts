import Routes from '@/lib/constants/Routes';

export const menuRoutes = [
	{
		title: 'Home',
		href: [Routes.Home],
	},
	{
		title: 'Projects',
		href: [Routes.Projects],
	},
	{
		title: 'GIVeconomy',
		href: [
			Routes.GIVECONOMY,
			Routes.GIVbacks,
			Routes.GIVfarm,
			Routes.GIVgarden,
			Routes.GIVstream,
		],
	},
	{
		title: 'Community',
		href: [Routes.Join],
	},
];

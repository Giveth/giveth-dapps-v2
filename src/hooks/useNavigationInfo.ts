import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { EProjectsSortBy } from '@/apollo/types/gqlEnums';
import Routes from '@/lib/constants/Routes';

type Section = 'Community' | 'Projects' | 'GIVEconomy' | 'Home';

export const useNavigationInfo = () => {
	const router = useRouter();
	const currentPath = router.pathname;
	const { formatMessage } = useIntl();

	const communityItems = [
		{
			title: formatMessage({ id: 'label.giver_nfts' }),
			label: formatMessage({ id: 'label.collection_of' }),
			href: Routes.NFT,
		},
		{
			title: formatMessage({ id: 'label.join_and_keep_in_touch' }),
			label: formatMessage({ id: 'label.community_of_makers' }),
			href: Routes.Join,
		},
	];

	const projectsItems = {
		explore: [
			// { name: 'Trending', query: '?q=?q=trending' },
			{
				name: 'All Projects',
				url: Routes.Projects,
				label: 'label.all_projects',
			},
			{
				name: 'Recently Updated',
				url:
					Routes.Projects +
					'?sort=' +
					EProjectsSortBy.RECENTLY_UPDATED,
				label: 'label.recently_updated',
			},
			{
				name: 'Just Launched',
				url: Routes.Projects + '?sort=' + EProjectsSortBy.NEWEST,
				label: 'label.just_launched',
			},
			{
				name: 'Quadratic Funding',
				url: Routes.QFProjects,
				label: 'label.eligible_for_matching',
			},
			// { name: 'Popular', query: '?q=popular' },
		],
	};

	const giveconomyItems = [
		{
			title: formatMessage({ id: 'label.an_economy_of_giving' }),
			label: 'Giveconomy',
			href: Routes.GIVeconomy,
		},
		{
			title: formatMessage({ id: 'label.governance' }),
			label: 'GIVgarden',
			href: Routes.GIVgarden,
		},
		{
			title: formatMessage({ id: 'label.earn_with_liquidity' }),
			label: 'GIVfarm',
			href: Routes.GIVfarm,
		},
		{
			title: formatMessage({ id: 'label.donor_rewards' }),
			label: 'GIVbacks',
			href: Routes.GIVbacks,
		},
		{
			title: formatMessage({ id: 'label.curate_projects' }),
			label: 'GIVpower',
			href: Routes.GIVpower,
		},
		{
			title: formatMessage({ id: 'label.streamed_rewards' }),
			label: 'GIVstream',
			href: Routes.GIVstream,
		},
	];

	const communityRoutes: string[] = communityItems.map(item => item.href);
	const projectsRoutes: string[] = projectsItems.explore.map(
		item => item.url,
	);

	const giveconomyRoutes: string[] = giveconomyItems.map(item => item.href); // Adjust based on the structure of giveconomyItems

	const determineSection = (path: string): Section => {
		if (communityRoutes.some(route => path.startsWith(route))) {
			return 'Community';
		} else if (
			projectsRoutes.some(route => path.startsWith(route)) ||
			path.startsWith('/projects/')
		) {
			// Handle dynamic route
			return 'Projects';
		} else if (giveconomyRoutes.some(route => path.startsWith(route))) {
			return 'GIVEconomy';
		}
		return 'Home'; // default
	};
	const currentLabel: Section = determineSection(currentPath);

	return {
		determineSection,
		communityRoutes,
		projectsRoutes,
		giveconomyRoutes,
		currentLabel,
		giveconomyItems,
		communityItems,
		projectsItems,
	};
};

import { useRouter } from 'next/router';
import { projectsItems } from '@/components/menu/ProjectsItems';
import { giveconomyItems } from '@/components/menu/GIVeconomyItems';
import { communityItems } from '@/components/menu/CommunityItems';

type Section = 'Community' | 'Donate' | 'GIVeconomy' | 'Home';

export const useNavigationInfo = () => {
	const router = useRouter();
	const currentPath = router.pathname;

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
			path.startsWith('/projects/') ||
			path.startsWith('/causes/') ||
			path.startsWith('/qf/')
		) {
			// Handle dynamic route
			return 'Donate';
		} else if (giveconomyRoutes.some(route => path.startsWith(route))) {
			return 'GIVeconomy';
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
	};
};

import HomeHeader from './HomeHeader';
import HomeExploreProjects from './HomeExploreProjects';
import HomePurpleSection from './HomePurpleSection';
import HomeFromBlog from './HomeFromBlog';
import HomeGetUpdates from './HomeGetUpdates';
import HomeChangeMakers from './HomeChangeMakers';
import { IProject } from '@/apollo/types/types';
import { BigArc } from '@/components/styled-components/Arc';

interface IHomeView {
	projects: IProject[];
	totalCount: number;
}

const projectsSlice = 6;

const HomeIndex = (props: IHomeView) => {
	const { projects, totalCount } = props;
	return (
		<>
			<BigArc />
			<HomeHeader />
			<HomeExploreProjects
				totalCount={totalCount}
				projects={projects.slice(0, projectsSlice)}
			/>
			<HomePurpleSection />
			<HomeExploreProjects
				projects={projects.slice(projectsSlice)}
				noTitle
			/>
			<HomeChangeMakers />
			<HomeFromBlog />
			<HomeGetUpdates />
		</>
	);
};

export default HomeIndex;

import { FC } from 'react';
import HomeFromBlog from './HomeFromBlog';
import HomeGetUpdates from './HomeGetUpdates';
import { IProject } from '@/apollo/types/types';
import IntroBlock from './introBlock';
import WhyGivethIndex from '@/components/views/homepage/whyGiveth';

interface IHomeView {
	projects: IProject[];
	totalCount: number;
}

const HomeIndex: FC<IHomeView> = props => {
	return (
		<>
			<IntroBlock />
			<WhyGivethIndex />
			<HomeFromBlog />
			<HomeGetUpdates />
		</>
	);
};

export default HomeIndex;

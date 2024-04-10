import { H6, IconBulbOutline32, Flex } from '@giveth/ui-design-system';
import DefaultTip from './DefaultTip';
import TitleTip from './TitleTip';
import DescriptionTip from './DescriptionTip';
import BannerImageTip from './BannerImageTip';
import CategoryTip from './CategoryTip';
import MapTip from './MapTip';
import AddressesTip from './AddressesTip';
import { ECreateProjectSections } from '../../types';
import { Card } from '../common.sc';
import SocialMediaTip from './SocialMediaTip';

export interface IProjectTipProps {
	activeSection: ECreateProjectSections;
}

const contentMap = {
	[ECreateProjectSections.default]: {
		title: 'Tips to Make a Great Project',
		component: <DefaultTip />,
	},

	[ECreateProjectSections.name]: {
		title: 'A Captivating Title',
		component: <TitleTip />,
	},

	[ECreateProjectSections.description]: {
		title: 'Describing your Project',
		component: <DescriptionTip />,
	},

	[ECreateProjectSections.socialMedia]: {
		title: 'Social Media Links',
		component: <SocialMediaTip />,
	},

	[ECreateProjectSections.categories]: {
		title: 'Choose the Right Category',
		component: <CategoryTip />,
	},

	[ECreateProjectSections.location]: {
		title: 'Put your Project on the Map',
		component: <MapTip />,
	},

	[ECreateProjectSections.image]: {
		title: 'Adding a Banner Image',
		component: <BannerImageTip />,
	},

	[ECreateProjectSections.addresses]: {
		title: 'Receiving Funding',
		component: <AddressesTip />,
	},
};

const ProjectTip = ({ activeSection }: IProjectTipProps) => {
	return (
		<Card>
			<Flex gap='16px'>
				<IconBulbOutline32 />
				<H6 weight={700}>{contentMap[activeSection].title}</H6>
			</Flex>
			{contentMap[activeSection].component}
		</Card>
	);
};

export default ProjectTip;

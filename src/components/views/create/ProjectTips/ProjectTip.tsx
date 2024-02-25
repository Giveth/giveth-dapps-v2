import styled from 'styled-components';
import { H6, IconBulbOutline24, neutralColors } from '@giveth/ui-design-system';
import { Flex } from '@giveth/ui-design-system';
import DefaultTip from './DefaultTip';
import TitleTip from './TitleTip';
import DescriptionTip from './DescriptionTip';
import BannerImageTip from './BannerImageTip';
import CategoryTip from './CategoryTip';
import MapTip from './MapTip';
import AddressesTip from './AddressesTip';
import { ECreateProjectSections } from '../types';

interface IProjectTipProps {
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
		<Container>
			<Flex gap='16px'>
				<IconBulbOutline24 />
				<H6>{contentMap[activeSection].title}</H6>
			</Flex>
			<br />
			{contentMap[activeSection].component}
		</Container>
	);
};

const Container = styled.div`
	position: sticky;
	top: 100px;
	width: 400px;
	padding: 24px;
	margin-top: 80px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
`;

export default ProjectTip;

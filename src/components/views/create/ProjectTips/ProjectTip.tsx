import styled from 'styled-components';
import { H6, IconBulbOutline24, neutralColors } from '@giveth/ui-design-system';
import { ECreateProjectSections } from '../CreateProject';
import { Flex } from '@/components/styled-components/Flex';
import DefaultTip from './DefaultTip';
import TitleTip from './TitleTip';
import DescriptionTip from './DescriptionTip';
import BannerImageTip from './BannerImageTip';
import CategoryTip from './CategoryTip';
import MapTip from './MapTip';
import AddressesTip from './AddressesTip';

interface IProjectTipProps {
	activeSection: ECreateProjectSections;
}

const ProjectTip = ({ activeSection }: IProjectTipProps) => {
	const renderContent = () => {
		switch (activeSection) {
			case ECreateProjectSections.default: {
				return {
					title: 'Tips to Make a Great Project',
					component: <DefaultTip />,
				};
			}
			case ECreateProjectSections.name: {
				return {
					title: 'A Captivating Title',
					component: <TitleTip />,
				};
			}
			case ECreateProjectSections.description: {
				return {
					title: 'Describing your Project',
					component: <DescriptionTip />,
				};
			}
			case ECreateProjectSections.categories: {
				return {
					title: 'Choose the Right Category',
					component: <CategoryTip />,
				};
			}
			case ECreateProjectSections.location: {
				return {
					title: 'Put your Project on the Map',
					component: <MapTip />,
				};
			}
			case ECreateProjectSections.image: {
				return {
					title: 'Adding a Banner Image',
					component: <BannerImageTip />,
				};
			}
			case ECreateProjectSections.addresses: {
				return {
					title: 'Receiving Funding',
					component: <AddressesTip />,
				};
			}
		}
	};
	return (
		<Container>
			<Flex gap='16px'>
				<IconBulbOutline24 />
				<H6>{renderContent()?.title}</H6>
			</Flex>
			<br />
			{renderContent()?.component}
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

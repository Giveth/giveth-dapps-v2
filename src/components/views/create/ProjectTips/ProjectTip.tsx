import styled from 'styled-components';
import {
	H6,
	IconBulbOutline24,
	P,
	neutralColors,
} from '@giveth/ui-design-system';
import { ECreateProjectSections } from '../CreateProject';
import { Flex } from '@/components/styled-components/Flex';
import { TipListItem } from './common.styles';

interface IProjectTipProps {
	activeSection: ECreateProjectSections;
}

const ProjectTip = ({ activeSection }: IProjectTipProps) => {
	const renderContent = () => {
		switch (activeSection) {
			case ECreateProjectSections.default: {
				return {
					title: 'Tips to Make a Great Project',
				};
			}
			case ECreateProjectSections.name: {
				return {
					title: 'A Captivating Title',
				};
			}
			case ECreateProjectSections.description: {
				return {
					title: 'Describing your Project',
				};
			}
			case ECreateProjectSections.categories: {
				return {
					title: 'Choose the Right Category',
				};
			}
			case ECreateProjectSections.location: {
				return {
					title: 'Put your Project on the Map',
				};
			}
			case ECreateProjectSections.image: {
				return {
					title: 'Adding a Banner Image',
				};
			}
			case ECreateProjectSections.addresses: {
				return {
					title: 'Receiving Funding',
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

			<TipListItem>
				<P>
					Hello HelloHello HelloHelloHelloHello Hello
					HelloHelloHelloHelloHelloHello Hello HelloHelloHello Hello
				</P>
			</TipListItem>
			<TipListItem>Hello</TipListItem>
			<TipListItem>Hello</TipListItem>
		</Container>
	);
};

const Container = styled.div`
	width: 400px;
	padding: 24px;
	margin-top: 80px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
`;

export default ProjectTip;

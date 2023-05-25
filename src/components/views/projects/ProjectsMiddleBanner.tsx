import {
	brandColors,
	H3,
	Lead,
	semanticColors,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { Arc } from '@/components/styled-components/Arc';

export const ProjectsMiddleBanner = () => {
	const { formatMessage } = useIntl();
	return (
		<Container flexDirection='column' gap='23px'>
			<BigArc color={brandColors.giv[100]} />
			<Title weight={700} color={brandColors.giv[500]}>
				{formatMessage({
					id: 'page.projects.middle.donate_directly',
				})}
			</Title>
			<Caption>
				{formatMessage({
					id: 'page.home.bigscreen.get_rewarded',
				})}
			</Caption>
		</Container>
	);
};

export const QFProjectsMiddleBanner = () => {
	const { formatMessage } = useIntl();
	return (
		<Container flexDirection='column' gap='23px'>
			<BigArc color={semanticColors.jade[200]} />
			<Title weight={700} color={semanticColors.jade[700]}>
				{formatMessage({
					id: 'component.qf_middle_banner.title',
				})}
			</Title>
			<Caption>
				{formatMessage({
					id: 'component.qf_middle_banner.desc',
				})}
			</Caption>
		</Container>
	);
};

const Container = styled(Flex)`
	position: relative;
	background-color: white;
	margin: 20px 0px;
	/* padding: 95px 190px; */
	padding: 7% 10%;
	overflow: hidden;
	z-index: 1;
`;

interface IColor {
	color: string;
}

const Title = styled(H3)<IColor>`
	color: ${props => props.color};
	z-index: 1;
`;

const BigArc = styled(Arc)<IColor>`
	border-width: 180px;
	border-color: ${props => props.color};
	opacity: 40%;
	top: -550%;
	left: -190%;
	width: 3600px;
	height: 3600px;
	z-index: 0;
`;

const Caption = styled(Lead)`
	z-index: 1;
`;

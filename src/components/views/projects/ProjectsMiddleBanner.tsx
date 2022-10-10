import { brandColors, H3, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { Arc } from '@/components/styled-components/Arc';

const ProjectsMiddleBanner = () => {
	return (
		<Container flexDirection='column' gap='23px'>
			<BigArc />
			<Title weight={700}>Donate Crypto Directly</Title>
			<Caption>
				Get rewarded for giving to public goods projects with zero added
				fees.
			</Caption>
		</Container>
	);
};

export default ProjectsMiddleBanner;

const Container = styled(Flex)`
	position: relative;
	background-color: white;
	margin: 20px 0px;
	/* padding: 95px 190px; */
	padding: 7% 10%;
	overflow: hidden;
	z-index: 1;
`;

const Title = styled(H3)`
	color: ${brandColors.giv[500]};
	z-index: 1;
`;

const BigArc = styled(Arc)`
	border-width: 180px;
	border-color: ${brandColors.giv[100]};
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

import { B, P, brandColors, neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { Flex } from '../styled-components/Flex';

interface IAttributeItem {
	heading: string;
	subtitle: string;
}

const AttributeItem = ({ heading, subtitle }: IAttributeItem) => {
	const isOnboardingPage = window.location.pathname.includes('onboard');

	return (
		<Container
			isOnboard={isOnboardingPage}
			flexDirection='column'
			gap='8px'
		>
			<Heading>{heading}</Heading>
			<Subtitle>{subtitle}</Subtitle>
		</Container>
	);
};

export default AttributeItem;

const Container = styled(Flex)<{ isOnboard: boolean }>`
	width: 240px;
	background-color: ${props =>
		props.isOnboard ? neutralColors.gray[100] : neutralColors.gray[200]};
	border-radius: 8px;
	padding: 8px 16px;
	box-shadow: 0px 10px 15px -12px rgba(0, 0, 0, 0.1);
`;

const Heading = styled(P)`
	color: ${neutralColors.gray[800]};
`;

const Subtitle = styled(B)`
	color: ${brandColors.deep[800]};
`;

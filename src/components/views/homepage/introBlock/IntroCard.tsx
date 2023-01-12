import { H5, neutralColors, P } from '@giveth/ui-design-system';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

interface IntroCardProps {
	Icon: ReactElement;
	LinkComponent: ReactElement;
	title: string;
	description: string;
}

const IntroCard = ({
	Icon,
	LinkComponent,
	title,
	description,
}: IntroCardProps) => {
	return (
		<IntroCardContainer>
			<Flex flexDirection='column' gap='16px'>
				<Flex gap='16px'>
					{Icon}
					<H5 weight={700}>{title}</H5>
				</Flex>
				<P>{description}</P>
				{LinkComponent}
			</Flex>
		</IntroCardContainer>
	);
};

const IntroCardContainer = styled.div`
	border: 1px solid ${neutralColors.gray[300]};
	padding: 16px 40px;
	border-radius: 16px;
	max-width: 360px;
`;

export default IntroCard;

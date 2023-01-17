import { H5, neutralColors, P } from '@giveth/ui-design-system';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import useDetectDevice from '@/hooks/useDetectDevice';
import { mediaQueries } from '@/lib/constants/constants';

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
	const { isDesktop } = useDetectDevice();
	return (
		<IntroCardContainer flexDirection='column' gap='16px'>
			<Flex
				gap='16px'
				flexDirection={isDesktop ? 'row' : 'column'}
				alignItems='center'
			>
				{Icon}
				<H5 weight={700}>{title}</H5>
			</Flex>
			<P>{description}</P>
			{LinkComponent}
		</IntroCardContainer>
	);
};

const IntroCardContainer = styled(Flex)`
	border: 1px solid ${neutralColors.gray[300]};
	padding: 16px;
	border-radius: 16px;
	max-width: 360px;
	flex: 1;
	justify-content: space-between;
	z-index: 1;
	background-color: ${neutralColors.gray[100]};
	${mediaQueries.desktop} {
		padding: 16px 40px;
	}
`;

export default IntroCard;

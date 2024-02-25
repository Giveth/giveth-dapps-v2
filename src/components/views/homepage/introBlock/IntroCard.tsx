import {
	Button,
	H5,
	IconChevronRight24,
	neutralColors,
	P,
} from '@giveth/ui-design-system';
import React, { ReactElement } from 'react';
import styled from 'styled-components';
import { Flex } from '@giveth/ui-design-system';
import { mediaQueries } from '@/lib/constants/constants';
import ExternalLink from '@/components/ExternalLink';

interface IntroCardProps {
	Icon: ReactElement;
	buttonLink: string;
	buttonText: string;
	title: string;
	description: string;
}

const IntroCard = ({
	Icon,
	buttonLink,
	buttonText,
	title,
	description,
}: IntroCardProps) => {
	return (
		<IntroCardContainer $flexDirection='column' gap='16px'>
			<IconAndTitleContainer gap='16px' $alignItems='center'>
				{Icon}
				<H5 weight={700}>{title}</H5>
			</IconAndTitleContainer>
			<P>{description}</P>
			<ExternalLink href={buttonLink}>
				<Button
					buttonType='texty-secondary'
					label={buttonText}
					icon={<IconChevronRight24 />}
				/>
			</ExternalLink>
		</IntroCardContainer>
	);
};

const IconAndTitleContainer = styled(Flex)`
	flex-direction: column;
	${mediaQueries.desktop} {
		flex-direction: row;
	}
`;

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
	color: ${neutralColors.gray[800]};
`;

export default IntroCard;

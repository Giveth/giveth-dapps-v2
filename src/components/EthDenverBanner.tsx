import {
	brandColors,
	ButtonLink,
	H3,
	IconChevronRight16,
	Lead,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Container } from './Grid';
import { Flex } from './styled-components/Flex';
import { Relative } from './styled-components/Position';

export const EthDenverBanner = () => {
	return (
		<Wrapper>
			<Container>
				<Content flexDirection='column' gap='24px'>
					<H3 weight={700}>We are going to ETHDenver!</H3>
					<Lead size='large'>
						The Giveth team will be at ETHDenver this year, and we
						couldn’t be more excited for what we have in store.
					</Lead>
					<Link href='/links/ethdenver'>
						<LearnMoreLink
							label='Learn more'
							linkType='primary'
							size='small'
							icon={<IconChevronRight16 />}
						/>
					</Link>
				</Content>
			</Container>
			<ImageWrapper>
				<Image
					src='/images/denver.png'
					alt='denver'
					width={212}
					height={268}
				/>
			</ImageWrapper>
		</Wrapper>
	);
};

const Wrapper = styled(Relative)`
	padding-top: 160px;
	padding-bottom: 40px;
	background-color: ${brandColors.giv[700]};
	color: ${neutralColors.gray[100]};
	${mediaQueries.tablet} {
		padding-top: 40px;
	}
`;

const Content = styled(Flex)`
	padding-right: 80px;
	${mediaQueries.tablet} {
		padding-right: 160px;
	}
`;

const LearnMoreLink = styled(ButtonLink)`
	max-width: 230px;
`;

const ImageWrapper = styled.div`
	position: absolute;
	right: 0;
	top: 0;
	${mediaQueries.tablet} {
		top: unset;
		bottom: 0;
	}
`;

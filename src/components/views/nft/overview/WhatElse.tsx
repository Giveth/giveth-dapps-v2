import { brandColors, Container, H3, Lead } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Flex } from '@/components/styled-components/Flex';
import { OvalHorizontalGradient, OvalVerticalGradient } from '../common.styles';
import { mediaQueries } from '@/lib/constants/constants';

const WhatElse = () => {
	return (
		<WhatElseContainer>
			<Container>
				<ContentContainer>
					<CustomFlex gap='64px'>
						<Flex flexDirection='column' gap='16px'>
							<HeaderTitle>Get on the "$nice list".</HeaderTitle>
							<Lead>
								Anyone who donates 100 or more DAI, USDC or xDAI
								to the Giveth Project is on our $nice list and
								eligible for early minting of a Giver. Eligible
								donations will also earn additional rewards
								through the $nice token program.{' '}
								<DocLink href='https://docs.giveth.io/giveconomy/niceToken'>
									Learn more about $nice.
								</DocLink>
							</Lead>
						</Flex>
						<Flex flexDirection='column' gap='16px'>
							<HeaderTitle>Unlock special benefits.</HeaderTitle>
							<Lead>
								If you hold a Giver, your profile will be
								emphasized wherever you make an impact on
								Giveth. You’ll also receive a discount to
								register a custom <code>.giveth</code> Punk
								Domain name (e.g. <code>vitalik.giveth</code>).{' '}
								<DocLink href='https://docs.giveth.io/dapps/giverspfp/#benefits'>
									Learn more about the benefits.
								</DocLink>
							</Lead>
						</Flex>
					</CustomFlex>
				</ContentContainer>
			</Container>
			<OvalHorizontalGradient />
			<OvalVerticalGradient />
		</WhatElseContainer>
	);
};

const WhatElseContainer = styled.div`
	padding-top: 100px;
	position: relative;
	::before {
		content: ' ';
		position: absolute;
		background-image: url('/images/GIV_homepage.svg');
		width: 100%;
		height: 100%;
		max-height: 400px;
		z-index: 1;
		opacity: 0.15;
		overflow: hidden;
	}
`;

const DocLink = styled(Link)`
	color: ${brandColors.giv[300]};
	font-weight: 500;
	&:hover {
		color: ${brandColors.giv[200]};
	}
`;

const ContentContainer = styled.div`
	position: relative;
	z-index: 1;
`;

const CustomFlex = styled(Flex)`
	flex-direction: column;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const HeaderTitle = styled(H3)`
	color: ${brandColors.giv[200]};
`;

export default WhatElse;

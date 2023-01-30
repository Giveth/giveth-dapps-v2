import { brandColors, Container, H1, H3, Lead } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';
import { OvalHorizontalGradient, OvalVerticalGradient } from '../common.styles';

const WhatElse = () => {
	return (
		<WhatElseContainer>
			<Container>
				<ContentContainer>
					<H1>What else?</H1>
					<Flex gap='64px'>
						<Flex flexDirection='column' gap='16px'>
							<HeaderTitle>
								Get on the ‘$nice list’ for early access to
								minting.
							</HeaderTitle>
							<Lead>
								Anyone who has donated 100 or more DAI, USDC or
								xDAI to the Giveth Project is eligible for early
								minting of a Givers PFP. Eligible donations will
								also earn additional rewards through the $nice
								token program. Learn more about $nice.
							</Lead>
						</Flex>
						<Flex flexDirection='column' gap='16px'>
							<HeaderTitle>
								Owning a Giver unlocks special benefits.
							</HeaderTitle>
							<Lead>
								By holding a Giver in your wallet you will show
								up differently on the Giveth dApp; wherever you
								make an impact, people will notice your style.
								You’ll also receive a discount when you register
								your custom ‘.giveth’ Punk Domain name. Learn
								more about the benefits.
							</Lead>
						</Flex>
					</Flex>
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
`;

const ContentContainer = styled.div`
	position: relative;
	z-index: 1;
`;

const HeaderTitle = styled(H3)`
	color: ${brandColors.giv[200]};
`;

export default WhatElse;

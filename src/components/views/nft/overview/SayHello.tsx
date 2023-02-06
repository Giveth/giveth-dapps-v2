import React from 'react';
import styled from 'styled-components';
import { ButtonLink, Container, H1, QuoteText } from '@giveth/ui-design-system';
import Link from 'next/link';
import { Flex } from '@/components/styled-components/Flex';
import { OvalHorizontalGradient, OvalVerticalGradient } from '../common.styles';
import Routes from '@/lib/constants/Routes';

const SayHelloSection = () => {
	return (
		<OverviewContainer>
			<Container>
				<FlexContainer>
					<Flex flexDirection='column' gap='24px'>
						<H1>
							Say Hello to... <br /> The Givers{' '}
						</H1>
						<QuoteText>
							Show your support for the Future of Giving and
							unlock your unique Giveth flair by minting one of
							the first NFT PFP artworks inspired by Giveth.
						</QuoteText>
						<CustomLink href={Routes.NFTMint} passHref>
							<MintNowButton
								label='Mint Now'
								linkType='primary'
							/>
						</CustomLink>
					</Flex>
					<TestImage />
				</FlexContainer>
			</Container>
			<OvalVerticalGradient />
			<OvalHorizontalGradient />
		</OverviewContainer>
	);
};

const OverviewContainer = styled.div`
	padding-top: 200px;
	position: relative;
`;

const FlexContainer = styled(Flex)`
	position: relative;
	z-index: 1;
`;

const TestImage = styled.div`
	min-width: 500px;
	min-height: 500px;
	background-color: red;
`;

const MintNowButton = styled(ButtonLink)`
	width: 150px;
`;

const CustomLink = styled(Link)`
	width: fit-content;
`;

export default SayHelloSection;

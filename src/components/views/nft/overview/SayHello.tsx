import React from 'react';
import styled from 'styled-components';
import {
	brandColors,
	ButtonLink,
	Container,
	D3,
	QuoteText,
} from '@giveth/ui-design-system';
import Link from 'next/link';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { OvalHorizontalGradient, OvalVerticalGradient } from '../common.styles';
import Routes from '@/lib/constants/Routes';
import { mediaQueries } from '@/lib/constants/constants';

const SayHelloSection = () => {
	const { formatMessage } = useIntl();
	return (
		<OverviewContainer>
			<Container>
				<FlexContainer>
					<TextsContainer flexDirection='column' gap='24px'>
						<ColoredD3>
							{formatMessage({ id: 'label.say_hello_to' })}
						</ColoredD3>
						<D3>The Givers </D3>
						<QuoteText>
							{formatMessage({ id: 'label.show_your_support' })}
						</QuoteText>

						<CustomLink href={Routes.NFTMint} passHref>
							<MintNowButton
								label='Mint Now'
								linkType='primary'
							/>
						</CustomLink>
						{/* <CustomLink
							href='https://medium.com/giveth/the-givers-nfts-for-the-giveth-community-fa335ef9db01'
							passHref
							target='_blank'
						>
							<MintNowButton
								label='Learn More'
								linkType='primary'
							/>
						</CustomLink> */}
					</TextsContainer>
					<CustomImage
						src={'/images/nft/pfp-o-5.png'}
						width={450}
						height={450}
						alt='pfp-image'
					/>
				</FlexContainer>
			</Container>
			<OvalVerticalGradient />
			<OvalHorizontalGradient />
		</OverviewContainer>
	);
};

const OverviewContainer = styled.div`
	padding-top: 100px;
	position: relative;
	::before {
		content: ' ';
		position: absolute;
		background-image: url('/images/GIV_homepage.svg');
		width: 100%;
		height: 100%;
		max-height: 450px;
		z-index: 1;
		opacity: 0.15;
		overflow: hidden;
	}
`;

const FlexContainer = styled(Flex)`
	position: relative;
	z-index: 1;
	justify-content: space-between;
`;

const TextsContainer = styled(Flex)`
	max-width: 580px;
`;

const MintNowButton = styled(ButtonLink)`
	width: 150px;
`;

const CustomLink = styled(Link)`
	width: fit-content;
`;

const CustomImage = styled(Image)`
	display: none;
	${mediaQueries.laptopS} {
		display: inline-block;
	}
`;

const ColoredD3 = styled(D3)`
	color: ${brandColors.deep[100]};
`;

export default SayHelloSection;

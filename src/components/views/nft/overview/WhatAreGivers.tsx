import { Container, QuoteText } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { Flex } from '@/components/styled-components/Flex';
import { OvalVerticalGradient } from '../common.styles';
import { mediaQueries } from '@/lib/constants/constants';

const DesktopImages = () => {
	return (
		<DesktopImagesContainer>
			<Image
				src={'/images/nft/pfp-o-4.png'}
				width={400}
				height={400}
				alt='pfp-image'
			/>
			<Image
				src={'/images/nft/pfp-o-5.png'}
				width={450}
				height={450}
				alt='pfp-image'
			/>
			<Image
				src={'/images/nft/pfp-o-1.png'}
				width={500}
				height={500}
				alt='pfp-image'
				style={{
					zIndex: 2,
				}}
			/>
			<Image
				src={'/images/nft/pfp-o-2.png'}
				width={450}
				height={450}
				alt='pfp-image'
				style={{
					zIndex: 1,
				}}
			/>
			<Image
				src={'/images/nft/pfp-o-3.png'}
				width={400}
				height={400}
				alt='pfp-image'
				style={{
					zIndex: 0,
				}}
			/>
		</DesktopImagesContainer>
	);
};

const MobileImages = () => {
	return (
		<MobileImagesContainer flexDirection='column'>
			<Image
				src={'/images/nft/pfp-o-1.png'}
				width={300}
				height={300}
				alt='pfp-image'
			/>
			<Image
				src={'/images/nft/pfp-o-3.png'}
				width={300}
				height={300}
				alt='pfp-image'
			/>
			<Image
				src={'/images/nft/pfp-o-5.png'}
				width={300}
				height={300}
				alt='pfp-image'
			/>
		</MobileImagesContainer>
	);
};

const WhatAreGivers = () => {
	const { formatMessage } = useIntl();

	return (
		<SectionContainer
			justifyContent='center'
			alignItems='center'
			flexDirection='column'
			gap='24px'
		>
			<Container>
				<TextContainer>
					<QuoteContainer>
						<QuoteText size='small'>
							{formatMessage({ id: 'label.the_givers_are' })}
						</QuoteText>
					</QuoteContainer>
				</TextContainer>
			</Container>
			<DesktopImages />
			<MobileImages />
			<OvalVerticalGradient />
		</SectionContainer>
	);
};

const QuoteContainer = styled.div`
	max-width: 925px;
	text-align: center;
	z-index: 1;
	margin: auto;
`;

const DesktopImagesContainer = styled.div`
	position: relative;
	display: none;
	width: 100%;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	z-index: 1;
	> img {
		margin: 0 -50px;
	}
	${mediaQueries.tablet} {
		display: flex;
	}
`;

const MobileImagesContainer = styled(Flex)`
	z-index: 1;
	margin-top: 80px;
	display: flex;
	${mediaQueries.tablet} {
		display: none;
	}
`;

const SectionContainer = styled(Flex)`
	position: relative;
	margin-top: 32px;
`;

const TextContainer = styled.div`
	position: relative;
	text-align: center;
	z-index: 1;
`;

export default WhatAreGivers;

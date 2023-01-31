import { H2, QuoteText } from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';
import { Flex } from '@/components/styled-components/Flex';

const WhatAreGivers = () => {
	return (
		<Flex
			justifyContent='center'
			alignItems='center'
			flexDirection='column'
			gap='24px'
		>
			<H2>What are the Givers</H2>
			<QuoteContainer>
				<QuoteText size='small'>
					The Givers are a limited collection of 1,250 artworks
					inspired by the Giveth Galaxy. Each NFT tells a unique story
					of Giveth, in its own fun and vibrant style.
				</QuoteText>
			</QuoteContainer>
			<ImagesContainer>
				<Image
					src={'/images/nft/pfp-o-1.png'}
					width={400}
					height={400}
					alt='pfp-image'
				/>
				<Image
					src={'/images/nft/pfp-o-1.png'}
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
					src={'/images/nft/pfp-o-1.png'}
					width={450}
					height={450}
					alt='pfp-image'
					style={{
						zIndex: 1,
					}}
				/>
				<Image
					src={'/images/nft/pfp-o-1.png'}
					width={400}
					height={400}
					alt='pfp-image'
					style={{
						zIndex: 0,
					}}
				/>
			</ImagesContainer>
		</Flex>
	);
};

const QuoteContainer = styled.div`
	max-width: 925px;
	text-align: center;
`;

const ImagesContainer = styled.div`
	position: relative;
	display: flex;
	width: 100%;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	> img {
		margin: 0 -50px;
	}
`;

export default WhatAreGivers;

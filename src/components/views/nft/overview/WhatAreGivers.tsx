import { H2, QuoteText } from '@giveth/ui-design-system';
import styled from 'styled-components';
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
		</Flex>
	);
};

const QuoteContainer = styled.div`
	max-width: 925px;
	text-align: center;
`;

export default WhatAreGivers;

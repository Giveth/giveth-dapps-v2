import { H1, brandColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

export const NoDonation = () => {
	return (
		<Wrapper>
			<H1>Be the</H1>
			<H1 weight={700}>First</H1>
			<H1>to</H1>
			<H1 weight={700}>Donate</H1>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 60px;
	background-image: url('/images/backgrounds/giv-background.svg');
	color: ${brandColors.giv[500]};
	text-align: center;
`;

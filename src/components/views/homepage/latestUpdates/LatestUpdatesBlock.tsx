import React from 'react';
import styled from 'styled-components';
import { Container } from '@/components/Grid';
import { BlockTitle } from '../common';

export const LatestUpdatesBlock = () => {
	return (
		<LatestUpdatesBlockWrapper>
			<Container>
				<BlockTitle>Awesome Project Updates</BlockTitle>
			</Container>
		</LatestUpdatesBlockWrapper>
	);
};

const LatestUpdatesBlockWrapper = styled.div`
	padding: 80px 0;
`;

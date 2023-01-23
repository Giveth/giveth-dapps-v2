import React from 'react';
import styled from 'styled-components';
import { Container } from '@/components/Grid';
import { BlockTitle } from '../common';
import { LatestUpdateCard } from './LatestUpdateCard';

export const LatestUpdatesBlock = () => {
	return (
		<LatestUpdatesBlockWrapper>
			<Container>
				<BlockTitle>Awesome Project Updates</BlockTitle>
			</Container>
			<LatestUpdateCard />
		</LatestUpdatesBlockWrapper>
	);
};

const LatestUpdatesBlockWrapper = styled.div`
	padding: 80px 0;
`;

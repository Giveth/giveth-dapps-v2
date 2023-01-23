import React from 'react';
import styled from 'styled-components';
import { Container } from '@/components/Grid';
import { BlockTitle } from '../common';
import { LatestUpdateCard } from './LatestUpdateCard';
import { Flex } from '@/components/styled-components/Flex';

export const LatestUpdatesBlock = () => {
	return (
		<LatestUpdatesBlockWrapper>
			<Container>
				<BlockTitle>Awesome Project Updates</BlockTitle>
			</Container>
			<LatestUpdatesCardsWrapper>
				<LatestUpdateCard />
			</LatestUpdatesCardsWrapper>
		</LatestUpdatesBlockWrapper>
	);
};

const LatestUpdatesBlockWrapper = styled.div`
	padding: 80px 0;
`;

const LatestUpdatesCardsWrapper = styled(Flex)`
	transform: translate3d(0, 0, 0);
	animation: moveSlideshow 10s linear infinite;
	:hover {
		animation-play-state: paused;
	}
	@keyframes moveSlideshow {
		0% {
			transform: translateX(0);
		}
		50% {
			transform: translateX(-100%);
		}
		51% {
			transform: translateX(200%);
		}
		100% {
			transform: translateX(0);
		}
	}
`;

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
				{mockData.map((data, idx) => (
					<LatestUpdateCard
						key={idx}
						cover={data.cover}
						projectUpdate={data.projectUpdate}
					/>
				))}
			</LatestUpdatesCardsWrapper>
		</LatestUpdatesBlockWrapper>
	);
};

const mockData = [
	{
		projectUpdate: {
			content: '<p>1</p>',
			createdAt: '1674476883589',
			id: '1',
			projectId: '1',
			title: '1',
			userId: '1',
		},
		cover: '',
	},
	{
		projectUpdate: {
			content: '<p>2</p>',
			createdAt: '1674476883589',
			id: '2',
			projectId: '2',
			title: '2',
			userId: '2',
		},
		cover: '',
	},
	{
		projectUpdate: {
			content: '<p>3</p>',
			createdAt: '1674476883589',
			id: '3',
			projectId: '3',
			title: '3',
			userId: '3',
		},
		cover: '',
	},
	{
		projectUpdate: {
			content: '<p>4</p>',
			createdAt: '1674476883589',
			id: '4',
			projectId: '4',
			title: '4',
			userId: '4',
		},
		cover: '',
	},
	{
		projectUpdate: {
			content: '<p>5</p>',
			createdAt: '1674476883589',
			id: '5',
			projectId: '5',
			title: '5',
			userId: '5',
		},
		cover: '',
	},
];

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
		100% {
			transform: translateX(-100%);
		}
	}
`;

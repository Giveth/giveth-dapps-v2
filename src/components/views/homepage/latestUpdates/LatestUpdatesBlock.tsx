import { FC } from 'react';
import styled from 'styled-components';
import { Container } from '@/components/Grid';
import { BlockTitle } from '../common';
import { LatestUpdateCard } from './LatestUpdateCard';
import { Flex } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import { IProjectUpdateWithProject } from '@/apollo/types/types';

interface ILatestUpdatesBlockProps {
	latestUpdates: IProjectUpdateWithProject[];
}

export const LatestUpdatesBlock: FC<ILatestUpdatesBlockProps> = ({
	latestUpdates,
}) => {
	return (
		<LatestUpdatesBlockWrapper>
			<Container>
				<BlockTitle>Latest updates</BlockTitle>
			</Container>
			<LatestUpdatesCardsWrapper>
				<LatestUpdatesCardsContainer>
					{latestUpdates.map((update, idx) => (
						<LatestUpdateCard key={update.id} update={update} />
					))}
				</LatestUpdatesCardsContainer>
			</LatestUpdatesCardsWrapper>
		</LatestUpdatesBlockWrapper>
	);
};

const LatestUpdatesBlockWrapper = styled.div`
	padding: 80px 0;
`;

const LatestUpdatesCardsWrapper = styled.div`
	overflow: hidden;
	padding-top: 40px;
`;

const LatestUpdatesCardsContainer = styled(Flex)`
	transform: translate3d(0, 0, 0);
	animation: marquee 10s linear infinite;
	${mediaQueries.tablet} {
		animation-duration: 20s;
	}
	${mediaQueries.laptopL} {
		animation-duration: 30s;
	}
	:hover {
		animation-play-state: paused;
	}
	@keyframes marquee {
		0% {
			transform: translateX(100%);
		}
		100% {
			transform: translateX(-100%);
		}
	}
`;

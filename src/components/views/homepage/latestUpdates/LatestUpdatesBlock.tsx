import { FC } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Container } from '@giveth/ui-design-system';
import { BlockTitle } from '../common';
import { LatestUpdateCard } from './LatestUpdateCard';
import { Flex } from '@/components/styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';
import { IProjectUpdateWithProject } from '@/apollo/types/types';

interface ILatestUpdatesBlockProps {
	updates: IProjectUpdateWithProject[];
}

export const LatestUpdatesBlock: FC<ILatestUpdatesBlockProps> = ({
	updates,
}) => {
	const { formatMessage } = useIntl();
	return (
		<LatestUpdatesBlockWrapper>
			<Container>
				<BlockTitle>
					{formatMessage({ id: 'label.latest_updates' })}
				</BlockTitle>
			</Container>
			<LatestUpdatesCardsWrapper>
				<LatestUpdatesCardsContainer>
					{updates.map((update, idx) => (
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

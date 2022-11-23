import {
	IconArrowDown16,
	IconArrowUp16,
	H6,
	semanticColors,
	H3,
	IconRocketInSpace32,
	IconRocketInSpace16,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';
import { IProjectPower } from '@/apollo/types/types';
import { Flex } from './styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

interface IGIVpowerRank {
	projectPower?: IProjectPower;
	projectFuturePower?: IProjectPower;
}

export const NextRank: FC<IGIVpowerRank> = ({
	projectPower,
	projectFuturePower,
}) => {
	const projectedRank =
		projectFuturePower?.totalPower === 0
			? undefined
			: projectFuturePower?.powerRank;
	const goingUp =
		!projectedRank || !projectPower?.powerRank
			? 0
			: projectedRank - projectPower?.powerRank;
	return (
		<NextRankContainer state={goingUp} alignItems='baseline' gap='4px'>
			{goingUp === 0 ? (
				''
			) : goingUp > 0 ? (
				<IconArrowDown16 />
			) : (
				<IconArrowUp16 />
			)}
			{!projectedRank && <IconRocketInSpace16 />}
			<H6 weight={700}>
				{projectedRank
					? `#${projectedRank}`
					: projectPower?.totalPower === 0
					? '--'
					: `#${projectPower?.powerRank}`}
			</H6>
		</NextRankContainer>
	);
};

export const CurrentRank: FC<IGIVpowerRank> = ({ projectPower }) => {
	return (
		<RankContainer alignItems='baseline' gap='4px'>
			{projectPower?.totalPower === 0 && <IconRocketInSpace32 />}
			<H3 weight={700}>
				{projectPower?.totalPower === 0
					? '--'
					: `#${projectPower?.powerRank}`}
			</H3>
		</RankContainer>
	);
};

const RankContainer = styled(Flex)`
	${mediaQueries.tablet} {
		height: 54px;
	}
`;

const NextRankContainer = styled(RankContainer)<{ state: number }>`
	padding-top: 13px;
	color: ${props =>
		props.state > 0 ? semanticColors.punch[700] : semanticColors.jade[700]};
	${mediaQueries.tablet} {
		padding-top: 21px;
	}
`;

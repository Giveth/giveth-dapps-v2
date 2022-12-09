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
import styled, { css } from 'styled-components';
import { IProjectPower } from '@/apollo/types/types';
import { Flex } from './styled-components/Flex';
import { mediaQueries } from '@/lib/constants/constants';

interface IGIVpowerRank {
	projectPower?: IProjectPower;
	projectFuturePower?: IProjectPower;
}

//if the futureRank is null it means that it's not calculated yet,
//  but if it's total is zero, it means it's calculated and has not any boost
const calculateProjectedRank = (
	currentRank?: IProjectPower,
	futureRank?: IProjectPower,
) => {
	if (!futureRank)
		return currentRank?.totalPower === 0
			? undefined
			: currentRank?.powerRank;
	if (futureRank.totalPower === 0) return undefined;
	return futureRank.powerRank;
};

export const NextRank: FC<IGIVpowerRank> = ({
	projectPower,
	projectFuturePower,
}) => {
	const projectedRank = calculateProjectedRank(
		projectPower,
		projectFuturePower,
	);
	const goingUp =
		projectedRank && projectPower?.powerRank
			? projectedRank - projectPower?.powerRank
			: 0;

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
			<ProjectedRank weight={700} loading={true}>
				{projectedRank ? `#${projectedRank}` : '--'}
			</ProjectedRank>
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

interface ILoading {
	loading: boolean;
}

const ProjectedRank = styled(H6)<ILoading>`
	${props =>
		props.loading
			? css`
					display: inline-block;
					position: relative;
					overflow: hidden;
					background-color: #e8e8e8;
					min-width: 40px;
					&::after {
						position: absolute;
						top: 0;
						right: 0;
						bottom: 0;
						left: 0;
						transform: translateX(-100%);
						background: rgb(232, 232, 232);
						background: linear-gradient(
							90deg,
							rgba(232, 232, 232, 1) 0%,
							rgba(255, 255, 255, 1) 50%,
							rgba(232, 232, 232, 1) 100%
						);
						animation: shimmer 1s infinite;
						content: '';
					}

					@keyframes shimmer {
						100% {
							transform: translateX(100%);
						}
					}
			  `
			: undefined}
`;

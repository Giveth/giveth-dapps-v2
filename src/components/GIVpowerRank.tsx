import {
	IconArrowDown16,
	IconArrowUp16,
	H6,
	semanticColors,
	IconRocketInSpace32,
	IconRocketInSpace16,
	H4,
	H2,
} from '@giveth/ui-design-system';
import { FC } from 'react';
import styled, { css } from 'styled-components';
import { IProjectPower } from '@/apollo/types/types';
import { Flex } from './styled-components/Flex';
import { useProjectContext } from '@/context/project.context';

interface IGIVpowerRank {
	projectPower?: IProjectPower;
	className?: string;
}

interface IGIVpowerNextRank extends IGIVpowerRank {
	projectFuturePower?: IProjectPower;
}

//if the futureRank is null it means that it's not calculated yet,
//  but if it's total is zero, it means it's calculated and has not any boost
const calculateProjectedRank = (
	currentRank?: IProjectPower,
	futureRank?: IProjectPower,
	instanteRank?: number | null,
) => {
	if (instanteRank !== null) return instanteRank;
	if (!futureRank)
		return currentRank?.totalPower === 0
			? undefined
			: currentRank?.powerRank;
	if (futureRank.totalPower === 0) return undefined;
	return futureRank.powerRank;
};

export const NextRank: FC<IGIVpowerNextRank> = ({
	projectPower,
	projectFuturePower,
}) => {
	const { projectedRank: instantRank, isBoostingsLoading } =
		useProjectContext();

	const projectedRank = calculateProjectedRank(
		projectPower,
		projectFuturePower,
		instantRank,
	);
	const goingUp =
		projectedRank && projectPower?.powerRank
			? projectedRank - projectPower?.powerRank
			: 0;

	return isBoostingsLoading ? (
		<NextRankContainer state={0} isLoading={true}></NextRankContainer>
	) : (
		<NextRankContainer state={goingUp} alignItems='baseline' gap='4px'>
			{goingUp === 0 ? (
				''
			) : goingUp > 0 ? (
				<IconArrowDown16 />
			) : (
				<IconArrowUp16 />
			)}
			{!projectedRank && <IconRocketInSpace16 />}
			<H6 weight={700}>{projectedRank ? `#${projectedRank}` : '--'}</H6>
		</NextRankContainer>
	);
};

export interface ICurrentRank extends IGIVpowerRank {
	size?: 'small' | 'big';
}

export const CurrentRank: FC<ICurrentRank> = ({
	projectPower,
	size = 'big',
}) => {
	const content =
		projectPower?.totalPower === 0 ? '--' : `#${projectPower?.powerRank}`;
	return (
		<RankContainer alignItems='baseline' gap='4px'>
			{projectPower?.totalPower === 0 && <IconRocketInSpace32 />}
			{size === 'big' ? (
				<H2 weight={700}>{content}</H2>
			) : (
				<H4 weight={700}>{content}</H4>
			)}
		</RankContainer>
	);
};

const RankContainer = styled(Flex)``;
interface ILoading {
	state: number;
	isLoading?: boolean;
}

const NextRankContainer = styled(RankContainer)<ILoading>`
	color: ${props =>
		props.state > 0 ? semanticColors.punch[700] : semanticColors.jade[700]};
	${props =>
		props.isLoading
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

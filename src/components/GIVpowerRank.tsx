import {
	IconArrowDown16,
	IconArrowUp16,
	H6,
	semanticColors,
	H3,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled from 'styled-components';
import { IProjectPower } from '@/apollo/types/types';
import { Flex } from './styled-components/Flex';

interface IGIVpowerRank {
	projectPower?: IProjectPower;
	projectFuturePower?: IProjectPower;
}

export const NextRank: FC<IGIVpowerRank> = ({
	projectPower,
	projectFuturePower,
}) => {
	const goingUp =
		!projectFuturePower?.powerRank || !projectPower?.powerRank
			? 0
			: projectFuturePower.powerRank - projectPower?.powerRank;
	return (
		<NextRankContainer state={goingUp}>
			<Flex alignItems='baseline' gap='4px'>
				{goingUp === 0 ? (
					''
				) : goingUp > 0 ? (
					<IconArrowDown16 />
				) : (
					<IconArrowUp16 />
				)}
				<H6 weight={700}>#{projectFuturePower?.powerRank || '--'}</H6>
			</Flex>
		</NextRankContainer>
	);
};

export const CurrentRank: FC<IGIVpowerRank> = ({ projectPower }) => {
	return (
		<RankContainer>
			<H3 weight={700}>
				#
				{projectPower?.totalPower === 0
					? '--'
					: projectPower?.powerRank}
			</H3>
		</RankContainer>
	);
};

const RankContainer = styled.div`
	height: 54px;
`;

const NextRankContainer = styled(RankContainer)<{ state: number }>`
	padding-top: 21px;
	color: ${props =>
		props.state > 0 ? semanticColors.punch[700] : semanticColors.jade[700]};
`;

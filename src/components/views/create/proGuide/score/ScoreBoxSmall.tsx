import { type FC } from 'react';
import styled from 'styled-components';
import {
	Flex,
	H5,
	H6,
	mediaQueries,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';

interface IScoreBoxProps {
	score: number;
	color: string;
}

export const ScoreBoxSmall: FC<IScoreBoxProps> = ({ score, color }) => {
	return (
		<Wrapper>
			<Flex
				$justifyContent={score === 100 ? 'center' : 'space-between'}
				$alignItems='flex-end'
			>
				<Score weight={700} color={color}>
					{score}
				</Score>
				{score !== 100 && <Hundred weight={700}>100</Hundred>}
			</Flex>
			<Bar $color={color} $score={score} />
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 8px;
	width: 100%;
	${mediaQueries.tablet} {
		width: 255px;
	}
`;

const Score = styled(H5)<{ color: string }>`
	color: ${props => props.color};
`;

const Hundred = styled(H6)`
	color: ${semanticColors.jade[500]};
`;

const Bar = styled.div<{ $score: number; $color: string }>`
	background: ${semanticColors.jade[500]};
	background-image: ${props =>
		`linear-gradient(to right, ${props.$color} ${props.$score}%, ${neutralColors.gray[200]} ${props.$score}%)`};
	height: 4px;
	width: 100%;
	border-radius: 4px;
`;

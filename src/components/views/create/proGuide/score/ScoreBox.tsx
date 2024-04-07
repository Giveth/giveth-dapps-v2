import { type FC } from 'react';
import styled from 'styled-components';
import {
	Flex,
	H1,
	H5,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';

interface IScoreBoxProps {
	score: number;
	color: string;
}

export const ScoreBox: FC<IScoreBoxProps> = ({ score, color }) => {
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
	gap: 24px;
`;

const Score = styled(H1)<{ color: string }>`
	color: ${props => props.color};
`;

const Hundred = styled(H5)`
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

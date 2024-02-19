import React, { useState } from 'react';
import styled from 'styled-components';
import { neutralColors, semanticColors } from '@giveth/ui-design-system';
import { Flex } from '@/components/styled-components/Flex';

function scoreColor(score: number) {
	if (score < 50) {
		return semanticColors.punch[500];
	} else if (score < 80) {
		return semanticColors.golden[500];
	} else {
		return semanticColors.jade[500];
	}
}

export const ScoreBox = () => {
	const [score, setScore] = useState(55);
	const color = scoreColor(score);
	return (
		<Wrapper>
			<Flex justifyContent='space-between' alignItems='flex-end'>
				<Score color={color}>{score}</Score>
				<Hundred>100</Hundred>
			</Flex>
			<Bar color={color} score={score} />
		</Wrapper>
	);
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	gap: 16px;
`;

const BaseNumber = styled.div`
	font-family: 'TeX Gyre Adventor';
	font-style: normal;
	font-weight: 700;
`;

const Score = styled(BaseNumber)<{ color: string }>`
	font-size: 66px;
	line-height: 66px;
	color: ${props => props.color};
`;

const Hundred = styled(BaseNumber)`
	font-size: 25px;
	line-height: 25px;
	color: ${semanticColors.jade[500]};
`;

const Bar = styled.div<{ score: number; color: string }>`
	background: ${semanticColors.jade[500]};
	background-image: ${props =>
		`linear-gradient(to right, ${props.color} ${props.score}%, ${neutralColors.gray[200]} ${props.score}%)`};
	height: 8px;
	width: 100%;
	border-radius: 8px;
`;

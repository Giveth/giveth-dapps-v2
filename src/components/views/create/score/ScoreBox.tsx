import React, { useState } from 'react';
import styled from 'styled-components';
import { semanticColors } from '@giveth/ui-design-system';
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
	const [score, setScore] = useState(0);
	return (
		<div>
			<Flex justifyContent='space-between'>
				<Score color={scoreColor(score)}>{score}</Score>
			</Flex>
		</div>
	);
};

const Score = styled.div<{ color: string }>`
	font-family: 'TeX Gyre Adventor';
	font-style: normal;
	font-weight: 700;
	font-size: 66px;
	color: ${props => props.color};
`;

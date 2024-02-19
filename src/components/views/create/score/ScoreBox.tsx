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
	const [score, setScore] = useState(45);
	return (
		<div>
			<Flex justifyContent='space-between' alignItems='flex-end'>
				<Score color={scoreColor(score)}>{score}</Score>
				<Hundred>100</Hundred>
			</Flex>
		</div>
	);
};

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

import React, { useState } from 'react';
import { H6, P, semanticColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { Card } from '../ProGuide.sc';
import { Flex } from '@/components/styled-components/Flex';
import { ScoreBox } from './ScoreBox';
import { ImprovementTips } from './ImprovementTips';

enum EScoreState {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	PERFECT = 'PERFECT',
}

export const infoMap = {
	[EScoreState.LOW]: {
		mainTip:
			'Your project score is too low to publish, you need at least a score of 50 to proceed.',
		title: 'Why is it low?',
		scoreColor: semanticColors.punch[500],
	},
	[EScoreState.MEDIUM]: {
		mainTip:
			'You can still publish your project but it might prevent you to receive the donation your are looking for.',
		title: 'Why is it low?',
		scoreColor: semanticColors.golden[500],
	},
	[EScoreState.HIGH]: {
		mainTip:
			'Just keep in mind to regularly update your project to keep donation coming your way.',
		title: 'What else you can do?',
		scoreColor: semanticColors.jade[400],
	},
	[EScoreState.PERFECT]: {
		mainTip:
			'A perfect score! Just keep in mind to regularly update your project to keep donation coming your way.',
		title: '',
		scoreColor: semanticColors.jade[500],
	},
};

export function getScoreState(score: number) {
	if (score < 50) return EScoreState.LOW;
	if (score < 75) return EScoreState.MEDIUM;
	if (score < 100) return EScoreState.HIGH;
	return EScoreState.PERFECT;
}

export const ProjectScoreCard = () => {
	const [score, setScore] = useState(19);
	return (
		<Card>
			<Flex gap='16px'>
				<Image
					src={'/images/score.svg'}
					alt='score'
					width={32}
					height={32}
				/>
				<H6 weight={700}>Your Project Score</H6>
			</Flex>
			<ScoreBox score={score} />
			<MainTip>{infoMap[EScoreState.PERFECT].mainTip}</MainTip>
			{score < 100 && <ImprovementTips score={score} />}
		</Card>
	);
};

const MainTip = styled(P)`
	text-align: center;
`;

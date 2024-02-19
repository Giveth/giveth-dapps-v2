import React from 'react';
import { H6, P } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { Card } from '../ProGuide.sc';
import { Flex } from '@/components/styled-components/Flex';
import { ScoreBox } from './ScoreBox';

enum EScoreState {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	PERFECT = 'PERFECT',
}

const contentMap = {
	[EScoreState.LOW]: {
		mainTip:
			'Your project score is too low to publish, you need at least a score of 50 to proceed.',
		title: 'Why is it low?',
	},
	[EScoreState.MEDIUM]: {
		mainTip:
			'You can still publish your project but it might prevent you to receive the donation your are looking for.',
		title: 'Why is it low?',
	},
	[EScoreState.HIGH]: {
		mainTip:
			'Just keep in mind to regularly update your project to keep donation coming your way.',
		title: 'What else you can do?',
	},
	[EScoreState.PERFECT]: {
		mainTip:
			'A perfect score! Just keep in mind to regularly update your project to keep donation coming your way.',
	},
};

export const ProjectScoreCard = () => {
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
			<ScoreBox />
			<MainTip>{contentMap[EScoreState.PERFECT].mainTip}</MainTip>
		</Card>
	);
};

const MainTip = styled(P)`
	text-align: center;
`;

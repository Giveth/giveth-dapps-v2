import { type FC, useState, useEffect } from 'react';
import { H6, P, semanticColors } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { UseFormGetFieldState } from 'react-hook-form';
import { Card } from '../common.sc';
import { Flex } from '@/components/styled-components/Flex';
import { ScoreBox } from './ScoreBox';
import { ImprovementTips } from './ImprovementTips';
import { EInputs, TInputs } from '../../types';

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

export interface IProjectScoreCardProps {
	formData: TInputs;
	getFieldState: UseFormGetFieldState<TInputs>;
}

export const ProjectScoreCard: FC<IProjectScoreCardProps> = ({
	formData,
	getFieldState,
}) => {
	const [score, setScore] = useState(19);

	// handle description score
	const { error: descError } = getFieldState(EInputs.description);
	useEffect(() => {
		console.log('Checking description score');
		if (descError) {
			console.log('description score is 0');
		} else {
			console.log('description score is 51');
		}
	}, [descError]);

	// handle categories score
	useEffect(() => {
		console.log('Checking categories score');
		if (formData.categories && formData.categories.length > 0) {
			console.log('categories score is 9');
		} else {
			console.log('categories score is 0');
		}
	}, [formData.categories?.length]);

	// handle location score
	useEffect(() => {
		console.log('Checking location score');
		if (formData[EInputs.impactLocation]) {
			console.log('location score is 9');
		} else {
			console.log('location score is 0');
		}
	}, [formData[EInputs.impactLocation]]);

	// Checking image in description score 1 second after change
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			console.log(
				'Checking image in description score 1 second after change',
			);

			const description = formData[EInputs.description];

			if (description && description.includes('<img')) {
				console.log('image in description score is 12');
			} else {
				console.log('image in description score is 0');
			}
		}, 1000);
		return () => clearTimeout(timeoutId);
	}, [formData[EInputs.description]]);

	// handle image score
	useEffect(() => {
		console.log('Checking image score');
		if (
			formData[EInputs.image] &&
			!formData[EInputs.image].startsWith('/')
		) {
			console.log('image score is 19');
		} else {
			console.log('image score is 0');
		}
	}, [formData[EInputs.image]]);

	console.log('formData', formData);

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

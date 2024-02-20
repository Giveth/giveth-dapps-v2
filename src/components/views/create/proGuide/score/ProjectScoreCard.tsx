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

export enum EScoreType {
	DESCRIPTION = 'DESCRIPTION',
	CATEGORIES = 'CATEGORIES',
	LOCATION = 'LOCATION',
	IMAGE = 'IMAGE',
	DESC_IMAGE = 'DESC_IMAGE',
}

export const ProjectScoreCard: FC<IProjectScoreCardProps> = ({
	formData,
	getFieldState,
}) => {
	// const [fieldsScores, setFieldsScores] = useState([0, 0, 0, 0, 0]);
	const [fieldsScores, setFieldsScores] = useState({
		[EScoreType.DESCRIPTION]: 0,
		[EScoreType.CATEGORIES]: 0,
		[EScoreType.LOCATION]: 0,
		[EScoreType.IMAGE]: 0,
		[EScoreType.DESC_IMAGE]: 0,
	});
	const score = Object.values(fieldsScores).reduce(
		(acc, curr) => acc + curr,
		0,
	);
	console.log('score', fieldsScores, score);

	// handle description score
	const { error: descError } = getFieldState(EInputs.description);
	useEffect(() => {
		console.log('Checking description score');
		if (descError) {
			setFieldsScores({ ...fieldsScores, [EScoreType.DESCRIPTION]: 0 });
		} else {
			setFieldsScores({ ...fieldsScores, [EScoreType.DESCRIPTION]: 51 });
		}
	}, [descError]);

	// handle categories score
	useEffect(() => {
		console.log('Checking categories score');
		if (formData.categories && formData.categories.length > 0) {
			setFieldsScores({ ...fieldsScores, [EScoreType.CATEGORIES]: 9 });
		} else {
			setFieldsScores({ ...fieldsScores, [EScoreType.CATEGORIES]: 0 });
		}
	}, [formData.categories?.length]);

	// handle location score
	useEffect(() => {
		console.log('Checking location score');
		if (formData[EInputs.impactLocation]) {
			setFieldsScores({ ...fieldsScores, [EScoreType.LOCATION]: 9 });
		} else {
			setFieldsScores({ ...fieldsScores, [EScoreType.LOCATION]: 0 });
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
				setFieldsScores({
					...fieldsScores,
					[EScoreType.DESC_IMAGE]: 12,
				});
			} else {
				setFieldsScores({
					...fieldsScores,
					[EScoreType.DESC_IMAGE]: 0,
				});
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
			setFieldsScores({
				...fieldsScores,
				[EScoreType.IMAGE]: 19,
			});
		} else {
			setFieldsScores({
				...fieldsScores,
				[EScoreType.IMAGE]: 0,
			});
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

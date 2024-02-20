import { type FC, useEffect, useReducer } from 'react';
import { H6, P } from '@giveth/ui-design-system';
import Image from 'next/image';
import styled from 'styled-components';
import { UseFormGetFieldState } from 'react-hook-form';
import { Card } from '../common.sc';
import { Flex } from '@/components/styled-components/Flex';
import { ScoreBox } from './ScoreBox';
import { ImprovementTips } from './ImprovementTips';
import { EInputs, TInputs } from '../../types';
import {
	ScoreState,
	ScoreAction,
	calculateScore,
	initialState,
	EScoreType,
	infoMap,
	EScoreState,
} from './scoreHelpers';

export interface IProjectScoreCardProps {
	formData: TInputs;
	getFieldState: UseFormGetFieldState<TInputs>;
}

export const ProjectScoreCard: FC<IProjectScoreCardProps> = ({
	formData,
	getFieldState,
}) => {
	const [fieldsScores, dispatch] = useReducer<
		React.Reducer<ScoreState, ScoreAction>
	>(calculateScore, initialState);

	// Description score
	const descriptionError = getFieldState(EInputs.description).error;
	useEffect(() => {
		console.log('descriptionError', descriptionError);
		dispatch({ type: EScoreType.DESCRIPTION, payload: descriptionError });
	}, [descriptionError]);

	// Categories score
	useEffect(() => {
		dispatch({ type: EScoreType.CATEGORIES, payload: formData.categories });
	}, [formData.categories]);

	// Location score
	useEffect(() => {
		dispatch({
			type: EScoreType.LOCATION,
			payload: formData.impactLocation,
		});
	}, [formData.impactLocation]);

	// Image score
	useEffect(() => {
		dispatch({ type: EScoreType.IMAGE, payload: formData.image });
	}, [formData.image]);

	// Description image score
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const description = formData.description;
			const hasImage = description && description.includes('<img');
			dispatch({ type: EScoreType.DESC_IMAGE, payload: hasImage });
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [formData.description]);

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
			<ScoreBox score={fieldsScores.totalScore} />
			<MainTip>{infoMap[EScoreState.PERFECT].mainTip}</MainTip>
			{fieldsScores.totalScore < 100 && (
				<ImprovementTips score={fieldsScores.totalScore} />
			)}
		</Card>
	);
};

const MainTip = styled(P)`
	text-align: center;
`;

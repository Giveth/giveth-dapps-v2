import { type FC } from 'react';
import styled from 'styled-components';
import {
	H6,
	IconChevronDown32,
	IconChevronUp32,
	P,
} from '@giveth/ui-design-system';
import useAnimatedHeight from '@/hooks/useAnimatedHeight';
import { Flex } from '@/components/styled-components/Flex';
import { infoMap, getScoreState, ScoreState, EScoreType } from './scoreHelpers';

interface IImprovementTipsProps {
	fieldsScores: ScoreState;
}

const tipMap = {
	[EScoreType.DESCRIPTION]:
		'The project description is way too short, add at least 1200 characters to your description.',
	[EScoreType.DESC_IMAGE]:
		'Add an image to your description to make it more appealing.',
	[EScoreType.CATEGORIES]:
		'You need to select at least one category to proceed.',
	[EScoreType.LOCATION]:
		'Add location to your project to make it more appealing.',
	[EScoreType.IMAGE]:
		'Add a custom banner to your project to make it more appealing.',
};

export const ImprovementTips: FC<IImprovementTipsProps> = ({
	fieldsScores,
}) => {
	const info = infoMap[getScoreState(fieldsScores.totalScore)];
	const { isOpen, toggleOpen, maxHeight, contentRef } = useAnimatedHeight();
	return (
		<div>
			<TitleRow
				justifyContent='space-between'
				onClick={toggleOpen}
				alignItems='center'
			>
				<H6 weight={700}>{info.title}</H6>
				{isOpen ? <IconChevronUp32 /> : <IconChevronDown32 />}
			</TitleRow>
			<AnimatedDiv
				maxHeight={isOpen ? maxHeight : '0px'}
				ref={contentRef}
			>
				{fieldsScores.DESCRIPTION === 0 && (
					<P>{tipMap[EScoreType.DESCRIPTION]}</P>
				)}
				{fieldsScores.DESC_IMAGE === 0 && (
					<P>{tipMap[EScoreType.DESC_IMAGE]}</P>
				)}
				{fieldsScores.CATEGORIES === 0 && (
					<P>{tipMap[EScoreType.CATEGORIES]}</P>
				)}
				{fieldsScores.LOCATION === 0 && (
					<P>{tipMap[EScoreType.LOCATION]}</P>
				)}
				{fieldsScores.IMAGE === 0 && <P>{tipMap[EScoreType.IMAGE]}</P>}
			</AnimatedDiv>
		</div>
	);
};

const AnimatedDiv = styled.div<{ maxHeight: string }>`
	overflow: hidden;
	transition: max-height 0.5s ease;
	max-height: ${props => props.maxHeight};
`;

const TitleRow = styled(Flex)`
	cursor: pointer;
`;

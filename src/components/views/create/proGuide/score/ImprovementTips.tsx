import { type FC } from 'react';
import styled from 'styled-components';
import {
	H5,
	IconChevronDown32,
	IconChevronUp32,
} from '@giveth/ui-design-system';
import useAnimatedHeight from '@/hooks/useAnimatedHeight';
import { Flex } from '@/components/styled-components/Flex';
import { infoMap, getScoreState } from './scoreHelpers';

interface IImprovementTipsProps {
	score: number;
}

export const ImprovementTips: FC<IImprovementTipsProps> = ({ score }) => {
	const info = infoMap[getScoreState(score)];
	const { isOpen, toggleOpen, maxHeight, contentRef } = useAnimatedHeight();
	return (
		<div>
			<TitleRow
				justifyContent='space-between'
				onClick={toggleOpen}
				alignItems='center'
			>
				<H5>{info.title}</H5>
				{isOpen ? <IconChevronUp32 /> : <IconChevronDown32 />}
			</TitleRow>
			<AnimatedDiv
				maxHeight={isOpen ? maxHeight : '0px'}
				ref={contentRef}
			>
				{/* Dynamic content goes here */}
				<p>Your content here...</p>
				<p>More content...</p>
				{/* ... */}
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

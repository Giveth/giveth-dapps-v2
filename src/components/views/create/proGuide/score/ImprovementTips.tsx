import { type FC } from 'react';
import styled from 'styled-components';
import {
	Flex,
	H6,
	IconChevronDown32,
	IconChevronUp32,
	P,
} from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import useAnimatedHeight from '@/hooks/useAnimatedHeight';
import { infoMap, ScoreState, EScoreType } from './scoreHelpers';
import { TipListItem } from '../ProjectTips/common.styles';

interface IImprovementTipsProps {
	fieldsScores: ScoreState;
}

const tipMap = {
	[EScoreType.DESCRIPTION]: 'component.improve_tip.desc',
	[EScoreType.DESC_MEDIA]: 'component.improve_tip.desc_media',
	[EScoreType.CATEGORIES]: 'component.improve_tip.categories',
	[EScoreType.LOCATION]: 'component.improve_tip.location',
	[EScoreType.IMAGE]: 'component.improve_tip.image',
};

export const ImprovementTips: FC<IImprovementTipsProps> = ({
	fieldsScores,
}) => {
	const { formatMessage } = useIntl();
	const info = infoMap[fieldsScores.quality];
	const { isOpen, toggleOpen, maxHeight, contentRef } = useAnimatedHeight();
	const bulletColor = info.bulletColor;
	return (
		<div>
			<TitleRow
				$justifyContent='space-between'
				onClick={toggleOpen}
				$alignItems='center'
			>
				<H6 weight={700}>{formatMessage({ id: info.title })}</H6>
				{isOpen ? <IconChevronUp32 /> : <IconChevronDown32 />}
			</TitleRow>
			<AnimatedDiv
				maxHeight={isOpen ? maxHeight : '0px'}
				ref={contentRef}
			>
				{fieldsScores.DESCRIPTION === 0 && (
					<TipListItem color={bulletColor}>
						<P>
							{formatMessage({
								id: tipMap[EScoreType.DESCRIPTION],
							})}
						</P>
					</TipListItem>
				)}
				{fieldsScores.DESC_MEDIA === 0 && (
					<TipListItem color={bulletColor}>
						<P>
							{formatMessage({
								id: tipMap[EScoreType.DESC_MEDIA],
							})}
						</P>
					</TipListItem>
				)}
				{fieldsScores.CATEGORIES === 0 && (
					<TipListItem color={bulletColor}>
						<P>
							{formatMessage({
								id: tipMap[EScoreType.CATEGORIES],
							})}
						</P>
					</TipListItem>
				)}
				{fieldsScores.LOCATION === 0 && (
					<TipListItem color={bulletColor}>
						<P>
							{formatMessage({
								id: tipMap[EScoreType.LOCATION],
							})}
						</P>
					</TipListItem>
				)}
				{fieldsScores.IMAGE === 0 && (
					<TipListItem color={bulletColor}>
						<P>
							{formatMessage({
								id: tipMap[EScoreType.IMAGE],
							})}
						</P>
					</TipListItem>
				)}
			</AnimatedDiv>
		</div>
	);
};

const AnimatedDiv = styled.div<{ maxHeight: string }>`
	overflow: hidden;
	transition: max-height 0.5s ease;
	max-height: ${props => props.maxHeight};
	padding-top: 8px;
`;

const TitleRow = styled(Flex)`
	cursor: pointer;
`;

import { type FC } from 'react';
import styled from 'styled-components';
import { H6, P } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { infoMap, ScoreState, EScoreType } from './scoreHelpers';
import { TipListItem } from '../ProjectTips/common.styles';

interface IImprovementTipsProps {
	fieldsScores: ScoreState;
}

const tipMap = {
	[EScoreType.DESCRIPTION]: 'component.improve_tip.desc',
	[EScoreType.DESC_MEDIA]: 'component.improve_tip.desc_media',
	[EScoreType.SOCIAL_MEDIA]: 'component.improve_tip.social_media',
	[EScoreType.CATEGORIES]: 'component.improve_tip.categories',
	[EScoreType.LOCATION]: 'component.improve_tip.location',
	[EScoreType.IMAGE]: 'component.improve_tip.image',
};

export const ImprovementTips: FC<IImprovementTipsProps> = ({
	fieldsScores,
}) => {
	const { formatMessage } = useIntl();
	const info = infoMap[fieldsScores.quality];
	const bulletColor = info.bulletColor;

	return (
		<div>
			<H6 weight={700}>{formatMessage({ id: info.title })}</H6>
			<AnimatedDiv>
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
				{fieldsScores.SOCIAL_MEDIA === 0 && (
					<TipListItem color={bulletColor}>
						<P>
							{formatMessage({
								id: tipMap[EScoreType.SOCIAL_MEDIA],
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

const AnimatedDiv = styled.div`
	overflow: hidden;
	transition: max-height 0.5s ease;
	padding-top: 8px;
`;

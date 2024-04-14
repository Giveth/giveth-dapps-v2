import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useEffect, useReducer } from 'react';
import Link from 'next/link';
import { B, Flex, FlexSpacer, mediaQueries } from '@giveth/ui-design-system';
import { UseFormGetFieldState } from 'react-hook-form';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

import { StyledHeader, Logo } from '@/components/Header/Header.sc';
import {
	ScoreState,
	ScoreAction,
	calculateScore,
	initialState,
	EScoreType,
	EQualityState,
	infoMap,
} from './proGuide/score/scoreHelpers';
import { EInputs, TInputs } from './types';
import { ScoreBoxSmall } from './proGuide/score/ScoreBoxSmall';
import { ScoreButton } from './proGuide/score/ScoreButton';

export interface IHeader {
	theme?: ETheme;
	show?: boolean;
	formData: TInputs;
	getFieldState: UseFormGetFieldState<TInputs>;
	setQuality: Dispatch<SetStateAction<EQualityState>>;
}

export const CreateHeader: FC<IHeader> = ({
	formData,
	getFieldState,
	setQuality,
}) => {
	const theme = useAppSelector(state => state.general.theme);
	const [fieldsScores, dispatch] = useReducer<
		React.Reducer<ScoreState, ScoreAction>
	>(calculateScore, initialState);

	useEffect(() => {
		setQuality(fieldsScores.quality);
	}, [fieldsScores.quality, setQuality]);

	// Description score
	const descriptionInvalid = getFieldState(EInputs.description).invalid;
	useEffect(() => {
		// if the description is empty it's content is '<p><br></p>'
		console.log('formData.description', formData.description);
		if (formData.description === '<p><br></p>') {
			dispatch({
				type: EScoreType.DESCRIPTION,
				payload: true,
			});
		} else {
			dispatch({
				type: EScoreType.DESCRIPTION,
				payload: descriptionInvalid,
			});
		}
	}, [descriptionInvalid]);

	// SocialMedia score
	const facebookInvalid = getFieldState(EInputs.facebook).invalid;
	const xInvalid = getFieldState(EInputs.x).invalid;
	const instagramInvalid = getFieldState(EInputs.instagram).invalid;
	const youtubeInvalid = getFieldState(EInputs.youtube).invalid;
	const linkedinInvalid = getFieldState(EInputs.linkedin).invalid;
	const redditInvalid = getFieldState(EInputs.reddit).invalid;
	const discordInvalid = getFieldState(EInputs.discord).invalid;
	const farcasterInvalid = getFieldState(EInputs.farcaster).invalid;
	const lensInvalid = getFieldState(EInputs.lens).invalid;
	const websiteInvalid = getFieldState(EInputs.website).invalid;
	useEffect(() => {
		if (!facebookInvalid && formData.facebook) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!xInvalid && formData.x) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!instagramInvalid && formData.instagram) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!youtubeInvalid && formData.youtube) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!linkedinInvalid && formData.linkedin) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!redditInvalid && formData.reddit) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!discordInvalid && formData.discord) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!farcasterInvalid && formData.farcaster) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!lensInvalid && formData.lens) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		if (!websiteInvalid && formData.website) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 0 });
	}, [
		formData.facebook,
		formData.x,
		formData.instagram,
		formData.youtube,
		formData.linkedin,
		formData.reddit,
		formData.discord,
		formData.farcaster,
		formData.lens,
		formData.website,
		facebookInvalid,
		xInvalid,
		instagramInvalid,
		youtubeInvalid,
		linkedinInvalid,
		redditInvalid,
		discordInvalid,
		farcasterInvalid,
		lensInvalid,
		websiteInvalid,
	]);

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

	// Description image or video score
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const description = formData.description;
			// Regular expression to check for '<img' or '<iframe class="ql-video/'
			const mediaRegex = /<img|<iframe class="ql-video/;
			const hasMedia = description && mediaRegex.test(description);
			dispatch({ type: EScoreType.DESC_MEDIA, payload: hasMedia });
		}, 1000);

		return () => clearTimeout(timeoutId);
	}, [formData.description]);

	return (
		<StyledHeader $alignItems='center' $baseTheme={theme} $show={true}>
			<BackButton>
				<Link href={'/'}>
					<Logo>
						<Image
							width='26'
							height='26'
							alt='Giveth logo'
							src={`/images/back-2.svg`}
						/>
					</Logo>
				</Link>
			</BackButton>
			<StyledFlexSpacer />
			<TotalWrapper $alignItems='center' gap='40px'>
				<InfoWrapper $alignItems='center'>
					<Flex gap='8px'>
						<Image
							src={'/images/score.svg'}
							alt='score'
							width={24}
							height={24}
						/>
						<B>Project Score</B>
					</Flex>
					<ScoreBoxSmall
						score={fieldsScores.totalScore}
						color={infoMap[fieldsScores.quality].scoreColor}
					/>
				</InfoWrapper>
				<ScoreButton fieldsScores={fieldsScores} />
			</TotalWrapper>
		</StyledHeader>
	);
};

const BackButton = styled(Flex)`
	display: none;
	${mediaQueries.tablet} {
		display: flex;
	}
`;

const StyledFlexSpacer = styled(FlexSpacer)`
	display: none;
	${mediaQueries.tablet} {
		display: flex;
	}
`;

const TotalWrapper = styled(Flex)`
	flex: 1;
`;

const InfoWrapper = styled(Flex)`
	flex: 1;
	flex-direction: column;
	gap: 4px;
	align-items: flex-start;
	${mediaQueries.tablet} {
		flex-direction: row;
		gap: 24px;
		align-items: center;
	}
`;

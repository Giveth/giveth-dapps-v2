import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useEffect, useReducer } from 'react';
import Link from 'next/link';
import { B, Flex, FlexSpacer } from '@giveth/ui-design-system';
import { UseFormGetFieldState } from 'react-hook-form';
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
		console.log('descriptionError', descriptionInvalid);
		dispatch({ type: EScoreType.DESCRIPTION, payload: descriptionInvalid });
	}, [descriptionInvalid]);

	// SocialMedia score
	useEffect(() => {
		const facebookInvalid = getFieldState(EInputs.facebook).invalid;
		if (!facebookInvalid && formData.facebook) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const xInvalid = getFieldState(EInputs.x).invalid;
		if (!xInvalid && formData.x) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const instagramInvalid = getFieldState(EInputs.instagram).invalid;
		if (!instagramInvalid && formData.instagram) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const youtubeInvalid = getFieldState(EInputs.youtube).invalid;
		if (!youtubeInvalid && formData.youtube) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const linkedinInvalid = getFieldState(EInputs.linkedin).invalid;
		if (!linkedinInvalid && formData.linkedin) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const redditInvalid = getFieldState(EInputs.reddit).invalid;
		if (!redditInvalid && formData.reddit) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const discordInvalid = getFieldState(EInputs.discord).invalid;
		if (!discordInvalid && formData.discord) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const farcasterInvalid = getFieldState(EInputs.farcaster).invalid;
		if (!farcasterInvalid && formData.farcaster) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const lensInvalid = getFieldState(EInputs.lens).invalid;
		if (!lensInvalid && formData.lens) {
			return dispatch({ type: EScoreType.SOCIAL_MEDIA, payload: 1 });
		}
		const websiteInvalid = getFieldState(EInputs.website).invalid;
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
			<Flex $alignItems='center' gap='16px'>
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
			</Flex>
			<FlexSpacer />
			<Flex $alignItems='center' gap='40px'>
				<Flex $alignItems='center' gap='24px'>
					<Flex gap='8px'>
						<Image
							src={'/images/score.svg'}
							alt='score'
							width={24}
							height={24}
						/>
						<B>Project Score</B>
					</Flex>
				</Flex>
				<ScoreBoxSmall
					score={fieldsScores.totalScore}
					color={infoMap[fieldsScores.quality].scoreColor}
				/>
				<ScoreButton fieldsScores={fieldsScores} />
			</Flex>
		</StyledHeader>
	);
};

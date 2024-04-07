import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useEffect, useReducer } from 'react';
import Link from 'next/link';
import { Button, Flex, FlexSpacer } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import { UseFormGetFieldState } from 'react-hook-form';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

import { StyledHeader, Logo } from '@/components/Header/Header.sc';
import { EScrollDir, useScrollDetection } from '@/hooks/useScrollDetection';
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

	const scrollDir = useScrollDetection();

	const [fieldsScores, dispatch] = useReducer<
		React.Reducer<ScoreState, ScoreAction>
	>(calculateScore, initialState);
	const { formatMessage } = useIntl();

	useEffect(() => {
		setQuality(fieldsScores.quality);
	}, [fieldsScores.quality, setQuality]);

	// Description score
	const descriptionInvalid = getFieldState(EInputs.description).invalid;
	useEffect(() => {
		console.log('descriptionError', descriptionInvalid);
		dispatch({ type: EScoreType.DESCRIPTION, payload: descriptionInvalid });
	}, [descriptionInvalid]);

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
		<StyledHeader
			$alignItems='center'
			$baseTheme={theme}
			$show={scrollDir !== EScrollDir.Down}
		>
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
			<Flex $alignItems='center' gap='16px'>
				<ScoreBoxSmall
					score={fieldsScores.totalScore}
					color={infoMap[fieldsScores.quality].scoreColor}
				/>
				<Button label='Create' buttonType='texty-primary' />
			</Flex>
		</StyledHeader>
	);
};

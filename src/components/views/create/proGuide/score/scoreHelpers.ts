import { brandColors, semanticColors } from '@giveth/ui-design-system';

export enum EScoreType {
	DESCRIPTION = 'DESCRIPTION',
	CATEGORIES = 'CATEGORIES',
	LOCATION = 'LOCATION',
	IMAGE = 'IMAGE',
	DESC_MEDIA = 'DESC_MEDIA',
	SOCIAL_MEDIA = 'SOCIAL_MEDIA',
}

export enum EQualityState {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	PERFECT = 'PERFECT',
}

export type ScoreAction = {
	type: EScoreType;
	payload: any;
};

export type ScoreState = {
	[key in EScoreType]: number;
} & {
	totalScore: number;
	quality: EQualityState;
};

export const initialState: ScoreState = {
	[EScoreType.DESCRIPTION]: 0,
	[EScoreType.CATEGORIES]: 0,
	[EScoreType.LOCATION]: 0,
	[EScoreType.IMAGE]: 0,
	[EScoreType.DESC_MEDIA]: 0,
	[EScoreType.SOCIAL_MEDIA]: 0,
	totalScore: 0,
	quality: EQualityState.LOW,
};

export const infoMap = {
	[EQualityState.LOW]: {
		mainTip: 'component.score.low.tip',
		title: 'component.score.low.title',
		scoreColor: semanticColors.punch[500],
		bulletColor: semanticColors.punch,
	},
	[EQualityState.MEDIUM]: {
		mainTip: 'component.score.medium.tip',
		title: 'component.score.medium.title',
		scoreColor: semanticColors.golden[500],
		bulletColor: semanticColors.golden,
	},
	[EQualityState.HIGH]: {
		mainTip: 'component.score.high.tip',
		title: 'component.score.high.title',
		scoreColor: semanticColors.jade[400],
		bulletColor: brandColors.giv,
	},
	[EQualityState.PERFECT]: {
		mainTip: 'component.score.perfect.tip',
		title: 'component.score.perfect.title',
		scoreColor: semanticColors.jade[500],
		bulletColor: brandColors.giv,
	},
};

export function getScoreState(score: number): EQualityState {
	if (score < 50) return EQualityState.LOW;
	if (score < 80) return EQualityState.MEDIUM;
	if (score < 100) return EQualityState.HIGH;
	return EQualityState.PERFECT;
}

export function calculateScore(
	state: ScoreState,
	action: ScoreAction,
): ScoreState {
	let newState = { ...state };

	switch (action.type) {
		case EScoreType.DESCRIPTION:
			newState[EScoreType.DESCRIPTION] = action.payload ? 0 : 51;
			break;
		case EScoreType.CATEGORIES:
			newState[EScoreType.CATEGORIES] =
				action.payload && action.payload.length > 0 ? 7 : 0;
			break;
		case EScoreType.LOCATION:
			newState[EScoreType.LOCATION] = action.payload ? 7 : 0;
			break;
		case EScoreType.IMAGE:
			newState[EScoreType.IMAGE] =
				action.payload && !action.payload.startsWith('/') ? 15 : 0;
			break;
		case EScoreType.DESC_MEDIA:
			newState[EScoreType.DESC_MEDIA] = action.payload ? 8 : 0;
			break;
		case EScoreType.SOCIAL_MEDIA:
			newState[EScoreType.SOCIAL_MEDIA] = action.payload ? 12 : 0;
			break;
		default:
			return state;
	}

	// Compute total score
	newState.totalScore =
		newState[EScoreType.DESCRIPTION] +
		newState[EScoreType.CATEGORIES] +
		newState[EScoreType.LOCATION] +
		newState[EScoreType.IMAGE] +
		newState[EScoreType.DESC_MEDIA];

	newState.quality = getScoreState(newState.totalScore);

	return newState;
}

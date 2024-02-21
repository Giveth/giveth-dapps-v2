import { brandColors, semanticColors } from '@giveth/ui-design-system';

export enum EScoreType {
	DESCRIPTION = 'DESCRIPTION',
	CATEGORIES = 'CATEGORIES',
	LOCATION = 'LOCATION',
	IMAGE = 'IMAGE',
	DESC_IMAGE = 'DESC_IMAGE',
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
	[EScoreType.DESC_IMAGE]: 0,
	totalScore: 0,
	quality: EQualityState.LOW,
};

export const infoMap = {
	[EQualityState.LOW]: {
		mainTip:
			'Your project score is too low to publish, you need at least a score of 50 to proceed.',
		title: 'Why is it low?',
		scoreColor: semanticColors.punch[500],
		bulletColor: semanticColors.punch,
	},
	[EQualityState.MEDIUM]: {
		mainTip:
			'You can still publish your project but try increasing your score to make your project more attractive to donors.',
		title: 'Why is it low?',
		scoreColor: semanticColors.golden[500],
		bulletColor: semanticColors.golden,
	},
	[EQualityState.HIGH]: {
		mainTip:
			'Great score! Just keep in mind to regularly update your project to keep donations coming your way.',
		title: 'What else you can do?',
		scoreColor: semanticColors.jade[400],
		bulletColor: brandColors.giv,
	},
	[EQualityState.PERFECT]: {
		mainTip:
			'A perfect score! Just keep in mind to regularly update your project to keep donations coming your way.',
		title: '',
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
				action.payload && action.payload.length > 0 ? 9 : 0;
			break;
		case EScoreType.LOCATION:
			newState[EScoreType.LOCATION] = action.payload ? 9 : 0;
			break;
		case EScoreType.IMAGE:
			newState[EScoreType.IMAGE] =
				action.payload && !action.payload.startsWith('/') ? 19 : 0;
			break;
		case EScoreType.DESC_IMAGE:
			newState[EScoreType.DESC_IMAGE] = action.payload ? 12 : 0;
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
		newState[EScoreType.DESC_IMAGE];

	newState.quality = getScoreState(newState.totalScore);

	return newState;
}

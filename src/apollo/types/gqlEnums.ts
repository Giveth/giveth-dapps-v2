export enum ESortby {
	ACCEPT_GIV = 'AcceptGiv',
	QUALITY_SCORE = 'QualityScore',
	CREATION_DATE = 'CreationDate',
	BALANCE = 'Balance',
	VERIFIED = 'Verified',
	TRACEABLE = 'Traceable',
	HEARTS = 'Reactions',
	DONATIONS = 'Donations',
	GIVPOWER = 'GIVPower',
}

export enum EProjectsSortBy {
	MOST_FUNDED = 'MostFunded',
	MOST_LIKED = 'MostLiked',
	NEWEST = 'Newest',
	OLDEST = 'Oldest',
	RECENTLY_UPDATED = 'RecentlyUpdated',
	QUALITY_SCORE = 'QualityScore',
	GIVPOWER = 'GIVPower',
	INSTANT_BOOSTING = 'InstantBoosting',
	ActiveQfRoundRaisedFunds = 'ActiveQfRoundRaisedFunds',
	EstimatedMatching = 'EstimatedMatching',
	BestMatch = 'BestMatch',
	LEAST_NUMBER_OF_PROJECTS = 'LeastNumberOfProjects',
	MOST_NUMBER_OF_PROJECTS = 'MostNumberOfProjects',
}

export enum EQFRoundsSortBy {
	MATCHING_POOL = 'MatchingPool',
	UNIQUE_DONORS = 'UniqueDonors',
	NEWEST = 'Newest',
	OLDEST = 'Oldest',
}

export enum EProjectStatus {
	DRAFT = 'drafted',
	ACTIVE = 'activate',
	DEACTIVE = 'deactivate',
	CANCEL = 'cancelled',
}

export enum EDirection {
	DESC = 'DESC',
	ASC = 'ASC',
}

export enum EDonationType {
	POIGNART = 'poignArt',
}

export enum EDonationStatus {
	PENDING = 'pending',
	VERIFIED = 'verified',
	FAILED = 'failed',
}

export enum EProjectVerificationStatus {
	REMINDER = 'reminder', // First notice after 30 days of no updates
	WARNING = 'warning', // Second notice after 60 days of no updates
	LASTCHANCE = 'lastChance', // Last notice after 90 days of no updates
	UPFORREVOKING = 'upForRevoking', // Projects without updates that will be revoked after Oct 15th 2022
	REVOKED = 'revoked',
}

export enum ECauseVerificationStatus {
	REMINDER = 'reminder', // First notice after 30 days of no updates
	WARNING = 'warning', // Second notice after 60 days of no updates
	LASTCHANCE = 'lastChance', // Last notice after 90 days of no updates
	UPFORREVOKING = 'upForRevoking', // Projects without updates that will be revoked after Oct 15th 2022
	REVOKED = 'revoked',
}

export enum EProjectType {
	CAUSE = 'cause',
	PROJECT = 'project',
	ALL = 'all',
}

export enum ECauseStatus {
	DRAFT = 'drafted',
	ACTIVE = 'activate',
	DEACTIVE = 'deactivate',
	CANCEL = 'cancelled',
}

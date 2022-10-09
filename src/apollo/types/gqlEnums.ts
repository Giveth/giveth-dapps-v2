export enum ESortby {
	ACCEPTGIV = 'AcceptGiv',
	QUALITYSCORE = 'QualityScore',
	CREATIONDATE = 'CreationDate',
	BALANCE = 'Balance',
	VERIFIED = 'Verified',
	TRACEABLE = 'Traceable',
	HEARTS = 'Reactions',
	DONATIONS = 'Donations',
	GIVPOWER = 'GIVPower',
}

export enum ESortbyAllProjects {
	MOSTFUNDED = 'MostFunded',
	MOSTLIKED = 'MostLiked',
	NEWEST = 'Newest',
	OLDEST = 'Oldest',
	QUALITYSCORE = 'QualityScore',
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

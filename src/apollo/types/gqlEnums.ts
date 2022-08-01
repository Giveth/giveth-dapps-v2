export enum ESortby {
	ACCEPTGIV = 'AcceptGiv',
	QUALITYSCORE = 'QualityScore',
	CREATIONDATE = 'CreationDate',
	BALANCE = 'Balance',
	VERIFIED = 'Verified',
	TRACEABLE = 'Traceable',
	HEARTS = 'Reactions',
	DONATIONS = 'Donations',
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

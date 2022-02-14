export interface IProject {
	id?: string;
	title?: string;
	balance?: number;
	image?: string;
	slug: string;
	creationDate?: string;
	admin?: string;
	description?: string;
	walletAddress?: string;
	impactLocation?: string;
	qualityScore?: number;
	verified?: boolean;
	listed?: boolean;
	categories: ICategory[];
	reactions: IReaction[];
	adminUser: {
		id?: string;
		email?: string;
		name?: string;
	};
	donations: {
		id?: string;
	}[];
	users: IUser[];
	totalDonations?: number;
	totalProjectUpdates?: number;
	traceCampaignId: string | null;
	givingBlocksId?: string | null;
}

export interface IProjectCreation {
	title: string;
	description: string;
	impactLocation?: any;
	categories: any;
	organisationId: number;
	walletAddress: string;
	imageStatic?: string | null;
	imageUpload?: any;
}

export interface IUser {
	id: string;
	firstName?: string;
	lastName?: string;
	name?: string;
	email?: string;
	avatar?: string;
	walletAddress?: string;
	url?: string;
	location?: string;
	token?: string;
	totalDonated?: string; 
	totalReceived?: string;
	projectsCount?: string;
	donationsCount?: string;
}

export interface IAdmin {
	name?: string;
	totalDonations?: number;
	donations: {
		id: string;
	}[];
	traceCampaignId: string | null;
	totalProjectUpdates?: number;
}

export interface IReaction {
	userId: string;
}

export interface IDonation {
	id: string;
	user: {
		id?: string;
		email?: string;
		name?: string;
	};
	fromWalletAddress: string;
	amount: number;
	currency: string;
	valueUsd?: number;
	transactionId?: string;
	transactionNetworkId?: number;
	createdAt: string;
}

export interface IWalletDonation extends IDonation {
	anonymous: boolean;
	priceEth: number;
	priceUsd: number;
	project: IProject;
	toWalletAddress: string;
	valueEth: number;
	valueUsd: number;
}

export interface IMediumBlogPost {
	title: string;
	author: string;
	description: string;
	link: string;
	pubDate: string;
	guid: string;
}

export interface ICategory {
	name: string;
}

export interface IProjectBySlug {
	project: IProject;
}

export interface IProjectUpdate {
	content: string;
	createdAt: string;
	id: string;
	projectId: string;
	title: string;
	userId: string;
}

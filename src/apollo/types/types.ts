import { EDonationType } from '@/apollo/types/gqlEnums';

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
	reaction?: IReaction;
	totalReactions: number;
	adminUser: {
		id?: string;
		email?: string;
		name?: string;
		walletAddress?: string;
	};
	donations: {
		id?: string;
	}[];
	users: IUser[];
	totalDonations?: number;
	totalTraceDonations?: number;
	totalProjectUpdates?: number;
	traceCampaignId: string | null;
	givingBlocksId?: string | null;
	status: {
		id?: string;
		name?: string;
	};
	updatedAt: string;
}

export interface IProjectEdition {
	id?: string;
	title?: string;
	image?: string;
	description?: string;
	walletAddress?: string;
	impactLocation?: string;
	categories: ICategory[];
	adminUser: {
		walletAddress?: string;
	};
	status: {
		name?: string;
	};
	slug: string;
}

export interface IProjectCreation {
	title: string;
	description: string;
	impactLocation?: any;
	categories: any;
	organisationId: number;
	walletAddress: string;
	image?: string;
	isDraft?: boolean;
}

export interface IUser {
	id?: string;
	firstName?: string;
	lastName?: string;
	name?: string;
	email?: string;
	avatar?: string;
	walletAddress?: string;
	url?: string;
	location?: string;
	token?: string;
	userId?: string;
	totalDonated?: number;
	totalReceived?: number;
	projectsCount?: number;
	donationsCount?: number;
	likedProjectsCount?: number;
}

export interface IReaction {
	id: string;
	userId: string;
}

export interface IDonation {
	id: string;
	user: {
		id?: string;
		email?: string;
		name?: string;
		firstName?: string;
	};
	fromWalletAddress: string;
	amount: number;
	currency: string;
	valueUsd?: number;
	transactionId?: string;
	transactionNetworkId: number;
	createdAt: string;
	donationType?: EDonationType;
	anonymous?: boolean;
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

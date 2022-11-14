import {
	EDonationStatus,
	EDonationType,
	EProjectStatus,
	EProjectVerificationStatus,
} from '@/apollo/types/gqlEnums';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';

export interface IProjectPower {
	powerRank: number;
	totalPower?: number;
	updateTime: string;
}

export interface IProject {
	id?: string;
	title?: string;
	balance?: number;
	image?: string;
	slug: string;
	creationDate?: string;
	admin?: string;
	description?: string;
	addresses?: IWalletAddress[];
	impactLocation?: string;
	qualityScore?: number;
	verified?: boolean;
	verificationStatus?: EProjectVerificationStatus;
	listed?: boolean | null;
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
	status: {
		id?: string;
		name?: EProjectStatus;
	};
	updatedAt: string;
	organization?: {
		name: string;
		label: string;
		supportCustomTokens: boolean;
	};
	projectVerificationForm?: IProjectVerification;
	projectPower: IProjectPower;
	verificationFormStatus?: EVerificationStatus;
}

export interface IDonationProject extends IProject {
	givethAddresses: IWalletAddress[];
}

export interface IWalletAddress {
	address?: string;
	isRecipient?: boolean;
	networkId?: number;
}

export interface IProjectEdition {
	id?: string;
	title?: string;
	image?: string;
	description?: string;
	addresses?: IWalletAddress[];
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
	walletAddress?: string;
	addresses?: IWalletAddress[];
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
	userId?: string;
	totalDonated?: number;
	totalReceived?: number;
	projectsCount?: number;
	donationsCount?: number;
	likedProjectsCount?: number;
	isSignedIn: boolean;
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
	transactionId: string;
	transactionNetworkId: number;
	createdAt: string;
	donationType?: EDonationType;
	anonymous?: boolean;
	status: EDonationStatus;
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
	value?: string;
	isActive?: boolean;
	mainCategory?: Pick<IMainCategory, 'title'>;
}

export interface IConvertedCategories {
	[key: string]: { name: string; value: string }[];
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

export interface ISiweMessage {
	nonce: string;
	message: string;
}

export interface IMainCategory {
	title: string;
	description: string;
	banner: string;
	slug: string;
	categories: ICategory[];
	selected?: boolean;
}
export interface IProjectRegistry {
	isNonProfitOrganization?: boolean;
	organizationCountry?: string;
	organizationWebsite?: string;
	organizationDescription?: string;
	organizationName?: string;
	attachments?: string[];
}

export interface IProjectContact {
	name: string;
	url: string;
}

export interface IProjectMilestones {
	foundationDate?: string;
	mission?: string;
	achievedMilestones?: string;
	achievedMilestonesProofs?: string[];
}

export interface IProjectManagingFunds {
	description: string;
	relatedAddresses: IAddress[];
}

export interface ISocialProfile {
	id: string;
	isVerified: boolean;
	socialNetwork: string;
	socialNetworkId: string;
	name: string;
}

export interface IProjectVerification {
	id: string;
	isTermAndConditionsAccepted: boolean;
	emailConfirmationToken?: string;
	emailConfirmationSent?: boolean;
	emailConfirmationSentAt?: string;
	emailConfirmedAt?: string;
	emailConfirmed?: boolean;
	email?: string;
	projectRegistry?: IProjectRegistry;
	projectContacts?: IProjectContact[];
	milestones?: IProjectMilestones;
	managingFunds?: IProjectManagingFunds;
	emailConfirmationTokenExpiredAt?: string;
	user: IUser;
	project: IProject;
	socialProfiles?: ISocialProfile[];
	status: EVerificationStatus;
	lastStep: EVerificationSteps;
}

export enum EVerificationStatus {
	VERIFIED = 'verified',
	DRAFT = 'draft',
	SUBMITTED = 'submitted',
	REJECTED = 'rejected',
}

export interface IProjectVerificationUpdateInput {
	step: EVerificationSteps;
	projectVerificationId: number;
	projectRegistry?: IProjectRegistry;
	projectContacts?: IProjectContact[];
	milestones?: IProjectMilestones;
	managingFunds?: IProjectManagingFunds;
	isTermAndConditionsAccepted?: boolean;
}

export enum EVerificationSteps {
	PERSONAL_INFO = 'personalInfo',
	PROJECT_REGISTRY = 'projectRegistry',
	PROJECT_CONTACTS = 'projectContacts',
	MANAGING_FUNDS = 'managingFunds',
	MILESTONES = 'milestones',
	TERM_AND_CONDITION = 'termAndCondition',
	SUBMIT = 'submit',
}

export interface IPowerBoosting {
	id: string;
	user: IUser;
	project: IProject;
	percentage: number;
}

interface IBoostedUser {
	id: string;
	firstName: string;
	lastName: string;
	name: string;
}
export interface IPowerBoostingsData {
	id: string;
	userId: string;
	projectId: string;
	percentage: number;
	userPower: number;
	boostedPower: number;
	rank: number;
	user: IBoostedUser;
}

export interface IUserProjectPowers {
	totalCount: number;
	userProjectPowers: IPowerBoostingsData[];
}

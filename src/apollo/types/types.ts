import {
	EDonationStatus,
	EDonationType,
	EProjectStatus,
	EProjectVerificationStatus,
	EProjectsSortBy,
} from '@/apollo/types/gqlEnums';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';

export interface IProjectPower {
	powerRank: number;
	totalPower?: number;
	round: number;
}

export interface IAdminUser {
	id?: string;
	email?: string;
	name?: string;
	walletAddress?: string;
	avatar?: string;
}

export interface IEstimatedMatching {
	allProjectsSum: number;
	matchingPool: number;
	projectDonationsSqrtRootSum: number;
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
	descriptionSummary?: string;
	addresses?: IWalletAddress[];
	impactLocation?: string;
	qualityScore?: number;
	verified?: boolean;
	verificationStatus?: EProjectVerificationStatus;
	listed?: boolean | null;
	categories: ICategory[];
	reaction?: IReaction;
	totalReactions: number;
	adminUser: IAdminUser;
	donations: {
		id?: string;
	}[];
	users: IUser[];
	totalDonations?: number;
	totalProjectUpdates?: number;
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
	projectFuturePower: IProjectPower;
	givbackFactor?: number;
	countUniqueDonors?: number;
	countUniqueDonorsForActiveQfRound?: number;
	estimatedMatching: IEstimatedMatching;
	sumDonationValueUsd?: number;
	sumDonationValueUsdForActiveQfRound?: number;
	qfRounds?: IQFRound[];
}

export interface IDonationProject extends IProject {
	givethAddresses: IWalletAddress[];
}

export enum EProjectsFilter {
	ACCEPT_GIV = 'AcceptGiv',
	VERIFIED = 'Verified',
	BOOSTED_WITH_GIVPOWER = 'BoostedWithGivPower',
	GIVING_BLOCK = 'GivingBlock',
	ACCEPT_FUND_ON_MAINNET = 'AcceptFundOnMainnet',
	ACCEPT_FUND_ON_GNOSIS = 'AcceptFundOnGnosis',
	ACCEPT_FUND_ON_POLYGON = 'AcceptFundOnPolygon',
	ACCEPT_FUND_ON_CELO = 'AcceptFundOnCelo',
	ACCEPT_FUND_ON_OPTIMISM = 'AcceptFundOnOptimism',
	ACTIVE_QF_ROUND = 'ActiveQfRound',
}

export enum ECampaignType {
	MANUALLY_SELECTED = 'ManuallySelected',
	SORT_FIELD = 'SortField',
	FILTER_FIELDS = 'FilterFields',
	WITHOUT_PROJECTS = 'WithoutProjects',
}

export enum ECampaignFilterField {
	Verified = 'verified',
	AcceptGiv = 'givingBlocksId',
	GivingBlock = 'fromGivingBlock',
	BoostedWithGivPower = 'boostedWithGivPower',
	AcceptFundOnMainnet = 'acceptFundOnMainnet',
	AcceptFundOnGnosis = 'acceptFundOnGnosis',
	AcceptFundOnPolygon = 'acceptFundOnPolygon',
	AcceptFundOnCelo = 'acceptFundOnCelo',
	AcceptFundOnOptimism = 'acceptFundOnOptimism',
}

export interface ICampaign {
	id: string;
	title: string;
	hashtags: string[];
	slug: string;
	isFeatured: boolean;
	isNew: boolean;
	description: string;
	relatedProjects: IProject[];
	relatedProjectsCount: number;
	photo?: string;
	video?: string;
	videoPreview?: string;
	type: ECampaignType;
	isActive: boolean;
	order: number;
	landingLink: string;
	filterFields: ECampaignFilterField[];
	sortingField: EProjectsSortBy;
	createdAt: string;
	updatedAt: string;
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
	boostedProjectsCount?: number;
	isSignedIn: boolean;
	wasReferred?: boolean;
	isReferrer?: boolean;
	chainvineId?: string;
}

export interface IPassportInfo {
	passportScore: number;
	passportStamps: any;
}

export interface IUserWithPassport extends IUser, IPassportInfo {}

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
		walletAddress: string;
	};
	amount: number;
	currency: string;
	valueUsd?: number;
	transactionId: string;
	transactionNetworkId: number;
	createdAt: string;
	donationType?: EDonationType;
	anonymous?: boolean;
	status: EDonationStatus;
	onramperId?: string;
	qfRound?: IQFRound;
}

export interface IWalletDonation extends IDonation {
	anonymous: boolean;
	priceEth: number;
	priceUsd: number;
	project: IProject;
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
	thumbnail: string;
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
	contentSummary: string;
	createdAt: string;
	id: string;
	projectId: string;
	title: string;
	userId: string;
}

export interface IProjectUpdateWithProject extends IProjectUpdate {
	project: {
		slug: string;
		image: string;
	};
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
	problem?: string;
	plans?: string;
	impact?: string;
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
	IMPACT = 'milestones',
	TERM_AND_CONDITION = 'termAndCondition',
	SUBMIT = 'submit',
}

export interface IPowerBoosting {
	id: string;
	user: IUser;
	project: IProject;
	percentage: number;
}

export interface IRecentDonation {
	createAt: string;
	id: string;
	project: { title: string; slug: string };
	user: { walletAddress: string };
	valueUsd: number | null;
}

export interface IGiverPFPToken {
	id: string;
	user: {
		id: string;
	};
	tokenId: number;
	imageIpfs: string;
}

export interface IUsersPFPTokens {
	[key: string]: IGiverPFPToken[];
}

export interface IQFRound {
	id: string;
	name: string;
	isActive: boolean;
	beginDate: string;
	endDate: string;
	minimumPassportScore: number;
}

export interface IGetQfRoundHistory {
	distributedFundNetwork: string;
	distributedFundTxHash: string;
	donationsCount: number;
	matchingFund: number;
	raisedFundInUsd: number;
	uniqueDonors: number;
	estimatedMatching: IEstimatedMatching;
}

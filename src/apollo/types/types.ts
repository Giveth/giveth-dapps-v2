import { Address } from 'viem';
import {
	ECauseStatus,
	ECauseVerificationStatus,
	EDonationStatus,
	EDonationType,
	EProjectStatus,
	EProjectVerificationStatus,
	EProjectsSortBy,
} from '@/apollo/types/gqlEnums';
import { IAddress } from '@/components/views/verification/manageFunds/ManageFundsIndex';
import { ChainType } from '@/types/config';

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
	matching: number;
}

export interface IAnchorContractData {
	address: Address;
	isActive: boolean;
	networkId: number;
}

export interface IAnchorContractBasicData {
	contractAddress?: Address;
	recipientAddress: Address;
	hash?: string;
	enabled?: boolean;
}

export interface IProject {
	id: string;
	title?: string;
	balance?: number;
	image?: string;
	slug: string;
	creationDate?: string;
	adminUserId?: number;
	description?: string;
	descriptionSummary?: string;
	addresses?: IWalletAddress[];
	impactLocation?: string;
	qualityScore?: number;
	verified?: boolean;
	isGivbackEligible?: boolean;
	verificationStatus?: EProjectVerificationStatus;
	listed?: boolean | null;
	categories: ICategory[];
	reaction?: IReaction;
	adminUser: IAdminUser;
	donations: {
		id?: string;
	}[];
	totalDonations?: number;
	totalProjectUpdates?: number;
	status: {
		id?: string;
		name?: EProjectStatus;
	};
	updatedAt: string;
	latestUpdateCreationDate?: string;
	organization?: {
		name: string;
		label: string;
		supportCustomTokens: boolean;
		disableRecurringDonations?: boolean;
	};
	projectVerificationForm?: IProjectVerification;
	projectPower: IProjectPower;
	verificationFormStatus?: EVerificationStatus;
	projectFuturePower: IProjectPower;
	givbackFactor?: number;
	countUniqueDonors?: number;
	countUniqueDonorsForActiveQfRound?: number;
	estimatedMatching: IEstimatedMatching;
	sumDonationValueUsdForActiveQfRound?: number;
	qfRounds?: IQFRound[];
	campaigns?: ICampaign[];
	anchorContracts: IAnchorContractData[];
	socialMedia: IProjectSocialMedia[];
}

export enum EProjectsFilter {
	ACCEPT_GIV = 'AcceptGiv',
	VERIFIED = 'Verified',
	IS_GIVBACK_ELIGIBLE = 'IsGivbackEligible',
	BOOSTED_WITH_GIVPOWER = 'BoostedWithGivPower',
	GIVING_BLOCK = 'GivingBlock',
	Endaoment = 'Endaoment',
	ACCEPT_FUND_ON_MAINNET = 'AcceptFundOnMainnet',
	ACCEPT_FUND_ON_GNOSIS = 'AcceptFundOnGnosis',
	ACCEPT_FUND_ON_POLYGON = 'AcceptFundOnPolygon',
	ACCEPT_FUND_ON_CELO = 'AcceptFundOnCelo',
	ACCEPT_FUND_ON_ARBITRUM = 'AcceptFundOnArbitrum',
	ACCEPT_FUND_ON_BASE = 'AcceptFundOnBase',
	ACCEPT_FUND_ON_OPTIMISM = 'AcceptFundOnOptimism',
	ACCEPT_FUND_ON_ETC = 'AcceptFundOnETC',
	ACCEPT_FUND_ON_SOLANA = 'AcceptFundOnSolana',
	ACCEPT_FUND_ON_ZKEVM = 'AcceptFundOnZKEVM',
	ACCEPT_FUND_ON_STELLAR = 'AcceptFundOnStellar',
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
	IsGivbackEligible = 'isGivbackEligible',
	AcceptGiv = 'givingBlocksId',
	GivingBlock = 'fromGivingBlock',
	Endaoment = 'fromEndaoment',
	BoostedWithGivPower = 'boostedWithGivPower',
	AcceptFundOnMainnet = 'acceptFundOnMainnet',
	AcceptFundOnGnosis = 'acceptFundOnGnosis',
	AcceptFundOnPolygon = 'acceptFundOnPolygon',
	AcceptFundOnCelo = 'acceptFundOnCelo',
	AcceptFundOnArbitrum = 'acceptFundOnArbitrum',
	AcceptFundOnBase = 'acceptFundOnBase',
	AcceptFundOnOptimism = 'acceptFundOnOptimism',
	AcceptFundOnSolana = 'acceptFundOnSolana',
	AcceptFundOnZKEVM = 'acceptFundOnZKEVM',
	AcceptFundOnStellar = 'acceptFundOnStellar',
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
	memo?: string;
	isRecipient?: boolean;
	networkId?: number;
	chainType?: ChainType;
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
	anchorContracts?: IAnchorContractData[];
	socialMedia: IProjectSocialMedia[];
}

export interface ICauseEdition {
	id?: string;
	title?: string;
	image?: string;
	description?: string;
	categories: ICategory[];
	selectedProjects: IProject[];
}

export enum EProjectSocialMediaType {
	FACEBOOK = 'FACEBOOK',
	X = 'X',
	INSTAGRAM = 'INSTAGRAM',
	YOUTUBE = 'YOUTUBE',
	LINKEDIN = 'LINKEDIN',
	REDDIT = 'REDDIT',
	DISCORD = 'DISCORD',
	FARCASTER = 'FARCASTER',
	LENS = 'LENS',
	WEBSITE = 'WEBSITE',
	TELEGRAM = 'TELEGRAM',
	GITHUB = 'GITHUB',
}

export interface IProjectSocialMedia {
	type: EProjectSocialMediaType;
	link: string;
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
	socialMedia?: IProjectSocialMedia[];
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
	isEmailVerified?: boolean;
}

export interface IPassportInfo {
	passportScore: number;
	passportStamps: any;
	activeQFMBDScore?: number | null;
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
	transactionId?: string;
	transactionNetworkId: number;
	chainType?: ChainType;
	createdAt: string;
	donationType?: EDonationType;
	anonymous?: boolean;
	status: EDonationStatus;
	onramperId?: string;
	qfRound?: IQFRound;
	isTokenEligibleForGivback?: boolean;
	fromWalletAddress?: string;
}

export interface IWalletDonation extends IDonation {
	anonymous: boolean;
	priceEth: number;
	priceUsd: number;
	project: IProject;
	valueEth: number;
	valueUsd: number;
}

export interface IWalletRecurringDonation {
	id: string;
	createdAt: string;
	project: IProject;
	status: ERecurringDonationStatus;
	flowRate: string;
	currency: string;
	amountStreamed: string;
	totalUsdStreamed: string;
	networkId: number;
	finished: boolean;
	anonymous: boolean;
	isArchived: boolean;
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
	canUseOnFrontend?: boolean;
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

export interface IPersonalInfo {
	email: string;
	walletAddress: string;
	fullName: string;
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
	personalInfo?: IPersonalInfo;
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
	BEFORE_START = 'beforeStart',
	PERSONAL_INFO = 'personalInfo',
	SOCIAL_PROFILES = 'socialProfiles',
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
	slug: string;
	id: string;
	name: string;
	isActive: boolean;
	beginDate: string;
	endDate: string;
	minimumPassportScore: number;
	eligibleNetworks: number[];
	maximumReward: number;
	title: string;
	description: string;
	bannerBgImage: string;
	sponsorsImgs: string[];
	allocatedFund: number;
	allocatedFundUSD: number;
	allocatedFundUSDPreferred: boolean;
	allocatedTokenSymbol: string;
	allocatedTokenChainId: number;
	minimumValidUsdValue?: number;
	minMBDScore: number;
}

export interface IArchivedQFRound extends IQFRound {
	totalDonations: number;
	uniqueDonors: number;
	isDataAnalysisDone: boolean;
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

export enum ERecurringDonationStatus {
	PENDING = 'pending',
	VERIFIED = 'verified',
	ENDED = 'ended',
	FAILED = 'failed',
	ACTIVE = 'active',
}

export interface ICauseCreation {
	title: string;
	description: string;
	chainId: number;
	projectIds: number[];
	mainCategory: string;
	subCategories: any;
	bannerImage: string;
	depositTxHash: string;
	depositTxChainId: number;
}

export interface ICause {
	id: string;
	title: string;
	description: string;
	chainId: number;
	fundingPoolAddress: string;
	causeId: string;
	depositTxHash: string;
	depositTxChainId: number;
	givpowerRank: number;
	instantBoostingRank: number;
	mainCategory: string;
	subCategories: string[];
	owner: {
		id: string;
		name: string;
		walletAddress: string;
	};
	createdAt: string;
	updatedAt: string;
	status: ECauseStatus;
	statusValue: ECauseVerificationStatus;
	listingStatus: string;
	listingStatusValue: string;
	projects: IProject[];
	activeProjectsCount: number;
	totalRaised: number;
	totalDistributed: number;
	totalDonated: number;
	givPower: number;
	givBack: number;

	// TODO: Add other fields
	qfRounds?: IQFRound[];
	givbackFactor?: number;
}

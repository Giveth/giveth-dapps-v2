import { Address } from 'viem';
import { ChainType } from '@/types/config';
import {
	ICategory,
	IDonation,
	IProject,
	IProjectUpdate,
	IWalletAddress,
	IWalletDonation,
	IWalletRecurringDonation,
	ICause,
} from './types';

export interface IFetchAllProjects {
	projects: IProject[];
	totalCount: number;
	categories: ICategory[];
}

export interface IProjectBySlug {
	project?: IProject;
}

export interface IFetchProjectUpdates {
	projectUpdate: IProjectUpdate;
}

export interface IDonationsByProjectIdGQL {
	data: {
		donationsByProjectId: IDonationsByProjectId;
	};
}

export interface IDonationsByProjectId {
	donations: IDonation[];
	totalCount: number;
	recurringDonationsCount: number;
	totalUsdBalance: number;
}

export interface IUserProjects {
	projects: IProject[];
	totalCount: number;
}

export interface IUserDonations {
	donations: IWalletDonation[];
	totalCount: number;
}

export interface IUserRecurringDonations {
	recurringDonations: IWalletRecurringDonation[];
	totalCount: number;
}

export interface IUserLikedProjects {
	projects: IProject[];
	totalCount: number;
}

export interface IProjectAcceptedTokensGQL {
	data: {
		getProjectAcceptTokens: IProjectAcceptedToken[];
	};
}

export interface ICauseAcceptedTokensGQL {
	data: {
		getCauseAcceptTokens: IProjectAcceptedToken[];
	};
}

export interface ISuggestedProjectsGQL {
	data: {
		similarProjectsBySlug: {
			projects: IProject[];
		};
	};
}

export interface ICheckPurpleListGQL {
	data: {
		walletAddressIsPurpleListed: boolean;
	};
}

export interface IMeGQL {
	data: {
		me: {
			walletAddress: string;
		};
	};
}

export interface IProjectAcceptedToken {
	id?: string;
	name: string;
	symbol: string;
	decimals: number;
	networkId: number;
	address: Address;
	mainnetAddress?: Address;
	isGivbackEligible?: boolean;
	order: number;
	chainType?: ChainType;
	isStableCoin?: boolean;
	coingeckoId?: string;
	isQR?: boolean;
}

export interface IFetchGivethProjectGQL {
	data: {
		projectById: {
			slug: string;
			addresses: IWalletAddress[];
		};
	};
}

export interface IGetTokensDetails {
	data: {
		getTokensDetails: IProjectAcceptedToken;
	};
}

export interface IDraftDonation {
	id: number;
	networkId: number;
	chainType: ChainType;
	status: string;
	toWalletAddress: string;
	fromWalletAddress: string;
	tokenAddress: string;
	currency: string;
	amount: number;
	projectId: number;
	project?: IProject;
	createdAt: string;
	matchedDonationId: number;
	qrCodeDataUrl?: string;
	toWalletMemo?: string;
	expiresAt?: string;
}

export interface GetDraftDonation {
	getDraftDonation: IDraftDonation;
}

export interface ICauseBySlug {
	cause?: ICause;
}

export type SwapTransactionInput = {
	squidRequestId?: string;
	firstTxHash: string;
	fromChainId: number;
	toChainId: number;
	fromTokenAddress: string;
	toTokenAddress: string;
	fromAmount: number;
	toAmount: number;
	fromTokenSymbol: string;
	toTokenSymbol: string;
	metadata?: Record<string, any>;
};

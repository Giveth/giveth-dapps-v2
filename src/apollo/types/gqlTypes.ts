import {
	ICategory,
	IDonation,
	IProject,
	IProjectUpdate,
	IWalletAddress,
	IWalletDonation,
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

export interface IUserLikedProjects {
	projects: IProject[];
	totalCount: number;
}

export interface IProjectAcceptedTokensGQL {
	data: {
		getProjectAcceptTokens: IProjectAcceptedToken[];
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
	symbol: string;
	networkId: number;
	address: string;
	mainnetAddress?: string;
	name: string;
	decimals: number;
	isGivbackEligible?: boolean;
	order: number;
}

export interface IFetchGivethProjectGQL {
	data: {
		projectById: {
			slug: string;
			addresses: IWalletAddress[];
		};
	};
}

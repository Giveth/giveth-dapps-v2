import {
	ICategory,
	IDonation,
	IProject,
	IProjectUpdate,
	IWalletDonation,
} from './types';

export interface IFetchAllProjects {
	projects: IProject[];
	totalCount: number;
	categories: ICategory[];
}

export interface IProjectBySlug {
	project: IProject;
}

export interface IFetchProjectUpdates {
	projectUpdate: IProjectUpdate;
}

export interface IDonationsByProjectId {
	donations: IDonation[];
	totalCount: number;
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

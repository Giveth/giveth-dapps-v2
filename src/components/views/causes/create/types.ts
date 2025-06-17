import { ICategory, IProject } from '@/apollo/types/types';

export enum ECreateCauseSections {
	default = 'default',
	name = 'name',
	description = 'description',
	categories = 'categories',
	image = 'image',
}

export enum EInputs {
	title = 'title',
	description = 'description',
	categories = 'categories',
	selectedProjects = 'selectedProjects',
	image = 'image',
	transactionNetworkId = 'transactionNetworkId',
	transactionHash = 'transactionHash',
	transactionStatus = 'transactionStatus',
}

export type TCauseInputs = {
	[EInputs.title]: string;
	[EInputs.description]?: string;
	[EInputs.categories]?: ICategory[];
	[EInputs.image]?: string;
	[EInputs.selectedProjects]?: IProject[];
	[EInputs.transactionNetworkId]?: number;
	[EInputs.transactionHash]?: string;
	[EInputs.transactionStatus]?: string;
};

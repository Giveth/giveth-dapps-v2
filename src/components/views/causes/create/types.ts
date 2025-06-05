import { ICategory } from '@/apollo/types/types';

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
}

export type TCauseInputs = {
	[EInputs.title]: string;
	[EInputs.description]?: string;
	[EInputs.categories]?: ICategory[];
	[EInputs.image]?: string;
	[EInputs.selectedProjects]?: string[];
};

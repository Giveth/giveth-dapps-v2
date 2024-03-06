import {
	ICategory,
	IProjectSocialMedia,
	IWalletAddress,
} from '@/apollo/types/types';

export enum EInputs {
	name = 'name',
	description = 'description',
	categories = 'categories',
	impactLocation = 'impactLocation',
	image = 'image',
	draft = 'draft',
	addresses = 'addresses',
	alloProtocolRegistry = 'alloProtocolRegistry',
	socialMediaAddresses = 'socialMediaAddresses',
}

export enum ECreateProjectSections {
	default = 'default',
	name = 'name',
	description = 'description',
	categories = 'categories',
	location = 'location',
	image = 'image',
	addresses = 'addresses',
}

export type TInputs = {
	[EInputs.name]: string;
	[EInputs.description]?: string;
	[EInputs.categories]?: ICategory[];
	[EInputs.impactLocation]?: string;
	[EInputs.image]?: string;
	[EInputs.draft]?: boolean;
	[EInputs.alloProtocolRegistry]?: boolean;
	[EInputs.addresses]: IWalletAddress[];
	[EInputs.socialMediaAddresses]: IProjectSocialMedia[];
};

import { ICategory, IWalletAddress } from '@/apollo/types/types';

export enum EInputs {
	name = 'name',
	description = 'description',
	categories = 'categories',
	impactLocation = 'impactLocation',
	image = 'image',
	draft = 'draft',
	addresses = 'addresses',
	alloProtocolRegistry = 'alloProtocolRegistry',
	facebook = 'facebook',
	twitter = 'twitter',
	instagram = 'instagram',
	youtube = 'instagram',
	linkedIn = 'instagram',
	reddit = 'instagram',
	discord = 'discord',
	farcaster = 'farcaster',
	lens = 'lens',
	website = 'website',
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
	[EInputs.facebook]?: string;
	[EInputs.twitter]?: string;
	[EInputs.instagram]?: string;
	[EInputs.youtube]?: string;
	[EInputs.linkedIn]?: string;
	[EInputs.reddit]?: string;
	[EInputs.discord]?: string;
	[EInputs.farcaster]?: string;
	[EInputs.lens]?: string;
	[EInputs.website]?: string;
};

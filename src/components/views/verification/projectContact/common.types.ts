export enum EMainSocials {
	Twitter = 'Twitter',
	Facebook = 'Facebook',
	Instagram = 'Instagram',
	YouTube = 'YouTube',
	LinkedIn = 'Linkedin',
	Website = 'Website',
	SocialLink = 'SocialLink',
}

export interface IMainSocials {
	[EMainSocials.Twitter]: string;
	[EMainSocials.Facebook]: string;
	[EMainSocials.Instagram]: string;
	[EMainSocials.YouTube]: string;
	[EMainSocials.LinkedIn]: string;
	[EMainSocials.Website]: string;
	[EMainSocials.SocialLink]: string;
}

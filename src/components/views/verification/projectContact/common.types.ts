export enum EMainSocials {
	Twitter = 'X (Twitter)',
	Discord = 'Discord',
	Telegram = 'Telegram',
	WhatsApp = 'WhatsApp',
	SocialLink = 'SocialLink',
}

export interface IMainSocials {
	[EMainSocials.Twitter]: string;
	[EMainSocials.Discord]: string;
	[EMainSocials.Telegram]: string;
	[EMainSocials.WhatsApp]: string;
	[EMainSocials.SocialLink]: string;
}

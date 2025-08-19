import { ICardanoAcceptedToken } from './types';

export const cardanoAcceptedTokens: ICardanoAcceptedToken[] = [
	{
		name: 'ADA',
		symbol: 'ADA',
		decimals: 6, // 1 ADA = 1,000,000 lovelace
		networkId: 1,
		address: 'lovelace',
		cardano: {
			unit: 'lovelace',
			nameHex: null,
			policyId: null,
			logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=040',
			quantity: 0,
			rawQuantity: '',
			priceAda: 0,
		},
		order: 0,
	},
	{
		name: 'SHEN',
		symbol: 'SHEN',
		decimals: 6,
		networkId: 1,
		address:
			'8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd615368656e4d6963726f555344',
		cardano: {
			unit: '8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd615368656e4d6963726f555344',
			nameHex: '5368656e4d6963726f555344',
			policyId:
				'8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61',
			logo: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=040',
			quantity: 0,
			rawQuantity: '',
			priceAda: 0,
		},
		order: 1,
	},
];

export const MIN_ADA = 1;
export const DONATION_DESTINATION_ADDRESS =
	'addr1q9ute9k2xxkpqfy4pdljet3nh48zm6c3yfjcdkj0htuapsdwjzm36z25ndrmvxr990m76279jq7zeu50k3lgasjds9ts447s0a';

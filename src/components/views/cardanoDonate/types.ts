import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';

export interface ICardanoAcceptedToken extends IProjectAcceptedToken {
	cardano?: {
		unit: string;
		nameHex: string | null;
		policyId: string | null;
		logo: string;
		quantity: number;
		rawQuantity: string;
		priceAda: number;
		tokenAddress: string;
	};
}

export interface ICardanoAcceptedTokensGQL {
	data: {
		getCauseAcceptTokens: ICardanoAcceptedToken[];
	};
}

export type CardanoWalletInfo = {
	id: string; // e.g. "yoroi", "nami", "eternl"
	name: string; // display name
	icon: string; // icon url
};

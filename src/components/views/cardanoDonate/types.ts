import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';

export interface ICardanoAcceptedTokens extends IProjectAcceptedToken {
	cardano?: {
		unit: string;
		nameHex: string | null;
		policyId: string | null;
		logo: string;
	};
}

export interface ICardanoAcceptedTokensGQL {
	data: {
		getCauseAcceptTokens: ICardanoAcceptedTokens[];
	};
}

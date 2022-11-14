import { EVerificationSteps } from '@/apollo/types/types';

export const findStepByName = (step?: EVerificationSteps): number => {
	switch (step) {
		case EVerificationSteps.PERSONAL_INFO:
			return 1;
		case EVerificationSteps.PROJECT_REGISTRY:
			return 3;
		case EVerificationSteps.PROJECT_CONTACTS:
			return 4;
		case EVerificationSteps.IMPACT:
			return 5;
		case EVerificationSteps.MANAGING_FUNDS:
			return 6;
		case EVerificationSteps.TERM_AND_CONDITION:
			return 7;
		case EVerificationSteps.SUBMIT:
			return 8;
		default:
			return 0;
	}
};

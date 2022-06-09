import { PROJECT_VERIFICATION_STEPS } from '@/apollo/types/types';

export const findStepByName = (step: PROJECT_VERIFICATION_STEPS): number => {
	switch (step) {
		case PROJECT_VERIFICATION_STEPS.PERSONAL_INFO:
			return 1;
		case PROJECT_VERIFICATION_STEPS.PROJECT_REGISTRY:
			return 3;
		case PROJECT_VERIFICATION_STEPS.PROJECT_CONTACTS:
			return 4;
		case PROJECT_VERIFICATION_STEPS.MILESTONES:
			return 5;
		case PROJECT_VERIFICATION_STEPS.MANAGING_FUNDS:
			return 6;
		case PROJECT_VERIFICATION_STEPS.TERM_AND_CONDITION:
			return 7;
		case PROJECT_VERIFICATION_STEPS.SUBMIT:
			return 8;
		default:
			return -1;
	}
};

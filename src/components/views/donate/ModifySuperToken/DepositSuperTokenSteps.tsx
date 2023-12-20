import { type FC } from 'react';
import { Steps } from '@/components/steps/Steps';
import { EModifySuperTokenSteps } from './ModifySuperTokenModal';

export enum EDepositSteps {
	APPROVE,
	APPROVING,
	DEPOSIT,
	DEPOSITING,
	SUBMITTED,
}

interface DonateStepsProps {
	modifyTokenState: EModifySuperTokenSteps;
}

const steps = [
	'label.approve',
	'label.approving',
	'label.deposit',
	'label.depositing',
	'label.done',
];

export const DepositSteps: FC<DonateStepsProps> = ({ modifyTokenState }) => {
	let activeStep = 0;
	if (
		modifyTokenState === EModifySuperTokenSteps.DEPOSIT ||
		modifyTokenState === EModifySuperTokenSteps.DEPOSITING ||
		modifyTokenState === EModifySuperTokenSteps.SUBMITTED
	) {
		activeStep = 1;
	}
	return <Steps steps={steps} activeStep={activeStep} />;
};

import { type FC } from 'react';
import { Steps } from '@/components/steps/Steps';
import { EDonationSteps } from './RecurringDonationModal';

interface DonateStepsProps {
	donateState: EDonationSteps;
}

const steps = ['label.approve', 'label.donate'];

export const DonateSteps: FC<DonateStepsProps> = ({ donateState }) => {
	let activeStep = 0;
	if (
		donateState === EDonationSteps.DONATE ||
		donateState === EDonationSteps.DONATING
	) {
		activeStep = 1;
	}
	return <Steps steps={steps} activeStep={activeStep} />;
};

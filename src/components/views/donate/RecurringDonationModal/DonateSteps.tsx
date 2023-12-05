import { type FC } from 'react';
import { Steps } from '@/components/steps/Steps';
import { EDonationSteps } from './RecurringDonationModal';

interface DonateStepsProps {
	mintState: EDonationSteps;
}

const steps = ['label.approve', 'label.donate'];

export const DonateSteps: FC<DonateStepsProps> = ({ mintState }) => {
	let activeStep = 0;
	if (
		mintState === EDonationSteps.DONATE ||
		mintState === EDonationSteps.DONATING
	) {
		activeStep = 1;
	}
	return <Steps steps={steps} activeStep={activeStep} />;
};

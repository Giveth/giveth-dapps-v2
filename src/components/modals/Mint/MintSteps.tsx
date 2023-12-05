import { type FC } from 'react';
import { Steps } from '@/components/steps/Steps';
import { MintStep } from './MintModal';

interface IMintStepsProps {
	mintState: MintStep;
}

const steps = ['Approve', 'Mint'];

export const MintSteps: FC<IMintStepsProps> = ({ mintState }) => {
	let activeStep = 0;
	if (mintState === MintStep.MINT || mintState === MintStep.MINTING) {
		activeStep = 1;
	}
	return <Steps steps={steps} activeStep={activeStep} />;
};

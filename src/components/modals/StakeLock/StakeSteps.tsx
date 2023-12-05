import { type FC } from 'react';
import { Steps } from '@/components/steps/Steps';
import { StakeState } from '@/lib/staking';

interface IStakeStepsProps {
	stakeState: StakeState;
}

const steps = ['Approve', 'Stake'];

export const StakeSteps: FC<IStakeStepsProps> = ({ stakeState }) => {
	let activeStep = 0;
	if (
		stakeState === StakeState.WRAP ||
		stakeState === StakeState.WRAPPING ||
		stakeState === StakeState.STAKE ||
		stakeState === StakeState.STAKING
	) {
		activeStep = 1;
	}
	return <Steps steps={steps} activeStep={activeStep} />;
};

import { type FC } from 'react';
import { Steps } from '@/components/steps/Steps';
import { StakeState } from '@/lib/staking';

interface IStakeStepsProps {
	stakeState: StakeState;
	permit?: boolean;
}

export const StakeSteps: FC<IStakeStepsProps> = ({ stakeState, permit }) => {
	let activeStep = 0;
	const steps = permit
		? ['label.permit', 'label.stake']
		: ['label.approve', 'label.stake'];
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

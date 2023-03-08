import React from 'react';
import { StakeState } from '@/lib/staking';
import {
	StakeStep,
	StakeStepTitle,
	StakeStepNumber,
	StakeStepsPlaceholder,
	StakeStepsContainer,
} from './StakeSteps.sc';

const StakeSteps = ({ stakeState }: { stakeState: StakeState }) => {
	return stakeState === StakeState.APPROVE ||
		stakeState === StakeState.APPROVING ||
		stakeState === StakeState.WRAP ||
		stakeState === StakeState.WRAPPING ? (
		<StakeStepsContainer>
			<StakeStep>
				<StakeStepTitle>Approve</StakeStepTitle>
				<StakeStepNumber>1</StakeStepNumber>
			</StakeStep>
			<StakeStep>
				<StakeStepTitle
					disable={
						!(
							stakeState === StakeState.WRAP ||
							stakeState === StakeState.WRAPPING
						)
					}
				>
					Stake
				</StakeStepTitle>
				<StakeStepNumber
					disable={
						!(
							stakeState === StakeState.WRAP ||
							stakeState === StakeState.WRAPPING
						)
					}
				>
					2
				</StakeStepNumber>
			</StakeStep>
		</StakeStepsContainer>
	) : (
		<StakeStepsPlaceholder />
	);
};

export default StakeSteps;

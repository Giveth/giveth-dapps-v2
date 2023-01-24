import React from 'react';
import { brandColors, P, SublineBold } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { StakeState } from '@/lib/staking';
import { Flex } from '@/components/styled-components/Flex';

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

const StakeStepsContainer = styled(Flex)`
	position: relative;
	justify-content: space-evenly;
	&::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 1px;
		border-top: 1px solid ${brandColors.giv[500]};
		bottom: 11px;
		z-index: 0;
	}
	&::after {
		content: '';
		position: absolute;
		height: 1px;
		border-top: 1px dashed ${brandColors.giv[500]};
		left: -24px;
		right: -24px;
		bottom: 11px;
		z-index: 0;
	}
	margin-bottom: 16px;
`;

const StakeStep = styled(Flex)`
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 61px;
	position: relative;
	z-index: 1;
`;

interface IStakeStepState {
	disable?: boolean;
}

const StakeStepTitle = styled(P)<IStakeStepState>`
	margin-bottom: 8px;
	color: ${props =>
		props.disable ? brandColors.giv[300] : brandColors.giv['000']};
`;
const StakeStepNumber = styled(SublineBold)<IStakeStepState>`
	color: ${props =>
		props.disable ? brandColors.giv[300] : brandColors.giv['000']};
	background-color: ${brandColors.giv[500]};
	border: 3px solid
		${props =>
			props.disable ? brandColors.giv[300] : brandColors.giv['000']};
	border-radius: 18px;
	width: 24px;
`;

const StakeStepsPlaceholder = styled.div`
	padding: 13px;
`;

export default StakeSteps;

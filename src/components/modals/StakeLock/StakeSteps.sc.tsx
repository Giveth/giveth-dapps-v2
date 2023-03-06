import { brandColors, P, SublineBold } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export const StakeStepsContainer = styled(Flex)`
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

export const StakeStep = styled(Flex)`
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

export const StakeStepTitle = styled(P)<IStakeStepState>`
	margin-bottom: 8px;
	color: ${props =>
		props.disable ? brandColors.giv[300] : brandColors.giv['000']};
`;
export const StakeStepNumber = styled(SublineBold)<IStakeStepState>`
	color: ${props =>
		props.disable ? brandColors.giv[300] : brandColors.giv['000']};
	background-color: ${brandColors.giv[500]};
	border: 3px solid
		${props =>
			props.disable ? brandColors.giv[300] : brandColors.giv['000']};
	border-radius: 18px;
	width: 24px;
`;

export const StakeStepsPlaceholder = styled.div`
	padding: 13px;
`;

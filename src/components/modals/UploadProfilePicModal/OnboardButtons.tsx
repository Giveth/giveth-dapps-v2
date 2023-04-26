import { Col } from '@giveth/ui-design-system';
import React from 'react';
import {
	OnboardActionsContainer,
	SaveButton,
	SkipButton,
} from '@/components/views/onboarding/common';
import { INFTButtons } from './NFTButtons';

interface OnboardButtonsProps extends INFTButtons {
	callback: () => void;
	isSaveDisabled: boolean;
}

const OnboardButtons = ({
	loading,
	saveAvatar,
	setSelectedPFP,
	callback,
	isSaveDisabled = true,
}: OnboardButtonsProps) => {
	return (
		<OnboardActionsContainer>
			<Col xs={12} md={7}>
				<SaveButton
					label='SAVE'
					onClick={saveAvatar}
					disabled={isSaveDisabled}
					size='medium'
					loading={loading}
				/>
			</Col>
			<Col xs={12} md={2}>
				<SkipButton
					label='Do it later'
					size='medium'
					buttonType='texty'
					onClick={() => {
						setSelectedPFP(undefined);
						callback();
					}}
				/>
			</Col>
		</OnboardActionsContainer>
	);
};

export default OnboardButtons;

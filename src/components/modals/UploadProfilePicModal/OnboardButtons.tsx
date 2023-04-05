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
}

const OnboardButtons = ({
	saveAvatar,
	setSelectedPFP,
	nftUrl,
	callback,
}: OnboardButtonsProps) => {
	return (
		<OnboardActionsContainer>
			<Col xs={12} md={7}>
				<SaveButton
					label='SAVE'
					onClick={saveAvatar}
					disabled={!nftUrl}
					size='medium'
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

import { Button, neutralColors } from '@giveth/ui-design-system';
import { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';

import { Col, Row } from '@giveth/ui-design-system';
import { OnboardSteps } from './Onboarding.view';

export const OnboardStep = styled(Col)`
	margin: 0 auto;
`;

export interface IStep {
	setStep: Dispatch<SetStateAction<OnboardSteps>>;
}

export const OnboardActionsContainer = styled(Row)`
	justify-content: space-between;
	border-top: 1px solid ${neutralColors.gray[400]};
	padding-top: 16px;
`;

export const SaveButton = styled(Button)`
	width: 100%;
`;

export const SkipButton = styled(Button)`
	width: 100%;
`;

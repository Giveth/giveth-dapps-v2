import { Row } from '@/components/styled-components/Grid';
import { Button, neutralColors } from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction } from 'react';
import styled from 'styled-components';
import { OnboardSteps } from './Onboarding.view';

export const OnboardStep = styled.div`
	width: 750px;
	margin: 0 auto;
`;

export interface IStep {
	setStep: Dispatch<SetStateAction<OnboardSteps>>;
}
interface IOnboardActions {
	onSave: any;
	saveLabel: string;
	disabled: boolean;
}

export const OnboardActions: FC<IOnboardActions> = ({
	onSave,
	saveLabel,
	disabled,
}) => {
	return (
		<OnboardActionsContianer>
			<SaveButton
				label={saveLabel}
				disabled={disabled}
				onClick={onSave}
				size='medium'
			/>
			<SkipButton label='Do it later' size='medium' buttonType='texty' />
		</OnboardActionsContianer>
	);
};

const OnboardActionsContianer = styled(Row)`
	justify-content: space-between;
	border-top: 1px solid ${neutralColors.gray[400]};
	padding-top: 16px;
`;

const SaveButton = styled(Button)`
	width: 400px;
`;

const SkipButton = styled(Button)``;

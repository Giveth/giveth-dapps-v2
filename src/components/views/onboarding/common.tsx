import { Row } from '@/components/styled-components/Grid';
import { Button, neutralColors } from '@giveth/ui-design-system';
import { FC } from 'react';
import styled from 'styled-components';

export const OnboardStep = styled.div`
	width: 750px;
	margin: 0 auto;
`;

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

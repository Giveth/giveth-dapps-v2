import { Button, neutralColors } from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';

import { Col, Row } from '@/components/Grid';
import useUser from '@/context/UserProvider';
import { OnboardSteps } from './Onboarding.view';
import useModal from '@/context/ModalProvider';

export const OnboardStep = styled(Col)`
	margin: 0 auto;
`;

export interface IStep {
	setStep: Dispatch<SetStateAction<OnboardSteps>>;
}
interface IOnboardActions {
	onSave: () => Promise<boolean>;
	saveLabel: string;
	onLater: any;
	disabled: boolean;
}

export const OnboardActions: FC<IOnboardActions> = ({
	onSave,
	saveLabel,
	onLater,
	disabled,
}) => {
	const {
		state: { isSignedIn },
		actions: { reFetchUser },
	} = useUser();

	const {
		actions: { showSignWithWallet },
	} = useModal();

	useEffect(() => {
		if (!isSignedIn) {
			showSignWithWallet();
		}
	}, [isSignedIn]);

	const handleSave = async () => {
		if (!isSignedIn) {
			showSignWithWallet();
		} else {
			const res = await onSave();
			if (res) {
				reFetchUser();
			}
		}
	};

	return (
		<>
			<OnboardActionsContianer>
				<Col xs={12} md={7}>
					<SaveButton
						label={saveLabel}
						disabled={disabled}
						onClick={handleSave}
						size='medium'
					/>
				</Col>
				<Col xs={12} md={2}>
					<SkipButton
						label='Do it later'
						size='medium'
						buttonType='texty'
						onClick={onLater}
					/>
				</Col>
			</OnboardActionsContianer>
		</>
	);
};

const OnboardActionsContianer = styled(Row)`
	justify-content: space-between;
	border-top: 1px solid ${neutralColors.gray[400]};
	padding-top: 16px;
`;

const SaveButton = styled(Button)`
	width: 100%;
`;

const SkipButton = styled(Button)`
	width: 100%;
`;

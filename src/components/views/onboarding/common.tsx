import { Col, Row } from '@/components/Grid';
import { WelcomeSigninModal } from '@/components/modals/WelcomeSigninModal';
import useUser from '@/context/UserProvider';
import { Button, neutralColors } from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import styled from 'styled-components';
import { OnboardSteps } from './Onboarding.view';

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
	const [showSigninModal, setShowSigninModal] = useState(false);
	const {
		state: { user, isSignedIn },
		actions: { reFetchUserData },
	} = useUser();

	useEffect(() => {
		if (!isSignedIn) {
			setShowSigninModal(true);
		} else {
			setShowSigninModal(false);
		}
	}, [isSignedIn]);

	const handleSave = async () => {
		if (!isSignedIn) {
			setShowSigninModal(true);
		} else {
			const res = await onSave();
			if (res) {
				reFetchUserData();
			}
		}
	};

	return (
		<>
			<OnboardActionsContianer>
				<Col xs={12} xl={7}>
					<SaveButton
						label={saveLabel}
						disabled={disabled}
						onClick={handleSave}
						size='medium'
					/>
				</Col>
				<Col xs={12} xl={2}>
					<SkipButton
						label='Do it later'
						size='medium'
						buttonType='texty'
						onClick={onLater}
					/>
				</Col>
			</OnboardActionsContianer>
			{showSigninModal && (
				<WelcomeSigninModal
					showModal={showSigninModal}
					setShowModal={setShowSigninModal}
				/>
			)}
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

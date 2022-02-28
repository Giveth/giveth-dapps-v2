import { WelcomeSigninModal } from '@/components/modals/WelcomeSigninModal';
import { Row } from '@/components/styled-components/Grid';
import useUser from '@/context/UserProvider';
import { Button, neutralColors } from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
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
		state: { isSignedIn },
	} = useUser();

	useEffect(() => {
		if (!isSignedIn) {
			setShowSigninModal(true);
		}
	}, [isSignedIn]);

	const handleSave = () => {
		if (!isSignedIn) {
			setShowSigninModal(true);
		} else {
			onSave();
		}
	};

	return (
		<>
			<OnboardActionsContianer>
				<SaveButton
					label={saveLabel}
					disabled={disabled}
					onClick={handleSave}
					size='medium'
				/>
				<SkipButton
					label='Do it later'
					size='medium'
					buttonType='texty'
					onClick={onLater}
				/>
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
	width: 400px;
`;

const SkipButton = styled(Button)``;

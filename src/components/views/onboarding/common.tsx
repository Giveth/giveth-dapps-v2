import { Button, neutralColors } from '@giveth/ui-design-system';
import { Dispatch, FC, SetStateAction, useEffect } from 'react';
import styled from 'styled-components';

import { useWeb3React } from '@web3-react/core';
import { Col, Row } from '@/components/Grid';
import { OnboardSteps } from './Onboarding.view';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { fetchUserByAddress } from '@/features/user/user.thunks';

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
	const dispatch = useAppDispatch();
	const isSignedIn = useAppSelector(state => state.user.isSignedIn);
	const { account } = useWeb3React();
	useEffect(() => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		}
	}, [isSignedIn]);

	const handleSave = async () => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		} else {
			const res = await onSave();
			if (res) {
				account && dispatch(fetchUserByAddress(account));
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

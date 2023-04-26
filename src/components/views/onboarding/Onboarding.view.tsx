import { B, brandColors, H5 } from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Container } from '@giveth/ui-design-system';
import DoneStep from './DoneStep';
import InfoStep from './InfoStep';
import PhotoStep from './PhotoStep';
import Spinner from '@/components/Spinner';
import WalletNotConnected from '@/components/WalletNotConnected';
import UserNotSignedIn from '@/components/UserNotSignedIn';
import { useAppSelector } from '@/features/hooks';
import { isUserRegistered } from '@/lib/helpers';
import AlreadyRegistered from '@/components/views/onboarding/AlreadyRegistered';

const StatesLabel = [
	'Register on Giveth',
	'Who are you?',
	'Fancy profile photo',
	'Done',
];

export enum OnboardSteps {
	REG,
	INFO,
	PHOTO,
	DONE,
}

export interface IOnboard {
	step: OnboardSteps;
}

const OnboardView = () => {
	const [step, setStep] = useState(OnboardSteps.INFO);
	const [isFirstRegistration, setFirstRegistration] = useState(true);
	const [firstLoading, setFirstLoading] = useState(true); // To prevent first flickering

	const { isLoading, isEnabled, isSignedIn, userData } = useAppSelector(
		state => state.user,
	);

	const isRegistered = isUserRegistered(userData);

	useEffect(() => {
		if (userData?.isSignedIn) {
			// Do not show "Already completed profile" message when user completes first step
			setFirstRegistration(!isRegistered);
			setStep(OnboardSteps.INFO);
			setFirstLoading(false);
		}
	}, [userData?.isSignedIn]);

	if (isLoading || firstLoading) {
		return <Spinner />;
	} else if (!isEnabled) {
		return <WalletNotConnected />;
	} else if (!isSignedIn) {
		return <UserNotSignedIn />;
	} else if (isRegistered && !isFirstRegistration) {
		return <AlreadyRegistered />;
	}

	return (
		<OnboardViewContainer>
			<OnboardHeader step={step} />
			{step === OnboardSteps.INFO && <InfoStep setStep={setStep} />}
			{step === OnboardSteps.PHOTO && <PhotoStep setStep={setStep} />}
			{step === OnboardSteps.DONE && <DoneStep />}
		</OnboardViewContainer>
	);
};

export default OnboardView;

enum LabelStatus {
	PREV,
	ACTIVE,
	NEXT,
}

const OnboardHeader: FC<IOnboard> = ({ step }) => {
	return (
		<OnboardHeaderContainer>
			<OnboardHeading weight={700}>Complete your profile</OnboardHeading>
			<OnboardProgressbar step={step} />
			<OnboardProgressbarLabels>
				{StatesLabel.map((label, idx) => (
					<OnboardProgressbarLabel
						key={idx}
						status={
							idx > step
								? LabelStatus.NEXT
								: idx === 0
								? LabelStatus.PREV
								: LabelStatus.ACTIVE
						}
					>
						{label}
					</OnboardProgressbarLabel>
				))}
			</OnboardProgressbarLabels>
		</OnboardHeaderContainer>
	);
};

const OnboardViewContainer = styled(Container)`
	padding-top: 207px;
	padding-bottom: 68px;
`;

const OnboardHeaderContainer = styled.div`
	padding-bottom: 68px;
`;

const OnboardProgressbar = styled.div<IOnboard>`
	background: ${brandColors.giv[100]};
	height: 6px;
	border-radius: 12px;
	position: relative;
	margin: 24px 0 16px;
	::after {
		content: '';
		background: ${brandColors.giv[500]};
		position: absolute;
		left: 0;
		width: ${props => {
			switch (props.step) {
				case OnboardSteps.INFO:
					return '33.34%';
				case OnboardSteps.PHOTO:
					return '66.64%';
				case OnboardSteps.DONE:
					return '100%';
				default:
					return '0';
			}
		}};
		border-radius: 12px;
		height: 6px;
		transition: width 0.3s ease;
	}
`;

const OnboardProgressbarLabels = styled.div`
	display: grid;
	grid-template-columns: 1fr 2fr 2fr 1fr;
	grid-gap: 45px;
`;

interface IOnboardProgressbarLabel {
	status: LabelStatus;
}

const OnboardProgressbarLabel = styled(B)<IOnboardProgressbarLabel>`
	text-align: center;
	&:first-of-type {
		text-align: left;
	}
	&:last-of-type {
		text-align: right;
	}
	color: ${props => {
		switch (props.status) {
			case LabelStatus.PREV:
				return `${brandColors.deep[900]}66`;
			case LabelStatus.ACTIVE:
				return brandColors.giv[500];
			case LabelStatus.NEXT:
				return brandColors.deep[900];
			default:
				break;
		}
	}};
`;

const OnboardHeading = styled(H5)`
	text-align: center;
`;

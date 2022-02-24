import { B, brandColors, Container, H5 } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';
import DoneStep from './DoneStep';
import InfoStep from './InfoStep';
import PhotoStep from './PhotoStep';

const StatesLabel = [
	'Register on Giveth',
	'Who you are?',
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
	const [step, setStep] = useState(OnboardSteps.PHOTO);
	return (
		<OnboardViewContainer>
			<OnboardHeader step={step} />
			{step === OnboardSteps.INFO && <InfoStep setStep={setStep} />}
			{step === OnboardSteps.PHOTO && <PhotoStep setStep={setStep} />}
			{step === OnboardSteps.DONE && <DoneStep setStep={setStep} />}
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
		<OnboardHeaderConatiner>
			<H5 weight={700}>Complete your profile</H5>
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
		</OnboardHeaderConatiner>
	);
};

const OnboardViewContainer = styled(Container)`
	padding-top: 207px;
	padding-bottom: 68px;
`;

const OnboardHeaderConatiner = styled.div`
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
	}
`;

const OnboardProgressbarLabels = styled.div`
	display: grid;
	grid-template-columns: 1fr 2fr 2fr 1fr;
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

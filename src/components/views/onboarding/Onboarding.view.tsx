import { brandColors, Container, H5 } from '@giveth/ui-design-system';
import { FC, useState } from 'react';
import styled from 'styled-components';

export enum OnboardSteps {
	INFO,
	PHOTO,
	DONE,
}

const StatesLabel = [
	'Register on Giveth',
	'Who you are?',
	'Fancy profile photo',
	'Done',
];

const OnboardView = () => {
	const [step, setStep] = useState(OnboardSteps.INFO);
	return (
		<div>
			<OnboardHeader step={step} />
		</div>
	);
};

export default OnboardView;

interface IOnboardHeader {
	step: OnboardSteps;
}

const OnboardHeader: FC<IOnboardHeader> = ({ step }) => {
	return (
		<OnboardHeaderConatiner>
			<H5 weight={700}>Complete your profile</H5>
			<OnboardProgressbar step={step} />
			<OnboardProgressbarLabels>
				{StatesLabel.map((label, idx) => (
					<OnboardProgressbarLabel key={idx}>
						{label}
					</OnboardProgressbarLabel>
				))}
			</OnboardProgressbarLabels>
		</OnboardHeaderConatiner>
	);
};

const OnboardHeaderConatiner = styled(Container)`
	padding-top: 207px;
`;

const OnboardProgressbar = styled.div<IOnboardHeader>`
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

const OnboardProgressbarLabel = styled.div`
	text-align: center;
	&:first-of-type {
		text-align: left;
	}
	&:last-of-type {
		text-align: right;
	}
`;

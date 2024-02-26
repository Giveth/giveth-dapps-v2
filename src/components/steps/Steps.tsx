import {
	brandColors,
	neutralColors,
	P,
	SublineBold,
	Flex,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { type FC } from 'react';
import { useIntl } from 'react-intl';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

interface IStepsProps {
	steps: string[];
	activeStep: number;
}

export const Steps: FC<IStepsProps> = ({ steps, activeStep }) => {
	const { formatMessage } = useIntl();
	const theme = useAppSelector(state => state.general.theme);

	return (
		<StepsContainer $baseTheme={theme}>
			{steps.map((step, index) => (
				<Step key={index}>
					<StepTitle disable={index > activeStep} $baseTheme={theme}>
						{formatMessage({ id: step })}
					</StepTitle>
					<StepNumber disable={index > activeStep} $baseTheme={theme}>
						{index + 1}
					</StepNumber>
				</Step>
			))}
		</StepsContainer>
	);
};

const StepsContainer = styled(Flex)<{ $baseTheme?: ETheme }>`
	position: relative;
	justify-content: space-evenly;
	&::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 1px;
		border-top: 1px solid
			${props =>
				props.$baseTheme === ETheme.Dark
					? brandColors.giv[500]
					: brandColors.giv[100]};
		bottom: 11px;
		z-index: 0;
	}
	&::after {
		content: '';
		position: absolute;
		height: 1px;
		border-top: 1px dashed
			${props =>
				props.$baseTheme === ETheme.Dark
					? brandColors.giv[500]
					: brandColors.giv[100]};
		left: -24px;
		right: -24px;
		bottom: 11px;
		z-index: 0;
	}
	margin-bottom: 16px;
`;

const Step = styled(Flex)`
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 61px;
	position: relative;
	z-index: 1;
	user-select: none;
`;

interface IStepState {
	disable?: boolean;
	$baseTheme?: ETheme;
}

const StepTitle = styled(P)<IStepState>`
	margin-bottom: 8px;
	color: ${props =>
		props.disable
			? props.$baseTheme === ETheme.Dark
				? brandColors.giv[300]
				: brandColors.giv[200]
			: props.$baseTheme === ETheme.Dark
				? brandColors.giv['000']
				: brandColors.giv[500]};
`;
const StepNumber = styled(SublineBold)<IStepState>`
	color: ${props =>
		props.disable
			? props.$baseTheme === ETheme.Dark
				? brandColors.giv[200]
				: neutralColors.gray[100]
			: props.$baseTheme === ETheme.Dark
				? brandColors.giv['000']
				: neutralColors.gray[100]};
	background-color: ${props =>
		props.disable
			? props.$baseTheme === ETheme.Dark
				? brandColors.giv[500]
				: brandColors.giv[200]
			: brandColors.giv[500]};
	border: 3px solid
		${props =>
			props.disable
				? props.$baseTheme === ETheme.Dark
					? brandColors.giv[300]
					: brandColors.giv[100]
				: props.$baseTheme === ETheme.Dark
					? brandColors.giv['000']
					: brandColors.giv[100]};
	border-radius: 18px;
	width: 24px;
`;

const StepsPlaceholder = styled.div`
	padding: 13px;
`;

import Image from 'next/image';
import { FC } from 'react';
import Link from 'next/link';
import {
	Flex,
	FlexSpacer,
	mediaQueries,
	P,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useAppSelector } from '@/features/hooks';
import { ETheme } from '@/features/general/general.slice';

import { StyledHeader, Logo } from '@/components/Header/Header.sc';

export interface IHeader {
	steps: { label: string; step: number }[];
	currentStep?: number;
	setCurrentStep: (step: number) => void;
}

export const CreateCauseHeader: FC<IHeader> = ({
	steps,
	currentStep = 0,
	setCurrentStep,
}) => {
	const theme = useAppSelector(state => state.general.theme);

	return (
		<StyledHeader $alignItems='center' $baseTheme={theme} $show={true}>
			<BackButton>
				<Link href={'/'}>
					<Logo>
						<Image
							width='26'
							height='26'
							alt='Giveth logo'
							src={`/images/back-2.svg`}
						/>
					</Logo>
				</Link>
			</BackButton>
			<StepsNavigation $alignItems='center' gap='24px'>
				{steps.map((step, index) => (
					<StepLink
						key={index}
						$active={index + 1 === currentStep}
						$completed={index + 1 < currentStep}
						$baseTheme={theme}
						onClick={() => {
							if (index + 1 !== currentStep) {
								setCurrentStep(index + 1);
							}
						}}
					>
						<StepNumber
							$active={index + 1 === currentStep}
							$completed={index + 1 < currentStep}
							$baseTheme={theme}
						>
							{step.step}
						</StepNumber>
						<StepLabel
							$active={index + 1 === currentStep}
							$completed={index + 1 < currentStep}
							$baseTheme={theme}
						>
							{step.label}
						</StepLabel>
					</StepLink>
				))}
			</StepsNavigation>
			<StyledFlexSpacer />
		</StyledHeader>
	);
};

const BackButton = styled(Flex)`
	${mediaQueries.tablet} {
		display: flex;
	}
`;

const StyledFlexSpacer = styled(FlexSpacer)`
	${mediaQueries.tablet} {
		display: flex;
	}
`;

const StepsNavigation = styled(Flex)`
	display: flex;
	width: 100%;
	margin-left: 24px;
	flex-wrap: wrap;

	${mediaQueries.tablet} {
		justify-content: center;
		align-items: center;
	}
`;

interface IStepState {
	$active?: boolean;
	$completed?: boolean;
	$baseTheme?: ETheme;
}

const StepLink = styled(Flex)<IStepState>`
	flex-direction: row;
	align-items: center;
	gap: 8px;
	margin-right: 24px;
	cursor: pointer;
	transition: all 0.3s ease;
	opacity: ${props => (props.$active || props.$completed ? 1 : 0.6)};

	&:hover {
		opacity: 1;
	}
`;

const StepNumber = styled(Flex)<IStepState>`
	position: relative;
	width: 40px;
	height: 55px;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	font-weight: 500;

	&::before {
		content: '';
		position: absolute;
		left: 4px;
		right: 4px;
		top: 12px;
		bottom: 12px;
		background: ${props => {
			if (props.$completed || props.$active) {
				return '#5326ec';
			}
			return props.$baseTheme === ETheme.Dark
				? brandColors.giv[600]
				: brandColors.giv[100];
		}};
		border: 4px solid
			${props => {
				if (props.$completed || props.$active) {
					return '#e7e1ff';
				}
				return props.$baseTheme === ETheme.Dark
					? brandColors.giv[300]
					: brandColors.giv[200];
			}};
		border-radius: 50%;
		z-index: -1;
	}

	color: ${props => {
		if (props.$completed || props.$active) {
			return '#FFFFFF';
		}
		return props.$baseTheme === ETheme.Dark
			? brandColors.giv[200]
			: neutralColors.gray[600];
	}};
`;

const StepLabel = styled(P)<IStepState>`
	font-size: 16px;
	font-weight: 500;
	text-align: center;
	color: ${props => {
		if (props.$active || props.$completed) {
			return props.$baseTheme === ETheme.Dark
				? brandColors.giv['000']
				: brandColors.deep[600];
		}
		return props.$baseTheme === ETheme.Dark
			? brandColors.giv[300]
			: brandColors.giv[400];
	}};
`;

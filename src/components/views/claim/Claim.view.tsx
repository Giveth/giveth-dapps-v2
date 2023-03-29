import React, { FC } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import config from '@/configuration';
import ClaimCard from '@/components/views/claim/cards/Claim';
import { CongratulationsCard } from '@/components/views/claim/cards/Congratulations';
import { ConnectCard } from '@/components/views/claim/cards/Connect';
import { DonateCard } from '@/components/views/claim/cards/Donate';
import { StreamCard } from '@/components/views/claim/cards/Stream';
import GovernCard from '@/components/views/claim/cards/Govern';
import InvestCard from '@/components/views/claim/cards/Stake';
import { Flex } from '@/components/styled-components/Flex';
import useClaim, { GiveDropStateType } from '@/context/claim.context';

const stepsTitle = ['Connect', 'Donate', 'Govern', 'Stake', 'Stream', 'Claim'];

const Steps = styled(Flex)`
	height: 80px;
`;

interface IStepTitleProps {
	isActive: boolean;
	disabled?: boolean;
}

const StepTitle = styled.div<IStepTitleProps>`
	width: 104px;
	font-size: 14px;
	font-style: normal;
	font-weight: 400;
	line-height: 19px;
	color: #2fc8e0;
	opacity: ${props => (props.isActive ? 1 : 0.2)};
	position: relative;
	padding: 8px 0;
	margin: 4px;
	cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
	::before {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 0;
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background-color: #2fc8e0;
	}
`;

interface IStepProps {
	title: string;
	isActive: boolean;
	onClick: any;
	disabled: boolean;
}

const Step: FC<IStepProps> = ({ title, isActive, onClick, disabled }) => {
	return (
		<StepTitle
			isActive={isActive}
			onClick={disabled ? undefined : onClick}
			disabled={disabled}
		>
			{title}
		</StepTitle>
	);
};

interface ISwitchNetwork {
	hidden: boolean;
}

const SwitchNetwork = styled.div<ISwitchNetwork>`
	height: 48px;
	background-color: #e1458d;
	display: ${props => (props.hidden ? 'hidden' : 'flex')};
	justify-content: center;
	align-items: center;
	gap: 12px;
	position: fixed;
	width: 100%;
`;

const ButtonSwitchNetwork = styled.a`
	background: black;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	text-transform: uppercase;
	font-weight: bold;
	cursor: pointer;
`;

interface IClaimViewContainer {
	switchNetwork: boolean;
}

const ClaimViewContainer = styled.div<IClaimViewContainer>`
	background-image: url('/images/cardsbg1.png'), url('/images/cardsbg.png');
	background-repeat: repeat-x, no-repeat;
	background-position-y: bottom, top;
`;

const ClaimCarouselContainer = styled.div`
	overflow-x: hidden;
	position: relative;
	height: calc(100vh - 80px);
`;

export interface IClaimViewCardProps {
	index: number;
}

const ClaimView = () => {
	const { giveDropState, step, setStep } = useClaim();
	const { chainId } = useWeb3React();

	return (
		<>
			{step < 6 ? (
				<ClaimViewContainer
					switchNetwork={
						chainId === config.XDAI_NETWORK_NUMBER || chainId === 0
					}
				>
					<Steps justifyContent='center' alignItems='center'>
						{stepsTitle.map((title, idx) => (
							<Step
								title={title}
								isActive={step === idx}
								key={idx}
								onClick={() => {
									setStep(idx);
								}}
								disabled={
									giveDropState ===
										GiveDropStateType.Missed ||
									giveDropState ===
										GiveDropStateType.Claimed ||
									giveDropState ===
										GiveDropStateType.notConnected
								}
							/>
						))}
					</Steps>
					<ClaimCarouselContainer>
						<ConnectCard index={0} />
						<DonateCard index={1} />
						<GovernCard index={2} />
						<InvestCard index={3} />
						<StreamCard index={4} />
						<ClaimCard index={5} />
					</ClaimCarouselContainer>
				</ClaimViewContainer>
			) : (
				<CongratulationsCard />
			)}
		</>
	);
};

export default ClaimView;

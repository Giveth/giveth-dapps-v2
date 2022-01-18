import React, { FC, useContext, useState } from 'react';
import config from '@/configuration';
import styled from 'styled-components';
import { CongratulationsCard } from '../../cards/Congratulations';
import ClaimCard from '../../cards/Claim';
import { ConnectCard } from '../../cards/Connect';
import { DonateCard } from '../../cards/Donate';
import { StreamCard } from '../../cards/Stream';
import GovernCard from '../../cards/Govern';
import InvestCard from '../../cards/Stake';
import { Row } from '../../styled-components/Grid';
import { GiveDropStateType, UserContext } from '@/context/user.context';
import { useWeb3React } from '@web3-react/core';

const stepsTitle = ['Connect', 'Donate', 'Govern', 'Stake', 'Stream', 'Claim'];

const Steps = styled(Row)`
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
	const { giveDropState, step, setStep } = useContext(UserContext);
	const { chainId } = useWeb3React();

	return (
		<>
			{/* <SwitchNetwork
				hidden={
					(isReady && network === config.XDAI_NETWORK_NUMBER) ||
					network === 0
				}
			>
				<Image
					src='/images/icons/warning.svg'
					height='24'
					width='24'
					alt='Warning icon'
				/>
				<span>Please switch to xDAI network!</span>
				<ButtonSwitchNetwork
					onClick={() => switchNetwork(config.XDAI_NETWORK_NUMBER)}
				>
					Switch
				</ButtonSwitchNetwork>
			</SwitchNetwork> */}
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

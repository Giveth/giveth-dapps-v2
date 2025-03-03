import {
	IconPassport16,
	ButtonText,
	neutralColors,
	brandColors,
	FlexCenter,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { useIntl } from 'react-intl';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { EPassportState } from '@/hooks/usePassport';
import { Shadow } from './styled-components/Shadow';

interface IButtonProps {
	state: EPassportState | null;
	handleSign: () => Promise<void>;
	refreshScore: () => Promise<void>;
	className?: string;
}

export const PassportButton: FC<IButtonProps> = ({
	state,
	handleSign,
	refreshScore,
	className,
}) => {
	const { formatMessage } = useIntl();
	const { open: openConnectModal } = useWeb3Modal();

	return state === EPassportState.NOT_CONNECTED ? (
		<Button onClick={() => openConnectModal()} className={className}>
			<FlexCenter gap='8px'>
				<IconPassport16 />
				<ButtonText>
					{formatMessage({ id: 'label.connect_passport' })}
				</ButtonText>
			</FlexCenter>
		</Button>
	) : state === EPassportState.NOT_SIGNED ? (
		<Button onClick={() => handleSign()} className={className}>
			<FlexCenter gap='8px'>
				<IconPassport16 />
				<ButtonText>
					{formatMessage({ id: 'label.sign_message' })}
				</ButtonText>
			</FlexCenter>
		</Button>
	) : state === EPassportState.LOADING_SCORE ||
	  state === EPassportState.CONNECTING ? (
		<BaseButton className={className}>
			<FlexCenter gap='8px'>
				<IconPassport16 />
				<ButtonText>
					{formatMessage({ id: 'label.loading' })}
				</ButtonText>
				<LoadingContainer>
					<Loader />
				</LoadingContainer>
			</FlexCenter>
		</BaseButton>
	) : (
		<Button
			onClick={() => {
				refreshScore();
			}}
			className={className}
		>
			<FlexCenter gap='8px'>
				<IconPassport16 />
				<ButtonText>
					{formatMessage({ id: 'label.refresh_score' })}
				</ButtonText>
			</FlexCenter>
		</Button>
	);
};

const BaseButton = styled.button`
	padding: 16px 32px;
	background-color: ${neutralColors.gray[100]};
	border: none;
	border-radius: 48px;
	box-shadow: ${Shadow.Giv[400]};
	transition: color 0.2s ease-in-out;
	cursor: pointer;
`;

const Button = styled(BaseButton)`
	&:hover {
		color: ${neutralColors.gray[800]};
	}
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const LoadingContainer = styled.div`
	position: relative;
	transition: width 0.3s ease;
	width: 16px;
	height: 16px;
`;

const Loader = styled.div`
	border: 3px solid ${brandColors.giv[500]};
	border-radius: 50%;
	border-top: 3px solid white;
	width: 12px;
	height: 12px;
	animation: ${rotate} 1s ease infinite;
	position: absolute;
	top: 1px;
	left: 0;
`;

import {
	IconPassport16,
	ButtonText,
	neutralColors,
	brandColors,
} from '@giveth/ui-design-system';
import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { EPassportState } from '@/hooks/usePassport';
import { FlexCenter } from './styled-components/Flex';
import { Shadow } from './styled-components/Shadow';
import { useModalCallback, EModalEvents } from '@/hooks/useModalCallback';

interface IButtonProps {
	state: EPassportState;
	handleSign: () => Promise<void>;
	refreshScore: () => Promise<void>;
}

export const PassportButton: FC<IButtonProps> = ({
	state,
	handleSign,
	refreshScore,
}) => {
	const { modalCallback: connectThenSignIn } = useModalCallback(
		handleSign,
		EModalEvents.CONNECTED,
	);

	return state === EPassportState.NOT_CONNECTED ? (
		<Button onClick={() => connectThenSignIn()}>
			<FlexCenter gap='8px'>
				<IconPassport16 />
				<ButtonText>Connect passport</ButtonText>
			</FlexCenter>
		</Button>
	) : state === EPassportState.NOT_SIGNED ? (
		<Button onClick={() => handleSign()}>
			<FlexCenter gap='8px'>
				<IconPassport16 />
				<ButtonText>Sign Message</ButtonText>
			</FlexCenter>
		</Button>
	) : state === EPassportState.LOADING ? (
		<BaseButton>
			<FlexCenter gap='8px'>
				<IconPassport16 />
				<ButtonText>Loading</ButtonText>
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
		>
			<FlexCenter gap='8px'>
				<IconPassport16 />
				<ButtonText>Refresh score</ButtonText>
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

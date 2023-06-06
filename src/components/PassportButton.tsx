import {
	IconPassport16,
	ButtonText,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { usePassport, EPassportState } from '@/hooks/usePassport';
import { FlexCenter } from './styled-components/Flex';
import { Shadow } from './styled-components/Shadow';
import { useModalCallback, EModalEvents } from '@/hooks/useModalCallback';

export const PassportButton = () => {
	const { state, score, currentRound, handleSign, refreshScore } =
		usePassport();

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

import React from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import { Regular_Input } from '@/components/styled-components/Input';
import { InputContainer, TinyLabel } from './Create.sc';
import styled from 'styled-components';

const WalletAddressInput = (props: any) => {
	return (
		<>
			<H5>Receiving funds</H5>
			<div>
				<CaptionContainer>
					You can set a custom Ethereum address or ENS to receive
					donations.{' '}
				</CaptionContainer>
			</div>

			<InputContainer>
				<TinyLabel>Receiving address</TinyLabel>
				<Input placeholder='My Wallet Address' />
				<TinyLabel>
					This is the default wallet address associated with your
					account. You can choose a different receiving address.
				</TinyLabel>
			</InputContainer>
		</>
	);
};

const Input = styled(Regular_Input)``;

const CaptionContainer = styled(Caption)`
	height: 18px;
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

export default WalletAddressInput;

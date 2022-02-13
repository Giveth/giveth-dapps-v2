import React from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import {
	InputContainer,
	InputErrorMessage,
	InputWithError,
	TinyLabel,
} from './Create.sc';
import useUser from '@/context/UserProvider';
import { compareAddresses } from '@/lib/helpers';

const WalletAddressInput = (props: {
	value: string;
	setValue: (e: string) => void;
	error: string;
}) => {
	const { value, setValue, error } = props;

	const {
		state: { user },
	} = useUser();

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
				<InputWithError
					placeholder='My Wallet Address'
					onChange={e => setValue(e.target.value)}
					value={value}
					error={!!error}
				/>
				<InputErrorMessage>{error || null}</InputErrorMessage>
				{compareAddresses(value, user?.walletAddress) && (
					<TinyLabel>
						This is the default wallet address associated with your
						account. You can choose a different receiving address.
					</TinyLabel>
				)}
				<ChangeAddress onClick={() => setValue('')}>
					Change address
				</ChangeAddress>
			</InputContainer>
		</>
	);
};

const ChangeAddress = styled.div`
	color: ${brandColors.pinky[500]};
	font-size: 14px;
	margin-top: 16px;
	cursor: pointer;
`;

const CaptionContainer = styled(Caption)`
	height: 18px;
	margin: 8.5px 0 0 0;
	span {
		cursor: pointer;
		color: ${brandColors.pinky[500]};
	}
`;

export default WalletAddressInput;

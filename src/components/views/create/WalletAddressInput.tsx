import React, { useState } from 'react';
import { H5, Caption, brandColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

import { Regular_Input } from '@/components/styled-components/Input';
import { InputContainer, TinyLabel } from './Create.sc';

const WalletAddressInput = (props: {
	value: string;
	setValue: (e: string) => void;
}) => {
	const { value, setValue } = props;
	const [disabled, setDisabled] = useState(true);

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
				<Regular_Input
					placeholder='My Wallet Address'
					onChange={e => setValue(e.target.value)}
					value={value}
					disabled={disabled}
				/>
				<TinyLabel>
					This is the default wallet address associated with your
					account. You can choose a different receiving address.
				</TinyLabel>
				<ChangeAddress
					onClick={() => {
						setDisabled(false);
						setValue('');
					}}
				>
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

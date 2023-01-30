import { brandColors, P } from '@giveth/ui-design-system';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '../styled-components/Flex';

const MAX_NFT_AMOUNT = 1000;
const MIN_NFT_AMOUNT = 1;

export const MintCard = () => {
	const [amount, setAmount] = useState('1');
	function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
		//handle empty input
		if (event.target.value === '') setAmount('');

		//handle number
		const _amount = Number.parseInt(event.target.value);

		//handle range
		if (_amount > MAX_NFT_AMOUNT || _amount < MIN_NFT_AMOUNT) return;

		if (Number.isInteger(_amount)) setAmount('' + _amount);
	}

	return (
		<MintCardContainer>
			<Flex gap='16px'>
				<StyledInput
					as='input'
					type='number'
					value={amount}
					onChange={onChangeHandler}
				/>
			</Flex>
		</MintCardContainer>
	);
};

const MintCardContainer = styled.div`
	padding: 24px;
	background-color: ${brandColors.giv[800]};
	border-radius: 8px;
`;

const StyledInput = styled(P)`
	padding: 15px 16px;
	width: 100%;
	color: ${brandColors.giv[200]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	-moz-appearance: textfield;
`;

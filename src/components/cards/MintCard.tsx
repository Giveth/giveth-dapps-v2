import {
	brandColors,
	GLink,
	P,
	semanticColors,
} from '@giveth/ui-design-system';
import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { Flex } from '../styled-components/Flex';

const MAX_NFT_QTY = 5;
const MIN_NFT_QTY = 1;

export const MintCard = () => {
	const [qtyNFT, setQtyNFT] = useState('1');
	const mintedNFT = 20;
	function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
		//handle empty input
		if (event.target.value === '') setQtyNFT('');

		//handle number
		const _qty = Number.parseInt(event.target.value);

		//handle range
		if (_qty > MAX_NFT_QTY || _qty < MIN_NFT_QTY) return;

		if (Number.isInteger(_qty)) setQtyNFT('' + _qty);
	}

	return (
		<MintCardContainer>
			<Flex gap='16px' flexDirection='column'>
				<Flex justifyContent='space-between'>
					<GLink size='Small'>NFT Amount</GLink>
					<MaxLink
						size='Small'
						onClick={() => setQtyNFT('' + MAX_NFT_QTY)}
					>
						MAX
					</MaxLink>
				</Flex>
				<StyledInput
					as='input'
					type='number'
					value={qtyNFT}
					onChange={onChangeHandler}
				/>
				<InputHint>{mintedNFT}/1000 Minted</InputHint>
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

const MaxLink = styled(GLink)`
	color: ${semanticColors.blueSky[500]};
`;

const InputHint = styled(GLink)`
	color: ${brandColors.deep[100]};
`;

import {
	brandColors,
	Button,
	Container,
	H2,
	P,
	QuoteText,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

const CheckEligibility = () => {
	return (
		<SectionContainer>
			<H2>Early Minting has started!</H2>
			<br />
			<CustomQuote size='small'>
				Check here to verify your eligibility
			</CustomQuote>
			<StyledInput
				as='input'
				placeholder='Input your wallet address here'
			/>
			<CustomButton buttonType='primary' label='VERIFY' />
		</SectionContainer>
	);
};

const SectionContainer = styled(Container)`
	position: relative;
	z-index: 1;
`;

const StyledInput = styled(P)`
	padding: 15px 16px;
	width: 100%;
	color: ${brandColors.giv[200]};
	background-color: ${brandColors.giv[700]};
	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;
	margin-bottom: 38px;
	max-width: 440px;
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	-moz-appearance: textfield;
`;

const CustomQuote = styled(QuoteText)`
	margin-bottom: 14px;
	color: ${brandColors.giv[200]};
`;

const CustomButton = styled(Button)`
	width: 250px;
`;

export default CheckEligibility;

import { Button, Container, H2 } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import Input from '@/components/Input';

const CheckEligibility = () => {
	return (
		<SectionContainer>
			<H2>Early Minting has started!</H2>
			<br />
			<Input label='Check here to verify your eligibility' />
			<br />
			<Button buttonType='primary' label='VERIFY' />
		</SectionContainer>
	);
};

const SectionContainer = styled(Container)`
	position: relative;
	z-index: 1;
`;

export default CheckEligibility;

import { Button, Container, H2 } from '@giveth/ui-design-system';
import React from 'react';
import Input from '@/components/Input';

const CheckEligibility = () => {
	return (
		<Container>
			<H2>Early Minting has started!</H2>
			<br />
			<Input label='Check here to verify your eligibility' />
			<br />
			<Button buttonType='primary' label='VERIFY' />
		</Container>
	);
};

export default CheckEligibility;

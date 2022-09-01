import styled from 'styled-components';
import { useState } from 'react';
import Checkbox from '@/components/Checkbox';

const CheckboxEmailNotification = () => {
	const [emailNotification, setEmailNotification] = useState(false);
	const [dappNotification, setDappNotification] = useState(false);
	return (
		<Container>
			<Checkbox
				title='Send me email'
				checked={emailNotification}
				onChange={setEmailNotification}
			/>
			<Checkbox
				title='Dapp notification'
				checked={dappNotification}
				onChange={setDappNotification}
			/>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	gap: 16px;
	flex-direction: column;
`;

export default CheckboxEmailNotification;

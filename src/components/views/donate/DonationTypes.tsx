import React, { useState } from 'react';
import styled from 'styled-components';
import { H4 } from '@giveth/ui-design-system';

import CryptoDonation, {
	ISuccessDonation,
} from '@/components/views/donate/CryptoDonation';
import FiatDonation from '@/components/views/donate/FiatDonation';
import { IProject } from '@/apollo/types/types';
import RadioButton from '@/components/RadioButton';

const DonationTypes = (props: {
	project: IProject;
	setSuccess: (i: ISuccessDonation) => void;
}) => {
	const { project, setSuccess } = props;

	const [isCrypto, setIsCrypto] = useState(true);

	return (
		<>
			<H4 weight={700}>Donate With</H4>
			<RadioBox>
				<RadioButton
					title='Cryptocurrency'
					toggleRadio={() => setIsCrypto(true)}
					isSelected={isCrypto}
					subtitle='Zero Fees'
				/>
				<RadioButton
					title='Credit Card'
					toggleRadio={() => setIsCrypto(false)}
					isSelected={!isCrypto}
					subtitle='Bank Fees'
				/>
			</RadioBox>
			{isCrypto ? (
				<CryptoDonation
					project={project}
					setSuccessDonation={setSuccess}
				/>
			) : (
				<FiatDonation
					project={project}
					setSuccessDonation={setSuccess}
				/>
			)}
		</>
	);
};

const RadioBox = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 29px;
	flex-wrap: wrap;

	@media (max-width: 850px) {
		/* Very unique size issue */
		margin-bottom: 10px;
	}
`;

export default DonationTypes;

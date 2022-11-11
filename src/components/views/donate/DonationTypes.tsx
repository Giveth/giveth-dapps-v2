import React, { useState } from 'react';
import styled from 'styled-components';
import { H4 } from '@giveth/ui-design-system';

import { useIntl } from 'react-intl';
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
	const { formatMessage } = useIntl();
	const { project, setSuccess } = props;

	const [isCrypto, setIsCrypto] = useState(true);

	return (
		<>
			<H4 weight={700}>{formatMessage({ id: 'page.donate.title' })}</H4>
			<RadioBox>
				<RadioButton
					title={formatMessage({ id: 'label.cryptocurrency' })}
					toggleRadio={() => setIsCrypto(true)}
					isSelected={isCrypto}
					subtitle={formatMessage({ id: 'page.donate.zero_fees' })}
				/>
				<RadioButton
					title={formatMessage({ id: 'label.credit_card' })}
					toggleRadio={() => setIsCrypto(false)}
					isSelected={!isCrypto}
					subtitle={formatMessage({ id: 'page.donate.bank_fees' })}
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

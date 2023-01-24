import React, { useState } from 'react';
import styled from 'styled-components';
import { H4, neutralColors } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';

import CryptoDonation from '@/components/views/donate/CryptoDonation';
import FiatDonation from '@/components/views/donate/FiatDonation';
import RadioButton from '@/components/RadioButton';

const DonationTypes = () => {
	const { formatMessage } = useIntl();
	const [isCrypto, setIsCrypto] = useState(true);

	return (
		<>
			<H4 weight={700}>{formatMessage({ id: 'page.donate.title' })}</H4>
			<RadioBox>
				<RadioButton
					title={formatMessage({ id: 'label.cryptocurrency' })}
					toggleRadio={() => setIsCrypto(true)}
					isSelected={isCrypto}
					small
				/>
				<RadioButton
					title={formatMessage({ id: 'label.credit_card' })}
					toggleRadio={() => setIsCrypto(false)}
					isSelected={!isCrypto}
					small
				/>
			</RadioBox>
			<Break />
			{isCrypto ? <CryptoDonation /> : <FiatDonation />}
		</>
	);
};

const Break = styled.hr`
	border: 1px solid ${neutralColors.gray[400]};
`;

const RadioBox = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 32px;
	flex-wrap: wrap;
	max-width: 350px;
	gap: 10px;

	@media (max-width: 850px) {
		/* Very unique size issue */
		margin-bottom: 10px;
	}
`;

export default DonationTypes;

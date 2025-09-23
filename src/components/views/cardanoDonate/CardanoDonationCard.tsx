import { B, neutralColors, Flex } from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Shadow } from '@/components/styled-components/Shadow';
import { IProjectAcceptedToken } from '@/apollo/types/gqlTypes';
import CardanoCryptoDonation from '@/components/views/cardanoDonate/OneTime/CardanoOneTimeDonationCard';
import { useDonateData } from '@/context/donate.context';
import { cardanoAcceptedTokens } from './data';

export interface IDonationCardProps {
	chainId: number;
}

export const CardanoDonationCard: FC<IDonationCardProps> = () => {
	const { project } = useDonateData();
	const { formatMessage } = useIntl();

	const [acceptedTokens, setAcceptedTokens] =
		useState<IProjectAcceptedToken[]>();

	useEffect(() => {
		const cardanoTokens = cardanoAcceptedTokens;
		if (cardanoTokens) {
			setAcceptedTokens(cardanoTokens);
		}
	}, [project.id]);

	return (
		<DonationCardWrapper>
			<Title id='donation-visit'>
				{formatMessage({
					id: 'label.donate_to_this_project',
				})}{' '}
				with Cardano
			</Title>
			<TabWrapper>
				<CardanoCryptoDonation acceptedTokens={acceptedTokens} />
			</TabWrapper>
		</DonationCardWrapper>
	);
};

export const DonationCardWrapper = styled(Flex)`
	flex-direction: column;
	gap: 16px;
	padding: 24px;
	border-radius: 16px;
	background: ${neutralColors.gray[100]};
	box-shadow: ${Shadow.Neutral[400]};
	align-items: stretch;
	text-align: left;
`;

const Title = styled(B)`
	display: block;
	margin-bottom: 50px;
	color: ${neutralColors.gray[800]} !important;
	text-align: left;
`;

const TabWrapper = styled(Flex)`
	position: relative;
	flex-direction: column;
	gap: 16px;
	align-items: flex-start;
`;

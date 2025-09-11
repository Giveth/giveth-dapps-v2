import { B, neutralColors, Flex } from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { captureException } from '@sentry/nextjs';
import { Shadow } from '@/components/styled-components/Shadow';
import {
	ICauseAcceptedTokensGQL,
	IProjectAcceptedToken,
} from '@/apollo/types/gqlTypes';
import CauseCryptoDonation from './OneTime/CauseOneTimeDonationCard';
import { showToastError } from '@/lib/helpers';
import { CAUSE_ACCEPTED_TOKENS } from '@/apollo/gql/gqlProjects';
import { client } from '@/apollo/apolloClient';
import { useCauseDonateData } from '@/context/donate.cause.context';
import { DonationCardQFRounds } from '@/components/views/donate/DonationCardQFRounds/DonationCardQFRounds';

export interface IDonationCardProps {
	chainId: number;
}

export const CauseDonationCard: FC<IDonationCardProps> = ({ chainId }) => {
	const { project, setSelectedQFRound, selectedQFRound } =
		useCauseDonateData();
	const { formatMessage } = useIntl();

	const [acceptedTokens, setAcceptedTokens] =
		useState<IProjectAcceptedToken[]>();

	useEffect(() => {
		client
			.query({
				query: CAUSE_ACCEPTED_TOKENS,
				variables: {
					causeId: Number(project.id),
					networkId: chainId,
				},
				fetchPolicy: 'no-cache',
			})
			.then((res: ICauseAcceptedTokensGQL) => {
				setAcceptedTokens(res.data.getCauseAcceptTokens);
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'Crypto Donation UseEffect',
					},
				});
			});
	}, [chainId, project.id]);

	return (
		<DonationCardWrapper>
			<Title id='donation-visit'>
				{formatMessage({
					id: 'label.cause.donate_to_cause',
				})}
			</Title>
			<TabWrapper>
				<DonationCardQFRounds
					project={project}
					chainId={chainId || 0}
					selectedQFRound={selectedQFRound}
					setSelectedQFRound={setSelectedQFRound}
				/>
				<CauseCryptoDonation acceptedTokens={acceptedTokens} />
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
	color: ${neutralColors.gray[800]} !important;
	text-align: left;
`;

const TabWrapper = styled(Flex)`
	position: relative;
	flex-direction: column;
	gap: 16px;
	align-items: flex-start;
`;

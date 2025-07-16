import { B, P, neutralColors, Flex } from '@giveth/ui-design-system';
import React, { FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
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

export interface IDonationCardProps {
	chainId: number;
}

export const CauseDonationCard: FC<IDonationCardProps> = ({ chainId }) => {
	const { project } = useCauseDonateData();
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

const BaseTab = styled(P)`
	padding: 8px 12px;
	border-bottom: 1px solid;
	font-weight: 400;
	color: ${neutralColors.gray[700]};
	border-bottom-color: ${neutralColors.gray[300]};
	user-select: none;
`;

interface ITab {
	$selected?: boolean;
}

const Tab = styled(BaseTab)<ITab>`
	font-weight: 500 !important;
	display: flex;
	align-items: center;
	cursor: pointer;
	${props =>
		props.$selected &&
		css`
			font-weight: 500;
			color: ${neutralColors.gray[900]};
			border-bottom-color: ${neutralColors.gray[900]};
		`}
`;

const EmptyTab = styled.div`
	flex: 1;
	border-bottom: 1px solid ${neutralColors.gray[300]};
`;

const TabWrapper = styled(Flex)`
	position: relative;
	flex-direction: column;
	gap: 16px;
	align-items: flex-start;
`;

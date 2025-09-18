import {
	B,
	P,
	neutralColors,
	Flex,
	SublineBold,
	brandColors,
} from '@giveth/ui-design-system';
import React, { FC, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { isAddress } from 'viem';
import { captureException } from '@sentry/nextjs';
import Image from 'next/image';

import { useAccount } from 'wagmi';
import { Shadow } from '@/components/styled-components/Shadow';
import { RecurringDonationCard } from './Recurring/RecurringDonationCard';
import OneTimeDonationCard from '@/components/views/donate/OneTime/OneTimeDonationCard';
import config from '@/configuration';
import { useDonateData } from '@/context/donate.context';
import { ChainType } from '@/types/config';
import { QRDonationCard } from '@/components/views/donate/OneTime/SelectTokenModal/QRCodeDonation/QRDonationCard';
import { client } from '@/apollo/apolloClient';
import { PROJECT_ACCEPTED_TOKENS } from '@/apollo/gql/gqlProjects';
import { showToastError } from '@/lib/helpers';
import {
	IProjectAcceptedToken,
	IProjectAcceptedTokensGQL,
} from '@/apollo/types/gqlTypes';
import { DonationCardTabs } from '@/components/views/donate/DonationCardTabs';
import { DonationCardQFRounds } from '@/components/views/donate/DonationCardQFRounds/DonationCardQFRounds';

export enum ETabs {
	ONE_TIME = 'one-time',
	RECURRING = 'recurring',
}

export interface IDonationCardProps {
	showQRCode: boolean;
	setShowQRCode: (showQRCode: boolean) => void;
}

export const DonationCard: FC<IDonationCardProps> = ({
	showQRCode,
	setShowQRCode,
}) => {
	const router = useRouter();
	const { chainId } = useAccount();
	const [tab, setTab] = useState(
		router.query.tab === ETabs.RECURRING ? ETabs.RECURRING : ETabs.ONE_TIME,
	);
	const [isQRDonation, setIsQRDonation] = useState(
		router.query.chain === ChainType.STELLAR.toLowerCase(),
	);
	const {
		project,
		setSelectedQFRound,
		selectedQFRound,
		choosedModalRound,
		setChoosedModalRound,
	} = useDonateData();
	const { formatMessage } = useIntl();

	const { addresses, organization, id: projectId } = project;
	const hasOpAddress =
		addresses &&
		addresses.some(
			address =>
				address.chainType === ChainType.EVM &&
				address.networkId === config.OPTIMISM_NETWORK_NUMBER,
		);
	const hasBaseAddress =
		addresses &&
		addresses.some(
			address =>
				address.chainType === ChainType.EVM &&
				address.networkId === config.BASE_NETWORK_NUMBER,
		);
	const isOwnerOnEVM =
		project?.adminUser?.walletAddress &&
		isAddress(project.adminUser?.walletAddress);

	const [acceptedTokens, setAcceptedTokens] =
		useState<IProjectAcceptedToken[]>();
	const [qrAcceptedTokens, setQRAcceptedTokens] =
		useState<IProjectAcceptedToken[]>();

	const disableRecurringDonations = organization?.disableRecurringDonations;

	const hasStellarAddress = addresses?.some(
		address => address.chainType === ChainType.STELLAR,
	);

	const handleQRDonation = () => {
		setIsQRDonation(true);
		router.push(
			{
				query: {
					...router.query,
					chain: ChainType.STELLAR.toLowerCase(),
				},
			},
			undefined,
			{ shallow: true },
		);
	};

	useEffect(() => {
		client
			.query({
				query: PROJECT_ACCEPTED_TOKENS,
				variables: { projectId: Number(projectId) },
				fetchPolicy: 'no-cache',
			})
			.then((res: IProjectAcceptedTokensGQL) => {
				setAcceptedTokens(res.data.getProjectAcceptTokens);
				setQRAcceptedTokens(
					res.data.getProjectAcceptTokens.filter(
						token => token.isQR === true,
					),
				);
			})
			.catch((error: unknown) => {
				showToastError(error);
				captureException(error, {
					tags: {
						section: 'Crypto Donation UseEffect',
					},
				});
			});
	}, []);

	// Check if the 'tab' query parameter is not present in the URL and project 'hasOpAddress' is true.
	// If both conditions are met, set the active tab to 'RECURRING' using the setTab function.
	// This ensures that the 'RECURRING' tab is active by default if project has Op Address.
	//
	// this feature needs some more polish, commenting this out for now --mitch
	// useEffect(() => {
	// 	if (!router.query.tab && hasOpAddress && !isEndaomentProject) {
	// 		setTab(ETabs.RECURRING);
	// 	}
	// }, [router.query, hasOpAddress, isEndaomentProject]);

	return (
		<DonationCardHolder>
			<DonationCardTabs
				tab={tab}
				setTab={setTab}
				recurringEnabled={Boolean(
					!disableRecurringDonations &&
						(hasOpAddress || hasBaseAddress) &&
						isOwnerOnEVM,
				)}
			/>
			<DonationCardWrapper>
				{tab === ETabs.ONE_TIME && (
					<DonationCardQFRounds
						project={project}
						chainId={chainId || 0}
						selectedQFRound={selectedQFRound}
						setSelectedQFRound={setSelectedQFRound}
						choosedModalRound={choosedModalRound}
						setChoosedModalRound={setChoosedModalRound}
						isQRDonation={isQRDonation}
					/>
				)}
				{!isQRDonation ? (
					<>
						{tab === ETabs.ONE_TIME && (
							<Title id='donation-visit'>
								{formatMessage({
									id: 'label.qf.enter_dontation',
								})}
							</Title>
						)}
						<TabWrapper>
							{tab === ETabs.ONE_TIME && (
								<OneTimeDonationCard
									acceptedTokens={acceptedTokens}
								/>
							)}
							{tab === ETabs.RECURRING && (
								<RecurringDonationCard />
							)}
						</TabWrapper>
						{hasStellarAddress && (
							<QRToastLink onClick={handleQRDonation}>
								<Image
									src='/images/logo/stellar.svg'
									alt='stellar'
									width={24}
									height={24}
								/>
								{formatMessage({
									id: 'label.try_donating_with_stellar',
								})}
							</QRToastLink>
						)}
					</>
				) : (
					<QRDonationCard
						setIsQRDonation={setIsQRDonation}
						setShowQRCode={setShowQRCode}
						qrAcceptedTokens={qrAcceptedTokens || []}
						showQRCode={showQRCode}
					/>
				)}
			</DonationCardWrapper>
		</DonationCardHolder>
	);
};

const DonationCardHolder = styled(Flex)`
	flex-direction: column;
	margin-top: 16px;
`;

const QRToastLink = styled(SublineBold)`
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	padding-block: 8px;
	padding-left: 16px;
	margin-block: 16px;
	margin-top: 0;
	background-color: transparent;
	border: 1px solid ${neutralColors.gray[400]};
	color: ${brandColors.giv[500]} !important;
	border-radius: 8px;
	font-weight: 500 !important;
`;

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

import {
	B,
	P,
	neutralColors,
	Flex,
	FlexCenter,
} from '@giveth/ui-design-system';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { isAddress } from 'viem';
import { Shadow } from '@/components/styled-components/Shadow';
import { RecurringDonationCard } from './RecurringDonationCard';
import CryptoDonation from './CryptoDonation';
import config, { isRecurringActive } from '@/configuration';
import { useDonateData } from '@/context/donate.context';
import { ChainType } from '@/types/config';
import { IconWithTooltip } from '@/components/IconWithToolTip';

export enum ETabs {
	ONE_TIME = 'on-time',
	RECURRING = 'recurring',
}

export const DonationCard = () => {
	const router = useRouter();
	const [tab, setTab] = useState(
		router.query.tab === ETabs.RECURRING ? ETabs.RECURRING : ETabs.ONE_TIME,
	);
	const { project } = useDonateData();
	const { formatMessage } = useIntl();

	const { addresses } = project;
	const hasOpAddress =
		addresses &&
		addresses.some(
			address =>
				address.chainType === ChainType.EVM &&
				address.networkId === config.OPTIMISM_NETWORK_NUMBER,
		);

	const isOwnerOnEVM =
		project?.adminUser.walletAddress &&
		isAddress(project.adminUser.walletAddress);

	return (
		<DonationCardWrapper>
			<Title>
				{formatMessage({ id: 'label.how_do_you_want_to_donate' })}
			</Title>
			<Flex>
				<Tab
					$selected={tab === ETabs.ONE_TIME}
					onClick={() => {
						setTab(ETabs.ONE_TIME);
						router.push(
							{
								query: { ...router.query, tab: ETabs.ONE_TIME },
							},
							undefined,
							{ shallow: true },
						);
					}}
				>
					{formatMessage({
						id: 'label.one_time_donation',
					})}
				</Tab>
				{hasOpAddress && isOwnerOnEVM ? (
					<Tab
						$selected={tab === ETabs.RECURRING}
						onClick={() => {
							setTab(ETabs.RECURRING);
							router.push(
								{
									query: {
										...router.query,
										tab: ETabs.RECURRING,
									},
								},
								undefined,
								{ shallow: true },
							);
						}}
					>
						{formatMessage({
							id: 'label.recurring_donation',
						})}
					</Tab>
				) : (
					<IconWithTooltip
						icon={
							<BaseTab>
								{formatMessage({
									id: 'label.recurring_donation',
								})}
							</BaseTab>
						}
						direction='bottom'
					>
						<>
							{formatMessage({
								id: 'label.this_project_is_not_eligible_for_recurring_donations',
							})}
						</>
					</IconWithTooltip>
				)}
				<EmptyTab />
			</Flex>
			<TabWrapper>
				{tab === ETabs.ONE_TIME && <CryptoDonation />}
				{tab === ETabs.RECURRING &&
					(isRecurringActive ? (
						<RecurringDonationCard />
					) : (
						<FlexCenter>
							{formatMessage({
								id: 'label.this_feature_will_be_available_soon',
							})}
						</FlexCenter>
					))}
			</TabWrapper>
		</DonationCardWrapper>
	);
};

export const DonationCardWrapper = styled(Flex)`
	flex-direction: column;
	gap: 16px;
	padding: 24px;
	border-radius: 16px;
	align-items: flex-start;
	background: ${neutralColors.gray[100]};
	box-shadow: ${Shadow.Neutral[400]};
	align-items: stretch;
	height: 100%;
	text-align: left;
`;

const Title = styled(B)`
	color: ${neutralColors.gray[800]};
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

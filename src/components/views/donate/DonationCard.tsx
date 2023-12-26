import { B, P, neutralColors } from '@giveth/ui-design-system';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { RecurringDonationCard } from './RecurringDonationCard';
import CryptoDonation from './CryptoDonation';

export const isRecurringActive =
	process.env.NEXT_PUBLIC_RECURRING_DONATION === 'true';

enum ETabs {
	ONE_TIME,
	RECURRING,
}

const tabs = ['One-Time Donation', 'Recurring Donation'];

export const DonationCard = () => {
	const [tab, setTab] = useState(ETabs.RECURRING);
	return (
		<DonationCardWrapper>
			<Title>How do you want to donate?</Title>
			<Flex>
				{tabs.map((_tab, idx) => (
					<Tab
						key={idx}
						selected={idx === tab}
						onClick={() => setTab(idx)}
					>
						{_tab}
					</Tab>
				))}
				<EmptyTab />
			</Flex>
			<TabWrapper>
				{tab === ETabs.ONE_TIME && <CryptoDonation />}
				{tab === ETabs.RECURRING &&
					(isRecurringActive ? (
						<RecurringDonationCard />
					) : (
						<FlexCenter>
							This Feature is not available now
						</FlexCenter>
					))}
			</TabWrapper>
		</DonationCardWrapper>
	);
};

const DonationCardWrapper = styled(Flex)`
	flex-direction: column;
	gap: 16px;
	padding: 24px;
	border-radius: 16px;
	align-items: flex-start;
	background: ${neutralColors.gray[100]};
	box-shadow: ${Shadow.Neutral[400]};
	align-items: stretch;
`;

const Title = styled(B)`
	color: ${neutralColors.gray[800]};
	text-align: left;
`;

interface ITab {
	selected?: boolean;
}

const Tab = styled(P)<ITab>`
	padding: 8px 12px;
	border-bottom: 1px solid;
	cursor: pointer;
	${props =>
		props.selected
			? css`
					font-weight: 500;
					color: ${neutralColors.gray[900]};
					border-bottom-color: ${neutralColors.gray[900]};
				`
			: css`
					font-weight: 400;
					color: ${neutralColors.gray[700]};
					border-bottom-color: ${neutralColors.gray[300]};
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

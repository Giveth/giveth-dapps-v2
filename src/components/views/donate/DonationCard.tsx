import { B, P, neutralColors } from '@giveth/ui-design-system';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
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

const tabs = ['label.one_time_donation', 'label.recurring_donation'];

export const DonationCard = () => {
	const [tab, setTab] = useState(ETabs.ONE_TIME);
	const { formatMessage } = useIntl();
	return (
		<DonationCardWrapper>
			<Title>
				{formatMessage({ id: 'label.how_do_you_want_to_donate' })}
			</Title>
			<Flex>
				{tabs.map((_tab, idx) => (
					<Tab
						key={idx}
						selected={idx === tab}
						onClick={() => setTab(idx)}
					>
						{formatMessage({
							id: _tab,
						})}
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

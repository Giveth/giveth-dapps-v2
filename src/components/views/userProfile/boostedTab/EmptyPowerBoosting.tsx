import styled from 'styled-components';
import { ButtonLink, neutralColors, QuoteText } from '@giveth/ui-design-system';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { FC } from 'react';
import { FlexCenter } from '@/components/styled-components/Flex';
import Routes from '@/lib/constants/Routes';
import { useAppSelector } from '@/features/hooks';
import { SubgraphDataHelper } from '@/lib/subgraph/subgraphDataHelper';
interface IEmptyPowerBoosting {
	myAccount?: boolean;
}

export const EmptyPowerBoosting: FC<IEmptyPowerBoosting> = ({ myAccount }) => {
	const sdh = new SubgraphDataHelper(
		useAppSelector(state => state.subgraph.xDaiValues),
	);
	const givPower = sdh.getUserGIVPowerBalance();
	const { formatMessage } = useIntl();

	return (
		<EmptyPowerBoostingContainer direction='column'>
			{!myAccount ? (
				<Title size='small'>
					{formatMessage({
						id: 'label.this_user_hasnt_started_boosting_w_givpower_yet',
					})}
				</Title>
			) : givPower.balance === '0' ? (
				<>
					<Title size='small'>
						{formatMessage({
							id: 'label.you_dont_have_any_givpower_yet',
						})}
						<br />
						{formatMessage({
							id: 'label.stake_and_lock_giv_to_get_givpower_and_starting_boosting',
						})}
					</Title>
					<br />
					<Link href={Routes.GIVfarm}>
						<ButtonLink
							label={formatMessage({ id: 'label.get_givpower' })}
							size='small'
						/>
					</Link>
				</>
			) : (
				<>
					<Title size='small'>
						{formatMessage({
							id: 'label.you_havent_boosted_any_projects_yet',
						})}
						<br />
						{formatMessage({
							id: 'label.use_your_givpower_to_support_projects_you_love',
						})}
					</Title>
					<br />
					<Link href={Routes.Projects}>
						<ButtonLink
							label={formatMessage({
								id: 'label.go_to_projects',
							})}
							size='small'
						/>
					</Link>
				</>
			)}
		</EmptyPowerBoostingContainer>
	);
};

const EmptyPowerBoostingContainer = styled(FlexCenter)`
	height: 630px;
`;

const Title = styled(QuoteText)`
	text-align: center;
	color: ${neutralColors.gray[800]};
`;

import {
	brandColors,
	mediaQueries,
	Flex,
	H5,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import { FETCH_QF_ROUND_STATS } from '@/apollo/gql/gqlQF';
import { formatMonthDay, formatUSD, thousandsSeparator } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { hasRoundStarted } from '@/helpers/qf';
import { IQFRound } from '@/apollo/types/types';

export const ActiveQFRoundStats = ({ qfRound }: { qfRound?: IQFRound }) => {
	const { formatMessage } = useIntl();
	const { activeQFRound } = useAppSelector(state => state.general);

	const currentRound = qfRound || activeQFRound;

	const isRoundStarted = hasRoundStarted(currentRound);
	const {
		allocatedFundUSD,
		allocatedFundUSDPreferred,
		allocatedTokenSymbol,
		allocatedFund,
	} = currentRound || {};
	const { data } = useQuery(FETCH_QF_ROUND_STATS, {
		variables: { slug: currentRound?.slug },
	});

	return (
		<Wrapper>
			<InfoSection $started={isRoundStarted}>
				<ItemContainer>
					<ItemTitle weight={700}>
						{formatMessage({ id: 'label.matching_pool' })}
					</ItemTitle>
					<ItemValue weight={500}>
						{allocatedFundUSDPreferred && '$'}
						{thousandsSeparator(
							allocatedFundUSDPreferred
								? allocatedFundUSD
								: allocatedFund,
						) || ' --'}{' '}
						{!allocatedFundUSDPreferred && allocatedTokenSymbol}
					</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle weight={700}>
						{formatMessage({ id: 'label.donations' })}
					</ItemTitle>
					<ItemValue weight={500}>
						$
						{formatUSD(data?.qfRoundStats?.allDonationsUsdValue) ||
							' --'}
					</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle weight={700}>
						{formatMessage({
							id: 'label.number_of_donations',
						})}
					</ItemTitle>
					<ItemValue weight={500}>
						{data?.qfRoundStats?.donationsCount || '--'}
					</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle weight={700}>
						{currentRound?.beginDate && currentRound?.endDate
							? `${formatMonthDay(new Date(currentRound.beginDate))} - ${formatMonthDay(new Date(currentRound.endDate), { includeYear: true })}`
							: '--'}
					</ItemTitle>
				</ItemContainer>
			</InfoSection>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-top: 40px;
	border-radius: 16px;
	color: ${brandColors.deep[900]};
	text-align: left;
	position: relative;
	overflow: hidden;
`;

const InfoSection = styled(Flex)<{ $started: boolean }>`
	width: 100%;
	flex-direction: column;
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	gap: 16px;
	justify-content: space-between;
	align-items: center;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const ItemContainer = styled.div`
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	${mediaQueries.tablet} {
		width: auto;
		display: block;
	}
`;

const ItemTitle = styled(H5)`
	margin-bottom: 8px;
`;

const ItemValue = styled(H5)``;

import {
	brandColors,
	mediaQueries,
	Flex,
	H5,
	neutralColors,
	Caption,
	B,
} from '@giveth/ui-design-system';
import React from 'react';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import { FETCH_QF_ROUND_STATS } from '@/apollo/gql/gqlQF';
import { formatDate, formatUSD, thousandsSeparator } from '@/lib/helpers';
import { useAppSelector } from '@/features/hooks';
import { hasRoundStarted } from '@/helpers/qf';
import { QFHeader } from '@/components/views/archivedQFRounds/QFHeader';

export const ActiveQFRoundStats = () => {
	const { formatMessage } = useIntl();
	const { activeQFRound } = useAppSelector(state => state.general);

	const isRoundStarted = hasRoundStarted(activeQFRound);
	const {
		allocatedFundUSD,
		allocatedFundUSDPreferred,
		allocatedTokenSymbol,
		allocatedFund,
	} = activeQFRound || {};
	const { data } = useQuery(FETCH_QF_ROUND_STATS, {
		variables: { slug: activeQFRound?.slug },
	});

	return (
		<Wrapper>
			<TitleWrapper>
				<Title weight={700}>
					{activeQFRound?.name} <span>Metrics</span>
				</Title>
				<QFHeader />
			</TitleWrapper>
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
				{isRoundStarted && (
					<ItemContainer>
						<ItemTitle weight={700}>
							{formatMessage({ id: 'label.donations' })}
						</ItemTitle>
						<ItemValue weight={500}>
							$
							{formatUSD(
								data?.qfRoundStats?.allDonationsUsdValue,
							) || ' --'}
						</ItemValue>
					</ItemContainer>
				)}
				{isRoundStarted && (
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
				)}
				<Flex $flexDirection='column'>
					<Caption color={neutralColors.gray[700]}>
						Round start
					</Caption>
					<B>
						{activeQFRound?.endDate
							? formatDate(new Date(activeQFRound.beginDate))
							: '--'}
					</B>
					<Caption color={neutralColors.gray[700]}>Round end</Caption>
					<B>
						{activeQFRound?.endDate
							? formatDate(new Date(activeQFRound.endDate))
							: '--'}
					</B>
				</Flex>
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

const TitleWrapper = styled(Flex)`
	justify-content: space-between;

	span {
		color: ${neutralColors.gray[700]};
	}
`;

const Title = styled(H5)`
	margin-bottom: 40px;
`;

const InfoSection = styled(Flex)<{ $started: boolean }>`
	flex-direction: column;
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	gap: 16px;
	justify-content: space-between;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
	${props =>
		!props.$started &&
		css`
			justify-content: flex-start;
			gap: 64px;
			width: fit-content;
		`}
`;

const ItemContainer = styled.div``;

const ItemTitle = styled(H5)`
	margin-bottom: 8px;
`;

const ItemValue = styled(H5)``;

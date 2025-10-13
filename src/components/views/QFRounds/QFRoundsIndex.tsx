import {
	brandColors,
	Container,
	FlexCenter,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQFRoundsContext } from '@/context/qfrounds.context';
import useDetectDevice from '@/hooks/useDetectDevice';
import Routes from '@/lib/constants/Routes';
import {
	getQFRoundHubCardImage,
	useFetchLast3ArchivedQFRounds,
} from '@/lib/helpers/qfroundHelpers';
import { formatReadableDate } from '@/lib/helpers/dateHelpers';
import { PassportBanner } from '@/components/PassportBanner';
import { Spinner } from '@/components/Spinner';
import { QFRoundsBanner } from '@/components/views/QFRounds/QFRoundsBanner';
import QFRoundCard from '@/components/views/QFRounds/QFRoundCard';

const QFRoundsIndex = () => {
	const router = useRouter();
	const { qfRounds, loading } = useQFRoundsContext();
	const { formatMessage, locale } = useIntl();
	const { isMobile, isTablet } = useDetectDevice();
	const { data: last3ArchivedQFRounds } = useFetchLast3ArchivedQFRounds();

	// Redirect to the first QF round if there is only one
	useEffect(() => {
		if (qfRounds.length === 1 && !loading) {
			router.push(`/qf/${qfRounds[0].slug}`);
		} else if (qfRounds.length === 0 && !loading) {
			router.push(Routes.QFArchived);
		}
	}, [qfRounds, router, loading]);

	// SHow only active and not test rounds
	const filteredQFRounds = qfRounds.filter(round => {
		if (!round.isActive || !round.name) return false;
		const cleanName = round.name.trim().toLowerCase();
		return !cleanName.includes('test');
	});

	// Show only not test rounds from last 3 archived QF rounds
	let filteredLast3ArchivedQFRounds = last3ArchivedQFRounds?.filter(round => {
		if (!round.name) return false;
		const cleanName = round.name.trim().toLowerCase();
		return !cleanName.includes('test');
	});

	// Remove last archived QF round if it is the same as the last 3 archived QF rounds if there are 4 archived QF rounds
	if (filteredLast3ArchivedQFRounds?.length === 4) {
		filteredLast3ArchivedQFRounds = filteredLast3ArchivedQFRounds.slice(
			0,
			3,
		);
	}

	return (
		<>
			{loading && (
				<Loading>
					<Spinner />
				</Loading>
			)}
			<PassportBanner />
			<Wrapper>
				<QFRoundsBanner />
				<Title>{formatMessage({ id: 'label.qf.active_rounds' })}</Title>
				<QFRoundsWrapper>
					{filteredQFRounds &&
						filteredQFRounds.map(round => (
							<QFRoundCard
								key={round.id}
								layout={
									isTablet || isMobile
										? 'grid'
										: round.displaySize === 1
											? 'horizontal'
											: 'grid'
								}
								title={round.name}
								description={round.description}
								imageUrl={getQFRoundHubCardImage(round)}
								matchingPoolUsd={round.allocatedFundUSD}
								allocatedFundUSD={round.allocatedFundUSD}
								allocatedFundUSDPreferred={
									round.allocatedFundUSDPreferred
								}
								allocatedTokenSymbol={
									round.allocatedTokenSymbol
								}
								allocatedFund={round.allocatedFund}
								startDate={formatReadableDate(
									round.beginDate,
									locale,
									false,
								)}
								endDate={formatReadableDate(
									round.endDate,
									locale,
									false,
								)}
								linkUrl={`/qf/${round.slug}`}
							/>
						))}
				</QFRoundsWrapper>
				<ClosedHeader>
					<Title>
						{formatMessage({ id: 'label.qf.closed_rounds' })}
					</Title>
					<ArchivedRoundsLink href={Routes.QFArchived}>
						{formatMessage({ id: 'label.archived_rounds' })} →
					</ArchivedRoundsLink>
				</ClosedHeader>
				{filteredLast3ArchivedQFRounds && (
					<QFRoundsWrapper>
						{filteredLast3ArchivedQFRounds.map(round => (
							<QFRoundCard
								key={round.id}
								layout='grid'
								title={round.name}
								description={round.description}
								imageUrl={getQFRoundHubCardImage(round)}
								matchingPoolUsd={round.allocatedFundUSD}
								allocatedFundUSD={round.allocatedFundUSD}
								allocatedFundUSDPreferred={
									round.allocatedFundUSDPreferred
								}
								allocatedTokenSymbol={
									round.allocatedTokenSymbol
								}
								allocatedFund={round.allocatedFund}
								startDate={formatReadableDate(
									round.beginDate,
									locale,
									false,
								)}
								endDate={formatReadableDate(
									round.endDate,
									locale,
								)}
								linkUrl={`/qf-archive/${round.slug}`}
							/>
						))}
					</QFRoundsWrapper>
				)}
			</Wrapper>
		</>
	);
};

const Loading = styled(FlexCenter)`
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1000;
	height: 100%;
	width: 100%;
	background-color: gray;
	transition: opacity 0.3s ease-in-out;
	opacity: 0.9;
`;

const Wrapper = styled(Container)`
	${mediaQueries.tablet} {
		padding-top: 33px;
		padding-bottom: 33px;
	}
	${mediaQueries.laptopS} {
		padding-top: 40px;
		padding-bottom: 40px;
	}
`;

const Title = styled.h1`
	margin-top: 32px;
	font-size: 25px;
	font-weight: 700;
	color: ${neutralColors.gray[900]};
`;

const QFRoundsWrapper = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	gap: 32px;
	margin-top: 32px;
`;

const ClosedHeader = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const ArchivedRoundsLink = styled(Link)`
	background-color: transparent;
	color: white;
	padding: 12px 20px;
	text-decoration: none;
	font-weight: 700;
	font-size: 16px;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	transition: color 0.2s ease;
	color: ${brandColors.giv[500]};

	&:hover {
		opacity: 0.85;
		background-color: transparent;
		text-decoration: none;
	}
`;

export default QFRoundsIndex;

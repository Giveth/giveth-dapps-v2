// src/components/views/qfrounds/QFRoundsIndex.tsx

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
import { PassportBanner } from '@/components/PassportBanner';
import { Spinner } from '@/components/Spinner';
import { QFRoundsBanner } from '@/components/views/QFRounds/QFRoundsBanner';
import QFRoundCard from '@/components/views/QFRounds/QFRoundCard';
import useDetectDevice from '@/hooks/useDetectDevice';
import Routes from '@/lib/constants/Routes';
import {
	getQFRoundImage,
	useFetchLast3ArchivedQFRounds,
} from '@/lib/helpers/qfroundHelpers';
import { formatReadableDate } from '@/lib/helpers/dateHelpers';

const QFRoundsIndex = () => {
	const router = useRouter();
	const { qfRounds, loading } = useQFRoundsContext();
	const { formatMessage, locale } = useIntl();
	const { isMobile, isTablet } = useDetectDevice();
	const { data: last3ArchivedQFRounds } = useFetchLast3ArchivedQFRounds();

	// Redirect to the first QF round if there is only one
	useEffect(() => {
		if (qfRounds.length === 1) {
			router.push(`/qf/${qfRounds[0].slug}`);
		}
	}, [qfRounds, router]);

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
					{qfRounds &&
						qfRounds.map(round => (
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
								imageUrl={getQFRoundImage(
									round,
									isMobile || false,
								)}
								matchingPoolUsd={round.allocatedFundUSD}
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
				{last3ArchivedQFRounds && (
					<QFRoundsWrapper>
						{last3ArchivedQFRounds.map(round => (
							<QFRoundCard
								key={round.id}
								layout='grid'
								title={round.name}
								description={round.description}
								imageUrl={getQFRoundImage(
									round,
									isMobile || false,
								)}
								matchingPoolUsd={round.allocatedFundUSD}
								startDate={formatReadableDate(
									round.beginDate,
									locale,
									false,
								)}
								endDate={formatReadableDate(
									round.endDate,
									locale,
								)}
								linkUrl={`/qf/${round.slug}`}
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

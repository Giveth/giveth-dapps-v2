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
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { useQuery } from '@apollo/client';
import { FETCH_QF_ROUND_STATS } from '@/apollo/gql/gqlQF';
import { useProjectsContext } from '@/context/projects.context';
import { formatDate } from '@/lib/helpers';

export const ActiveQFRoundStats = () => {
	const { formatMessage } = useIntl();
	const { qfRounds } = useProjectsContext();
	const activeRound = qfRounds.find(round => round.isActive);
	const { data } = useQuery(FETCH_QF_ROUND_STATS, {
		variables: { slug: activeRound?.slug },
	});

	return (
		<Wrapper>
			<Title weight={700}>{activeRound?.name} Metrics</Title>
			<InfoSection>
				<ItemContainer>
					<ItemTitle weight={700}>
						{formatMessage({ id: 'label.matching_pool' })}
					</ItemTitle>
					<ItemValue weight={500}>
						${data?.qfRoundStats?.matchingPool || ' --'}
					</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle weight={700}>
						{formatMessage({ id: 'label.donations' })}
					</ItemTitle>
					<ItemValue weight={500}>
						${data?.qfRoundStats?.allDonationsUsdValue || ' --'}
					</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle weight={700}>
						{formatMessage({ id: 'label.number_of_unique_donors' })}
					</ItemTitle>
					<ItemValue weight={500}>
						{data?.qfRoundStats?.uniqueDonors || '--'}
					</ItemValue>
				</ItemContainer>
				<Flex $flexDirection='column'>
					<Caption color={neutralColors.gray[700]}>
						Round start
					</Caption>
					<B>
						{activeRound?.endDate
							? formatDate(new Date(activeRound.beginDate))
							: '--'}
					</B>
					<Caption color={neutralColors.gray[700]}>Round end</Caption>
					<B>
						{activeRound?.endDate
							? formatDate(new Date(activeRound.endDate))
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

const Title = styled(H5)`
	margin-bottom: 40px;
`;

const InfoSection = styled(Flex)`
	flex-direction: column;
	margin-top: 40px;
	padding: 24px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	gap: 16px;
	justify-content: space-between;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const ItemContainer = styled.div``;

const ItemTitle = styled(H5)`
	margin-bottom: 8px;
`;

const ItemValue = styled(H5)``;

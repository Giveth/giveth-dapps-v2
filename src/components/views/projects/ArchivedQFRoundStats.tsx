import {
	H3,
	H4,
	P,
	brandColors,
	mediaQueries,
	neutralColors,
	Flex,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { FETCH_QF_ROUND_STATS } from '@/apollo/gql/gqlQF';
import { formatUSD } from '@/lib/helpers';

export const ArchivedQFRoundStats = () => {
	const { formatMessage } = useIntl();
	const router = useRouter();
	const { data } = useQuery(FETCH_QF_ROUND_STATS, {
		variables: { slug: router.query.slug },
	});

	return (
		<Wrapper>
			<Smile src='/images/arc3.svg' width={70} height={100} alt='arc' />
			<Plus src='/images/plus.svg' width={30} height={30} alt='arc' />
			<Arc src='/images/arc.svg' width={30} height={30} alt='arc' />
			<H3 weight={700}>Round Stats</H3>
			<InfoSection>
				<ItemContainer>
					<ItemTitle>
						{formatMessage({ id: 'label.matching_pool' })}
					</ItemTitle>
					<ItemValue>
						${data?.qfRoundStats?.matchingPool || ' --'}
					</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle>
						{formatMessage({ id: 'label.donations' })}
					</ItemTitle>
					<ItemValue>
						$
						{formatUSD(data?.qfRoundStats?.allDonationsUsdValue) ||
							' --'}
					</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle>
						{formatMessage({ id: 'label.number_of_unique_donors' })}
					</ItemTitle>
					<ItemValue>
						{data?.qfRoundStats?.uniqueDonors || '--'}
					</ItemValue>
				</ItemContainer>
			</InfoSection>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	margin-top: 40px;
	padding: 40px;
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	color: ${brandColors.giv[500]};
	text-align: center;
	position: relative;
	overflow: hidden;
`;

const InfoSection = styled(Flex)`
	flex-direction: column;
	margin-top: 40px;
	padding: 40px;
	background-color: ${brandColors.giv[100]};
	border-radius: 16px;
	gap: 16px;
	justify-content: space-around;
	${mediaQueries.tablet} {
		flex-direction: row;
	}
`;

const ItemContainer = styled.div``;

const ItemTitle = styled(P)``;

const ItemValue = styled(H4)``;

const BaseImage = styled(Image)`
	position: absolute;
`;

const Smile = styled(BaseImage)`
	right: -20px;
`;

const Plus = styled(BaseImage)`
	top: 20px;
	left: 30%;
`;

const Arc = styled(BaseImage)`
	top: 60px;
	left: 6%;
`;

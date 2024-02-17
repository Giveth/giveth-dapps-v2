import {
	H3,
	H4,
	P,
	brandColors,
	mediaQueries,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export const QFRoundStats = () => {
	return (
		<Wrapper>
			<H3 weight={700}>Round Stats</H3>
			<InfoSection>
				<ItemContainer>
					<ItemTitle>Matching Pool</ItemTitle>
					<ItemValue>25,000 DAI</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle>Donations</ItemTitle>
					<ItemValue>$190,854</ItemValue>
				</ItemContainer>
				<ItemContainer>
					<ItemTitle># of unique donors</ItemTitle>
					<ItemValue>19,702</ItemValue>
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

import { H3, brandColors, neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export const QFRoundStats = () => {
	return (
		<Wrapper>
			<H3 weight={700}>Round Stats</H3>
			<InfoSection></InfoSection>
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
	margin-top: 40px;
	padding: 40px;
	background-color: ${brandColors.giv[100]};
	border-radius: 16px;
`;

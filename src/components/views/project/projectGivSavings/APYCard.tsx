import { B, H4, IconSpark24, Lead } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export const APYCard = () => {
	return (
		<Wrapper>
			<H4 weight={700}>4.52%</H4>
			<Subtitle gap='8px'>
				<IconSpark24 />
				<B>Current APY</B>
			</Subtitle>
			<Lead>
				This is the Annual Percentage Yield for this GIVsavings account,
				please be aware that APY will fluctuate over time.
			</Lead>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 24px;
`;

const Subtitle = styled(Flex)`
	margin: 8px 0 24px;
`;

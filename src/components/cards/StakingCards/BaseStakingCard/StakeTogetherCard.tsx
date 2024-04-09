import { Flex, brandColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

export const StakeTogetherCard = () => {
	return <Wrapper>StakeTogether</Wrapper>;
};

const Wrapper = styled(Flex)`
	flex-direction: column;
	padding: 24px;
	align-items: flex-start;
	gap: 16px;
	border-radius: 8px;
	background-color: ${brandColors.giv[800]};
`;

import { brandColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

export const MintCard = () => {
	return <MintCardContainer>MintCard</MintCardContainer>;
};

const MintCardContainer = styled.div`
	padding: 24px;
	background-color: ${brandColors.giv[800]};
	border-radius: 8px;
`;

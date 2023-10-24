import { B, neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';

export const DonationCard = () => {
	return (
		<DonationCardWrapper>
			<Title>How do you want to donate?</Title>
		</DonationCardWrapper>
	);
};

const DonationCardWrapper = styled.div`
	padding: 24px;
	border-radius: 16px;
	background: ${neutralColors.gray[100]};
	box-shadow: ${Shadow.Neutral[400]};
`;

const Title = styled(B)`
	color: ${neutralColors.gray[800]};
	text-align: left;
`;

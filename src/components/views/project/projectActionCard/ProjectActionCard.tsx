import { neutralColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import { DonateSection } from './DonationSection';

export const ProjectActionCard = () => {
	return (
		<ProjectActionCardWrapper>
			<DonateSection />
		</ProjectActionCardWrapper>
	);
};

const ProjectActionCardWrapper = styled.div`
	background-color: ${neutralColors.gray[100]};
	border-radius: 16px;
	height: 100%;
	padding: 32px 24px 24px;
`;

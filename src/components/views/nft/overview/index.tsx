import React from 'react';
import styled from 'styled-components';
import { OvalHorizontalGradient, OvalVerticalGradient } from '../common.styles';

const OverviewIndex = () => {
	return (
		<OverviewContainer>
			<OvalVerticalGradient />
			<OvalHorizontalGradient />
		</OverviewContainer>
	);
};

const OverviewContainer = styled.div`
	height: 1000px;
	position: relative;
`;

export default OverviewIndex;

import React from 'react';
import styled from 'styled-components';
import { OvalVerticalGradient, OvalHorizontalGradient } from '../common.styles';

export const NFTMintIndex = () => {
	return (
		<MintViewContainer>
			<OvalVerticalGradient />
			<OvalHorizontalGradient />
		</MintViewContainer>
	);
};

const MintViewContainer = styled.div`
	height: 100vh;
	position: relative;
`;

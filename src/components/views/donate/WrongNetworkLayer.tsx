import React from 'react';
import styled from 'styled-components';
import { FlexCenter } from '@/components/styled-components/Flex';

export const WrongNetworkLayer = () => {
	return <Wrapper></Wrapper>;
};

const Wrapper = styled(FlexCenter)`
	position: absolute;
	z-index: 100;
	width: 100%;
	height: 100%;
	background-color: rgba(255, 255, 255, 0.7);
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	backdrop-filter: blur(2px);
`;

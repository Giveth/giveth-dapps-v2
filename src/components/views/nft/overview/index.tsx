import React from 'react';
import styled from 'styled-components';
import SayHelloSection from './SayHello';
import WhatElse from './WhatElse';

const OverviewIndex = () => {
	return (
		<div>
			<SayHelloSection />
			<Separator />
			<WhatElse />
		</div>
	);
};

const Separator = styled.div`
	width: 100%;
	height: 40px;
`;

export default OverviewIndex;

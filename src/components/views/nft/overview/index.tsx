import React from 'react';
import styled from 'styled-components';
import SayHelloSection from './SayHello';
import WhatAreGivers from './WhatAreGivers';
import WhatElse from './WhatElse';

const OverviewIndex = () => {
	return (
		<div>
			<SayHelloSection />
			<Separator />
			<WhatAreGivers />
			<Separator />
			<WhatElse />
			<Separator />
			<Separator />
			<Separator />
			<Separator />
		</div>
	);
};

const Separator = styled.div`
	width: 100%;
	height: 40px;
`;

export default OverviewIndex;

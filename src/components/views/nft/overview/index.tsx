import React from 'react';
import styled from 'styled-components';
import CheckEligibility from './CheckEligibility';
import SayHelloSection from './SayHello';
import WhatAreGivers from './WhatAreGivers';
import WhatElse from './WhatElse';

function isAfterDate(): boolean {
	const targetDate = new Date('2023-03-24T11:00:00-06:00'); // 24th March 2023, 11am CST
	const currentDate = new Date();

	return currentDate.getTime() > targetDate.getTime();
}

const OverviewIndex = () => {
	console.log('isAfterDate', isAfterDate());
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
			{!isAfterDate() && <CheckEligibility />}
		</div>
	);
};

const Separator = styled.div`
	width: 100%;
	height: 40px;
`;

export default OverviewIndex;

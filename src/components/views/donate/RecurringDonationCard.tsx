import {
	Caption,
	H6,
	brandColors,
	neutralColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

export const RecurringDonationCard = () => {
	return (
		<>
			<Title weight={700}>
				Make a recurring donation with{' '}
				<a href='https://www.superfluid.finance/' target='_blank'>
					SuperFluid
				</a>
			</Title>
			<Desc>
				Provide continuous funding by streaming your donations over
				time.
			</Desc>
		</>
	);
};

const Title = styled(H6)`
	& > a {
		color: ${brandColors.pinky[500]};
	}
`;

const Desc = styled(Caption)`
	background-color: ${neutralColors.gray[200]};
	padding: 8px;
	width: 100%;
	text-align: left;
`;

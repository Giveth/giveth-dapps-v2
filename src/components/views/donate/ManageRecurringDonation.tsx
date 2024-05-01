import { H5, P, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export const ManageRecurringDonation = () => {
	return (
		<Box>
			<H5 weight={700}>Managing your recurring donations</H5>
			<br />
			<P>
				You can modify or delete your recurring donation as well as
				top-up funds to your stream balance from the 
				<Link href={'/'}>Recurring Donations page</Link> .
			</P>
			<P>
				To learn more about how recurring donations work, visit our{' '}
				<Link href={'/'}>documentation article</Link> .
			</P>
		</Box>
	);
};

const Box = styled.div`
	padding: 16px;
	border-radius: 12px;
	border: 1px solid ${brandColors.giv[200]};
	a {
		color: ${brandColors.pinky[500]};
		&:hover {
			color: ${brandColors.pinky[600]};
		}
	}
`;

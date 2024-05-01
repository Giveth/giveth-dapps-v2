import { H5, P, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';

export const ManageRecurringDonation = () => {
	return (
		<Box>
			<Title weight={700}>Managing your recurring donations</Title>
			<br />
			<P>
				You can modify or delete your recurring donation as well as
				top-up funds to your stream balance from the 
				<Link href={Routes.MyRecurringDonations}>
					Recurring Donations page
				</Link>
				.
			</P>
			<P>
				To learn more about how recurring donations work, visit our{' '}
				<a href={links.RECURRING_DONATION_DOCS} target='_blank'>
					documentation article
				</a>
				 .
			</P>
		</Box>
	);
};

const Title = styled(H5)`
	color: ${brandColors.deep[800]};
`;

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

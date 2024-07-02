import { H5, P, brandColors } from '@giveth/ui-design-system';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import React from 'react';
import styled from 'styled-components';
import Routes from '@/lib/constants/Routes';
import links from '@/lib/constants/links';

export const ManageRecurringDonation = () => {
	const { formatMessage } = useIntl();
	return (
		<Box>
			<Title weight={700}>
				{formatMessage({
					id: 'label.managing_your_recurring_donations',
				})}
			</Title>
			<br />
			<P>
				{formatMessage({
					id: 'label.successfull_recurring_donation_1',
				})}
				<Link href={Routes.MyRecurringDonations}>
					{formatMessage({
						id: 'label.recurring_dontion_page',
					})}
				</Link>
				.
			</P>
			<P>
				{formatMessage({
					id: 'label.successfull_recurring_donation_2',
				})}{' '}
				<a href={links.RECURRING_DONATION_DOCS} target='_blank'>
					{formatMessage({ id: 'label.documentation' })}
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

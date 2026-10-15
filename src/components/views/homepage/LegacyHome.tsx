import Link from 'next/link';
import styled from 'styled-components';
import {
	Container,
	H1,
	Lead,
	ButtonLink,
	OutlineLinkButton,
	brandColors,
	Flex,
} from '@giveth/ui-design-system';
import Routes from '@/lib/constants/Routes';
import { NEW_GIVETH_URL } from '@/lib/legacy';

export default function LegacyHome() {
	return (
		<Wrapper>
			<H1>This is Giveth&apos;s legacy app</H1>
			<Lead>
				Giveth has moved to a new home at{' '}
				<a href={NEW_GIVETH_URL}>giveth.io</a>. Projects, donations,
				GIVbacks and everything else now live there.
			</Lead>
			<Lead>
				This app stays open for one thing: recurring donations. If you
				set one up here, you can still manage it. If your project
				received them here, you can still claim them.
			</Lead>
			<Actions gap='16px' $flexWrap>
				<ButtonLink
					isExternal
					href={NEW_GIVETH_URL}
					linkType='primary'
					label='Go to giveth.io'
				/>
				<Link href={Routes.MyRecurringDonations}>
					<AccountButton
						linkType='secondary'
						label='Manage my recurring donations'
					/>
				</Link>
				<Link href={Routes.MyProjects}>
					<AccountButton
						linkType='secondary'
						label='Claim recurring donations'
					/>
				</Link>
			</Actions>
		</Wrapper>
	);
}

const Wrapper = styled(Container)`
	padding-top: 160px;
	padding-bottom: 100px;
	max-width: 960px;
	> * + * {
		margin-top: 32px;
	}
	a {
		text-decoration: underline;
	}
`;

// Outline button in the brand purple; the design system only ships white or pink outlines.
const AccountButton = styled(OutlineLinkButton)`
	color: ${brandColors.giv[500]};
	border-color: ${brandColors.giv[500]};
	&:hover {
		color: ${brandColors.giv[700]};
		border-color: ${brandColors.giv[700]};
		background-color: ${brandColors.giv[100]};
	}
`;

const Actions = styled(Flex)`
	a {
		text-decoration: none;
	}
`;

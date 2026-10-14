import Link from 'next/link';
import styled from 'styled-components';
import {
	Container,
	H1,
	Lead,
	ButtonLink,
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
				This app stays open for one thing: recurring donation streams.
				Donors can manage the streams they set up here, and project
				owners can claim the funds their projects received.
			</Lead>
			<Actions gap='16px' $flexWrap>
				<ButtonLink
					isExternal
					href={NEW_GIVETH_URL}
					linkType='primary'
					label='Go to the new Giveth'
				/>
				<Link href={Routes.MyRecurringDonations}>
					<ButtonLink
						linkType='secondary'
						label='Manage my streams'
					/>
				</Link>
				<Link href={Routes.MyProjects}>
					<ButtonLink
						linkType='secondary'
						label='Claim project funds'
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

const Actions = styled(Flex)`
	a {
		text-decoration: none;
	}
`;

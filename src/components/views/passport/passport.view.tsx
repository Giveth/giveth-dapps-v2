import {
	Container,
	H2,
	IconExternalLink16,
	Lead,
	brandColors,
} from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';
import ExternalLink from '@/components/ExternalLink';
import { FlexCenter } from '@/components/styled-components/Flex';

export const PassportView = () => {
	return (
		<Container>
			<Wrapper>
				<Title>Amplify your donation</Title>
				<Lead>
					Unlock matching for your donation by verifying your
					identity! Connect your wallet to Gitcoin Passport to check
					your identity score and maximize your donation power.
					Passport is designed to proactively verify users’ identities
					to protect against Sybil attacks.
				</Lead>
				<PassportLink>
					<ExternalLink href='/' title='Learn more' />
					<IconExternalLink16 />
				</PassportLink>
			</Wrapper>
		</Container>
	);
};

const Wrapper = styled.div`
	padding: 80px 0;
	text-align: center;
`;

const Title = styled(H2)`
	margin-bottom: 40px;
`;

const PassportLink = styled(FlexCenter)`
	margin-top: 16px;
	margin-bottom: 60px;
	color: ${brandColors.giv[500]};
	gap: 4px;
`;

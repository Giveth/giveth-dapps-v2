import React from 'react';
import styled from 'styled-components';
import { B, Caption } from '@giveth/ui-design-system';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';
import links from '@/lib/constants/links';

// this should show conditionally if the user is withdrawing an amount that will make their stream balance < 1 month.
export const ModifyWarningToast = () => {
	return (
		<InfoToast message={<Message />} type={EToastType.Warning}></InfoToast>
	);
};

const Message = () => (
	<Wrapper>
		<Caption>
			Withdrawing a large portion of your streamable token balance will
			dramatically affect when your active recurring donations in that
			token will end.
		</Caption>{' '}
		<B>
			<a
				href={links.RECURRING_DONATION_DOCS}
				target='noreferrer noopener'
			>
				Learn more
			</a>
		</B>
	</Wrapper>
);

const InfoToast = styled(InlineToast)`
	margin: 0px;
`;

const Wrapper = styled.div`
	& > * {
		display: inline;
	}
`;

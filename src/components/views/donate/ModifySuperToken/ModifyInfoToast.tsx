import React from 'react';
import styled from 'styled-components';
import { B, Caption } from '@giveth/ui-design-system';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

export const ModifyInfoToast = () => {
	return <InfoToast message={<Message />} type={EToastType.Info}></InfoToast>;
};

const Message = () => (
	<Wrapper>
		<Caption>
			Depositing or withdrawing tokens from your stream balance will
			affect how quickly it runs out.
		</Caption>{' '}
		<B>Learn more</B>
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

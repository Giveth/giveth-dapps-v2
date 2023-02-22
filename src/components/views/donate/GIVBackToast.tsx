import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

const GIVBackToast = (props: {
	projectEligible?: boolean;
	tokenEligible?: boolean;
	userEligible?: boolean;
}) => {
	const { projectEligible, tokenEligible, userEligible } = props;
	const { formatMessage } = useIntl();
	let message: JSX.Element | string,
		type = EToastType.Warning;
	if (!userEligible) {
		message = formatMessage({
			id: 'label.your_current_wallet_is_associated_with_a_giveth_project',
		});
	} else if (!tokenEligible) {
		message = (
			<>
				{formatMessage({
					id: 'label.this_token_is_not_eligible.desc',
				})}{' '}
				<ExternalLink
					href={links.GIVBACK_TOKENS_FORUM}
					title={formatMessage({ id: 'label.our_forum' })}
				/>
				.
			</>
		);
	} else if (tokenEligible && projectEligible) {
		type = EToastType.Hint;
		message = formatMessage({ id: 'label.this_token_is_eligible' });
	} else {
		return null;
	}

	return (
		<ToastContainer>
			<InlineToast
				noIcon
				type={type}
				message={message}
				link={links.GIVBACK_DOC}
			/>
		</ToastContainer>
	);
};

const ToastContainer = styled.div`
	margin: 12px 0;
`;

export default GIVBackToast;

import React from 'react';
import styled from 'styled-components';

import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';
import InlineToast, { EToastType } from '@/components/toasts/InlineToast';

const GIVBackToast = (props: {
	projectEligible?: boolean;
	tokenEligible?: boolean;
	userEligible?: boolean;
}) => {
	const { projectEligible, tokenEligible, userEligible } = props;
	let message: JSX.Element | string,
		type = EToastType.Warning;
	if (!userEligible) {
		message =
			'Your currently connected wallet address is associated with a Giveth project, therefore donations made from this address are not eligible for GIVbacks.';
	} else if (!projectEligible) {
		message = 'This project is not eligible for GIVbacks.';
	} else if (tokenEligible) {
		type = EToastType.Hint;
		message = 'This token is eligible for GIVbacks.';
	} else {
		message = (
			<>
				This token is not eligible for GIVbacks. To create a request to
				add this token to our GIVbacks token list, please make a comment
				in{' '}
				<ExternalLink
					href={links.GIVBACK_TOKENS_FORUM}
					title='our forum'
				/>
				.
			</>
		);
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

import { brandColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

import FixedToast from '@/components/toasts/FixedToast';
import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';

const GIVBackToast = (props: {
	projectEligible?: boolean;
	tokenEligible?: boolean;
	userEligible?: boolean;
}) => {
	const { projectEligible, tokenEligible, userEligible } = props;
	let message,
		color = brandColors.mustard[700],
		boldColor = brandColors.mustard[800],
		backgroundColor = brandColors.mustard[200];

	if (!userEligible) {
		message =
			'Your currently connected wallet address is associated with a Giveth project, therefore donations made from this address are not eligible for GIVbacks.';
	} else if (!projectEligible) {
		message = 'This project is not eligible for GIVbacks.';
	} else if (tokenEligible) {
		message = 'This token is eligible for GIVbacks.';
		color = brandColors.giv[300];
		boldColor = brandColors.giv[600];
		backgroundColor = brandColors.giv[100];
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
			<FixedToast
				message={message}
				color={color}
				boldColor={boldColor}
				backgroundColor={backgroundColor}
				href={links.GIVBACK_DOC}
			/>
		</ToastContainer>
	);
};

const ToastContainer = styled.div`
	margin: 12px 0;
`;

export default GIVBackToast;

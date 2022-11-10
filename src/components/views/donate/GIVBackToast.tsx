import { brandColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

import { useIntl } from 'react-intl';
import FixedToast from '@/components/toasts/FixedToast';
import links from '@/lib/constants/links';
import ExternalLink from '@/components/ExternalLink';

const GIVBackToast = (props: {
	projectEligible?: boolean;
	tokenEligible?: boolean;
	userEligible?: boolean;
}) => {
	const { projectEligible, tokenEligible, userEligible } = props;
	const { formatMessage } = useIntl();
	let message,
		color = brandColors.mustard[700],
		boldColor = brandColors.mustard[800],
		backgroundColor = brandColors.mustard[200];

	if (!userEligible) {
		message = formatMessage({
			id: 'label.your_current_wallet_is_associated_with_a_giveth_project',
		});
	} else if (!projectEligible) {
		message = formatMessage({ id: 'label.this_project_is_not_eligible' });
	} else if (tokenEligible) {
		message = formatMessage({ id: 'label.this_token_is_eligible' });
		color = brandColors.giv[300];
		boldColor = brandColors.giv[600];
		backgroundColor = brandColors.giv[100];
	} else {
		message = (
			<>
				{formatMessage({
					id: 'label.this_project_is_not_eligible.desc',
				})}{' '}
				<ExternalLink
					href={links.GIVBACK_TOKENS_FORUM}
					title={formatMessage({ id: 'label.our_forum' })}
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

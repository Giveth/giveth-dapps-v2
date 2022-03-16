import { GLink, semanticColors } from '@giveth/ui-design-system';
import React from 'react';
import styled from 'styled-components';

import WarningBadge from '@/components/badges/WarningBadge';

const InlineToast = (props: { message: string }) => {
	const { message } = props;
	return (
		<Container>
			<WarningBadge />
			<GLink size='Medium' color={semanticColors.golden[700]}>
				{message}
			</GLink>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	gap: 16px;
	padding: 16px;
	background: ${semanticColors.golden[200]};
	border-radius: 8px;
	border: 1px solid ${semanticColors.golden[700]};
	margin: 24px 0 24px;
	max-width: 750px;
	color: ${semanticColors.golden[700]};
`;

export default InlineToast;

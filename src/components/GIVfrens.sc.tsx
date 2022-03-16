import { brandColors, GLink, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';

export const Subtitle = styled(Lead)`
	margin-bottom: 24px;
	width: 40%;
`;

export const GIVfrensLink = styled(GLink)`
	color: ${brandColors.cyan[500]};
	font-size: 20px;
`;

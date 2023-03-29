import { brandColors, GLink, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Col } from '@giveth/ui-design-system';

export const Subtitle = styled(Lead)`
	margin-bottom: 24px;
`;

export const GIVfrensLink = styled(GLink)`
	color: ${brandColors.cyan[500]};
	font-size: 20px;
`;

export const DAOContainer = styled(Col)`
	position: relative;
`;

export const DAOChangeNetwork = styled.div`
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	backdrop-filter: blur(2px);
	z-index: 2;
`;

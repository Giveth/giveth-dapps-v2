import { device } from '@/utils/constants';
import {
	brandColors,
	ButtonLink,
	GLink,
	H1,
	Lead,
	QuoteText,
} from '@giveth/ui-design-system';
import styled from 'styled-components';

export const Subtitle = styled(Lead)`
	margin-bottom: 24px;
`;

export const GIVfrensLink = styled(GLink)`
	color: ${brandColors.cyan[500]};
	font-size: 20px;
`;

export const DaoCard = styled.div`
	background-color: #3c14c5;
	padding: 32px 60px;
	background-image: url('/images/backgrounds/giv-outline.svg');
	border-radius: 8px;
	position: relative;
	::before {
		content: url('');
	}
	@media ${device.laptopL} {
		::before {
			content: url('/images/pie1.png');
			position: absolute;
			top: 0;
			right: 0;
		}
	}
`;
export const DaoCardTitle = styled(H1)`
	margin-bottom: 22px;
`;

export const DaoCardQuote = styled(QuoteText)`
	color: ${brandColors.giv[200]};
`;

export const DaoCardButton = styled(ButtonLink)`
	width: 300px;
	margin-top: 36px;
	margin-bottom: 12px;
`;

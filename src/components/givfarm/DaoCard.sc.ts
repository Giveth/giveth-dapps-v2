import {
	H1,
	QuoteText,
	brandColors,
	ButtonLink,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { device, mediaQueries } from '@/lib/constants/constants';

export const DaoCardContainer = styled.div`
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
	margin-top: 36px;
	margin-bottom: 12px;
	align-items: center;
	display: block;
	text-align: center;
	margin-left: auto;
	width: 136px;
	${mediaQueries.tablet} {
		margin: 36px auto 12px auto;
		width: 300px;
	}
`;

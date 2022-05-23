import styled from 'styled-components';
import { D1, QuoteText } from '@giveth/ui-design-system';
import { BottomContainer, TopContainer } from './commons';
import { mediaQueries } from '@/lib/constants/constants';

export const GIVpowerTopContainer = styled(TopContainer)`
	overflow: hidden;
	position: relative;
`;
export const GIVpowerBottomContainer = styled(BottomContainer)``;

export const Title = styled(D1)`
	margin-top: 60px;
	margin-bottom: 24px;
`;

export const Subtitle = styled(QuoteText)`
	margin-bottom: 54px;
	${mediaQueries.tablet} {
		margin-bottom: 89px;
	}
`;

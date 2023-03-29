import styled from 'styled-components';
import { H3, mediaQueries } from '@giveth/ui-design-system';

export const Wrapper = styled.div`
	position: relative;
	margin: 80px auto;
	padding: 0 24px;
	${mediaQueries.tablet} {
		max-width: 1280px;
		padding: 0 40px;
	}
`;

export const H3Styled = styled(H3)`
	margin-bottom: 16px;
`;

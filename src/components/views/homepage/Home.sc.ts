import styled from 'styled-components';
import { mediaQueries } from '@/utils/constants';

export const HomeContainer = styled.div`
	padding-left: 18px;
	padding-right: 18px;

	${mediaQueries.laptop} {
		padding-left: 32px;
		padding-right: 32px;
	}
	${mediaQueries.laptopL} {
		padding-left: 151px;
		padding-right: 151px;
	}
`;

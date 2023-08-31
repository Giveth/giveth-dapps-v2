import styled from 'styled-components';
import { mediaQueries } from '@giveth/ui-design-system';

export const OnboardingWrapper = styled.div`
	max-width: 1300px;
	margin: 0 auto;
	padding: 0 24px;
	${mediaQueries.tablet} {
		padding: 0 42px;
	}
	${mediaQueries.laptopS} {
		padding: 0 50px;
	}
`;

export const OnboardingHeaderWrapper = styled.div`
	max-width: 1280px;
	margin: 0 auto;
	padding: 0 5px;
	${mediaQueries.tablet} {
		padding: 0 32px;
	}
	${mediaQueries.laptopS} {
		padding: 0 40px;
	}
`;

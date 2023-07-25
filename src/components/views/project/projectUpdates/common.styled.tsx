import styled from 'styled-components';
import { Lead, mediaQueries, neutralColors } from '@giveth/ui-design-system';

export const HorizontalBorder = styled.div`
	border: 1px solid ${neutralColors.gray[400]};
`;

export const Title = styled(Lead)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 24px;
	word-break: break-word;
`;

export const Content = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	margin-bottom: 42px;
	flex-direction: column;
	gap: 25px 0;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

export const Wrapper = styled.div`
	display: flex;
	margin-bottom: 40px;
	> *:last-child {
		width: 100%;
	}
	${mediaQueries.tablet} {
		gap: 50px;
	}
`;

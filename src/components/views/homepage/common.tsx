import { H4, mediaQueries, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';

export const BlockTitle = styled(H4)`
	color: ${neutralColors.gray[600]};
	font-weight: 700;
	text-align: center;
	${mediaQueries.laptopS} {
		text-align: left;
	}
`;

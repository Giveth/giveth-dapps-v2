import { H4, mediaQueries, neutralColors } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@giveth/ui-design-system';

export const BlockTitle = styled(H4)`
	color: ${neutralColors.gray[600]};
	font-weight: 700;
	text-align: center;
	${mediaQueries.laptopS} {
		text-align: left;
	}
`;

export const BlockHeader = styled(Flex)`
	justify-content: space-between;
	align-items: center;
	gap: 24px;
	margin-bottom: 32px;
	position: relative;
	flex-direction: column;
	${mediaQueries.laptopS} {
		flex-direction: row;
	}
`;

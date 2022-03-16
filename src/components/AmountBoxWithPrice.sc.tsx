import { brandColors, Title, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from './styled-components/Flex';

export const AmountBoxWithPriceContainer = styled(Flex)`
	background-color: ${brandColors.giv[500]}66;
	margin: 8px 0;
	border-radius: 8px;
	padding: 16px;
	gap: 8px;
`;

export const AmountBoxWithPriceAmount = styled(Title)`
	margin-left: 8px;
	color: ${neutralColors.gray[100]};
`;

export const AmountBoxWithPriceUSD = styled(P)`
	color: ${brandColors.deep[100]};
`;

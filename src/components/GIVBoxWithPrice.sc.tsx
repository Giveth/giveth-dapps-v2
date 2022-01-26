import { brandColors, Title, neutralColors, P } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { IconGIV } from './Icons/GIV';
import { Row } from './styled-components/Grid';

export const GIVBoxWithPriceContainer = styled(Row)`
	background-color: ${brandColors.giv[500]}66;
	margin: 8px 0;
	border-radius: 8px;
	padding: 16px;
	gap: 8px;
`;

export const GIVBoxWithPriceIcon = styled(IconGIV)``;

export const GIVBoxWithPriceAmount = styled(Title)`
	margin-left: 8px;
	color: ${neutralColors.gray[100]};
`;

export const GIVBoxWithPriceUSD = styled(P)`
	color: ${brandColors.deep[100]};
`;

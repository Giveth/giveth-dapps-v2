import { brandColors, Subline } from '@giveth/ui-design-system';
import styled from 'styled-components';

export const ContributeCardBox = styled.div<{
	$gridTemplateColumns?: string;
}>`
	background: ${brandColors.giv['000']};
	box-shadow: 0 3px 20px rgba(212, 218, 238, 0.4);
	border-radius: 12px;
	display: grid;
	padding: 24px;
	grid-template-columns: ${props => props.$gridTemplateColumns || '1fr 1fr'};
	width: 100%;
`;

export const ContributeCardTitles = styled(Subline)`
	text-transform: uppercase;
`;

import styled from 'styled-components';
import { brandColors, Button } from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';

export const ButtonStyled = styled(Button)<{ color?: string }>`
	color: ${props => props.color || brandColors.giv[500]};
	background: white;
	box-shadow: ${Shadow.Giv[400]};
`;

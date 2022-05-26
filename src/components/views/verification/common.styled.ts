import styled from 'styled-components';
import { Button } from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';

export const ButtonStyled = styled(Button)<{
	color?: string;
	background?: string;
}>`
	color: ${props => props.color || 'inherit'};
	background: ${props => props.background || 'inherit'};
	box-shadow: ${Shadow.Giv[400]};
`;

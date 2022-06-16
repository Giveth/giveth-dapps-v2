import styled from 'styled-components';
import { Button, neutralColors, OulineButton } from '@giveth/ui-design-system';
import { Shadow } from '@/components/styled-components/Shadow';
import { FlexCenter } from '@/components/styled-components/Flex';

export const ButtonStyled = styled(Button)<{
	color?: string;
	background?: string;
}>`
	color: ${props => props.color || 'inherit'};
	background: ${props => props.background || 'inherit'};
	box-shadow: ${Shadow.Giv[400]};
`;

export const OutlineStyled = styled(OulineButton)`
	padding-left: 100px;
	padding-right: 100px;
	margin-bottom: 24px;
`;

export const RemoveBtn = styled(FlexCenter)`
	background: white;
	border-radius: 50px;
	border: 2px solid ${neutralColors.gray[500]};
	height: 48px;
	width: 60px;
	cursor: pointer;
	margin-top: 15px;
`;

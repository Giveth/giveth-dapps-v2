import styled from 'styled-components';
import { Button, neutralColors, OulineButton } from '@giveth/ui-design-system';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';

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

export const VerificationContainer = styled(Flex)`
	min-height: 100vh;
	justify-content: center;
	background-image: url('/images/backgrounds/Verification_GIV.svg');
	padding: 165px 0 50px;
`;

export const ButtonStyled = styled(Button)<{
	color?: string;
	background?: string;
}>`
	color: ${props => props.color || 'inherit'};
	background: ${props => props.background || 'inherit'};
	box-shadow: ${Shadow.Giv[400]};
`;

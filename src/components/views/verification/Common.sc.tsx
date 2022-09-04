import styled from 'styled-components';
import {
	Button,
	H6,
	neutralColors,
	OutlineButton,
	semanticColors,
} from '@giveth/ui-design-system';
import { Flex, FlexCenter } from '@/components/styled-components/Flex';
import { Shadow } from '@/components/styled-components/Shadow';
import { mediaQueries } from '@/lib/constants/constants';

export const OutlineStyled = styled(OutlineButton)`
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
	padding: 132px 0 48px;
`;

export const VerificationCard = styled(Flex)<{ background: string }>`
	border-radius: 16px;
	padding: 100px 8px;
	align-items: center;
	text-align: center;
	flex-direction: column;
	gap: 24px;
	background-color: ${neutralColors.gray[100]};
	width: 85%;
	max-width: 1076px;
	position: relative;
	overflow: hidden;
	box-shadow: 0 3px 20px ${Shadow.Neutral[400]};
	::before {
		content: '';
		display: 'block';
		position: absolute;
		bottom: 0;
		left: 0;
		background-image: url(${props => props.background});
		background-position: bottom;
		height: 375px;
		width: 100%;
		background-repeat: no-repeat;
	}
	${mediaQueries.laptopS} {
		min-height: 765px;
	}
`;

export const VCImageContainer = styled.div`
	position: absolute;
	bottom: 30px;
	cursor: pointer;
`;

export const VCLeadContainer = styled.div`
	color: ${neutralColors.gray[700]};
	max-width: 500px;
`;

export const VCRejectedHeader = styled(H6)`
	color: ${semanticColors.punch[500]};
`;

export const BtnContainer = styled(Flex)`
	justify-content: space-between;
`;

export const ContentSeparator = styled.hr`
	border: 0.5px solid ${neutralColors.gray[300]};
	margin: 64px 0 10px;
`;

export const ButtonStyled = styled(Button)<{
	color?: string;
	background?: string;
}>`
	color: ${props => props.color || 'inherit'};
	background: ${props => props.background || 'inherit'};
	box-shadow: ${Shadow.Giv[400]};
`;

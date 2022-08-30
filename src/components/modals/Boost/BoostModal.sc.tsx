import {
	neutralColors,
	H4,
	brandColors,
	semanticColors,
	Subline,
	H5,
	Button,
	GLink,
} from '@giveth/ui-design-system';
import Slider from 'rc-slider';
import styled from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '@/components/styled-components/Flex';

export const BoostModalContainer = styled.div`
	width: 100%;
	${mediaQueries.tablet} {
		width: 480px;
	}
	padding: 24px;
`;

export const InfoPart = styled.div`
	padding: 16px;
	border: 2px solid ${neutralColors.gray[300]};
	border-radius: 8px;
	margin-bottom: 32px;
`;

export const TotalGIVpowerRow = styled(Flex)`
	color: ${neutralColors.gray[700]};
	margin-bottom: 21px;
`;

export const GIVpowerValue = styled(H4)`
	position: relative;
`;

export const GIVpowerHelp = styled.div`
	position: absolute;
	top: -16px;
	right: -20px;
	cursor: pointer;
	&:hover {
		color: ${neutralColors.gray[800]};
	}
`;

export const ColoredRocketIcon = styled.div`
	color: ${brandColors.giv[500]};
`;

export const DescToast = styled.div`
	padding: 16px;
	border: 1px solid ${semanticColors.blueSky[700]};
	background-color: ${semanticColors.blueSky[100]};
	color: ${semanticColors.blueSky[700]};
	border-radius: 8px;
	margin-bottom: 32px;
`;

export const StyledSlider = styled(Slider)`
	margin-bottom: 32px;
`;

export const Handle = styled.div`
	&::after {
		content: '';
		position: absolute;
		right: -4px;
		top: -3px;
		height: 14px;
		width: 1px;
		background-color: ${brandColors.giv[900]};
	}
`;

export const HandleTooltip = styled(Subline)`
	background-color: ${brandColors.giv[800]};
	position: absolute;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 0 6px;
	color: white;
	border-radius: 4px;
	&::before {
		content: '';
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 0 5px 5px 5px;
		border-color: transparent transparent ${brandColors.giv[800]}
			transparent;
		position: absolute;
		top: -5px;
		left: 50%;
		transform: translateX(-50%);
	}
`;

export const SliderWrapper = styled.div`
	position: relative;
`;

export const SliderTooltip = styled(Subline)`
	background-color: ${neutralColors.gray[500]};
	position: absolute;
	top: -20px;
	left: 50%;
	transform: translateX(-50%);
	padding: 0 6px;
	color: white;
	font-size: 12px;
	border-radius: 4px;
	&::before {
		content: '';
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 5px 5px 0 5px;
		border-color: ${neutralColors.gray[500]} transparent transparent
			transparent;
		position: absolute;
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
	}
`;

interface SliderDescProps {
	isChanged: boolean;
}

export const SliderDesc = styled(H5)<SliderDescProps>`
	color: ${props =>
		props.isChanged ? brandColors.giv[500] : neutralColors.gray[700]};
`;

export const ConfirmButton = styled(Button)`
	width: 300px;
	margin: 40px auto 12px;
`;

export const ManageLink = styled(GLink)`
	color: ${brandColors.pinky[500]};
	&:hover {
		color: ${brandColors.pinky[800]};
	}
	transition: color 0.3s ease;
`;

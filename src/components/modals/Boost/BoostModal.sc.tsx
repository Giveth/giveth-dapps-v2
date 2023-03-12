import {
	neutralColors,
	H4,
	brandColors,
	semanticColors,
	Subline,
	H5,
	Button,
	GLink,
	ButtonLink,
} from '@giveth/ui-design-system';
import Slider from 'rc-slider';
import styled, { css } from 'styled-components';
import { mediaQueries } from '@/lib/constants/constants';
import { Flex } from '@/components/styled-components/Flex';
import { EBoostModalState } from './BoostModal';

interface IBoostModalContainerProps {
	state: EBoostModalState;
}

export const BoostModalContainer = styled.div<IBoostModalContainerProps>`
	width: 100%;
	transition: width 0.2s ease, height 0.2s ease;
	${mediaQueries.tablet} {
		width: ${props =>
			props.state === EBoostModalState.BOOSTED ? 716 : 480}px;
	}
	padding: ${props =>
		props.state === EBoostModalState.BOOSTING ? '24px' : '0 24px 24px'};
	${props =>
		props.state === EBoostModalState.BOOSTED
			? css`
					background-image: url('/images/backgrounds/rocket.png');
					background-repeat: no-repeat;
					background-position: left bottom;
			  `
			: ''}
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

interface IDescToast {
	hasError?: boolean;
}

export const DescToast = styled.div<IDescToast>`
	padding: 16px;
	border: 1px solid
		${props =>
			props.hasError
				? semanticColors.punch[700]
				: semanticColors.blueSky[700]};
	background-color: ${props =>
		props.hasError
			? semanticColors.punch[100]
			: semanticColors.blueSky[100]};
	color: ${props =>
		props.hasError
			? semanticColors.punch[700]
			: semanticColors.blueSky[700]};
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

export const BoostedTitle = styled(H4)`
	margin: 81px auto 25px;
`;

export const ConfettiContainer = styled.div`
	position: absolute;
	top: 50px;
	left: 0;
	right: 0;
	height: 200px;
	overflow-y: hidden;
`;

export const ExceededContainer = styled.div`
	padding: 48px 0;
`;

export const BoostedProjectsLink = styled(ButtonLink)`
	width: 300px;
	margin: 20px auto;
	margin-top: 0;
`;

export const NotNowButton = styled(Button)`
	margin: 0 auto;
`;

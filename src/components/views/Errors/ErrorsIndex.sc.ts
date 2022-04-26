import { Arc } from '@/components/styled-components/Arc';
import { mediaQueries } from '@/lib/constants/constants';
import { D3, H4, brandColors } from '@giveth/ui-design-system';

import styled from 'styled-components';

export const SocialContainer = styled.div`
	display: flex;
	text-align: center;
	gap: 16px;
	justify-content: center;
	position: absolute;
	bottom: 16px;
	left: 50%;
	transform: translateX(-50%);
	${mediaQueries.tablet} {
		position: static;
		bottom: 0;
		left: 0;
		transform: translateX(0);
	}
`;

export const CustomBigWarningImage = styled.img`
	opacity: 0.3;
	position: absolute;
	width: 220px;
	height: 220px;
	top: 100px;
	left: -70px;
	display: none;
	${mediaQueries.laptop} {
		display: unset;
	}
`;

export const CustomSmallWarningImage = styled.img`
	opacity: 0.3;
	position: absolute;
	width: 120px;
	height: 120px;
	bottom: 100px;
	right: 70px;
	display: none;
	${mediaQueries.laptop} {
		display: unset;
	}
`;

export const ArcMustardTop = styled(Arc)`
	border-width: 50px;
	border-color: transparent ${brandColors.mustard[500]}
		${brandColors.mustard[500]} transparent;
	transform: rotate(135deg);
	top: 100px;
	right: -130px;
	width: 260px;
	height: 260px;
	z-index: 0;
	display: none;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

export const CustomH4 = styled(H4)`
	color: ${brandColors.mustard[500]};
`;

export const ArcMustardBottom = styled(Arc)`
	border-width: 50px;
	border-color: transparent ${brandColors.mustard[500]}
		${brandColors.mustard[500]} transparent;
	transform: rotate(315deg);
	bottom: 100px;
	left: -130px;
	width: 260px;
	height: 260px;
	z-index: 0;
	display: none;
	${mediaQueries.tablet} {
		display: unset;
	}
`;

export const TextContainer = styled.div`
	display: flex;
	flex-direction: column;
	text-align: center;
	justify-content: center;
	height: 100%;
	gap: 20px;
	padding: 0;
	* {
		z-index: 2;
	}
`;

export const ErrorContainer = styled.div`
	background: ${brandColors.giv[500]};
	background-image: url('/images/GIV_homepage.svg');
	height: 100vh;

	color: white;
	overflow: hidden;
	position: relative;

	${mediaQueries.mobileS} {
		padding: 18px;
	}

	${mediaQueries.tablet} {
		padding: 150px 130px;
	}
`;

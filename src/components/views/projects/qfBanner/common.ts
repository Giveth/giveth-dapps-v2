import {
	Col,
	H1,
	mediaQueries,
	Flex,
	deviceSize,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import Image from 'next/image';

export const BannerContainer = styled.div`
	position: relative;
	padding-top: 40px;
	padding-bottom: 60px;
	background: linear-gradient(98deg, #0f0116 24.06%, #380950 93.92%);
	img {
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}
`;

export const StyledCol = styled(Col)`
	position: relative;
	display: flex;
	flex-direction: column;
	z-index: 1;
	min-height: 300px;
	text-align: center;
	align-items: center;
	padding-top: 40px;
	color: #ffffff;
`;

export const ActiveStyledCol = styled(Col)`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	z-index: 1;
	min-height: 300px;
	padding-top: 40px;
	color: #ffffff;

	@media (max-width: 1350px) {
		width: 100% !important;
		align-items: center;
	}
`;

export const Title = styled(H1)`
	margin-top: 32px;
	color: #618600;
`;

export const Desc = styled(Flex)`
	width: fit-content;
	border: 2px solid #865837;
	border-radius: 27px;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 9px 20px;
	background: #fbff44;
	margin-top: 12px;
	margin-bottom: 32px;
	color: #545517;
`;

export const ImgBase = styled.img`
	z-index: 1 !important;
	position: absolute;
`;

export const ImgMiddleRight = styled(ImgBase)`
	top: 0;
	right: 0;
	width: 620px;
`;

export const ImgTopRight = styled(ImgBase)`
	top: 0;
	right: 120px;
	width: 110px;
	display: none;
	${mediaQueries.mobileL} {
		display: block;
	}
`;

export const ImgTopRight1 = styled(ImgBase)`
	top: 0;
	right: 0;
	width: 180px;
	display: none;
	${mediaQueries.mobileL} {
		display: block;
	}
`;

export const ImgTopMiddle = styled(ImgBase)`
	top: 20px;
	right: 40%;
	width: 110px;
	display: none;
	${mediaQueries.mobileL} {
		display: block;
	}
`;

export const ImgBottomRight = styled(ImgBase)`
	right: 0;
	bottom: 0;
	display: none;
	${mediaQueries.mobileL} {
		display: block;
	}
`;
export const ImgTopLeft = styled(ImgBase)`
	top: 0;
	left: 64px;
	width: 127px;
	display: none;
	${mediaQueries.mobileL} {
		display: block;
	}
`;

export const ImgBottomLeft = styled(ImgBase)`
	left: 0;
	bottom: 0;
	width: 110px;
	display: none;
	${mediaQueries.mobileL} {
		display: block;
	}
`;

export const ImgBottomLeft1 = styled(ImgBase)`
	left: 48px;
	bottom: 0;
	width: 100px;
	display: none;
	${mediaQueries.mobileL} {
		display: block;
	}
`;

export const Sponsor = styled(Image)`
	width: 119px;
	height: 125px;
	${mediaQueries.tablet} {
		width: 179px;
		height: 188px;
	}
	@media (max-width: 477px) {
		width: 90px;
		height: 95px;
	}
	@media (max-width: ${deviceSize.mobileM + 'px'}) {
		width: 75px;
		height: 79px;
	}
`;

export const SmallerSponsor = styled(Image)`
	width: 80px;
	height: 80px;
	${mediaQueries.tablet} {
		width: 120px;
		height: 120px;
	}
	@media (max-width: 477px) {
		width: 60px;
		height: 60px;
	}
	@media (max-width: ${deviceSize.mobileM + 'px'}) {
		width: 50px;
		height: 50px;
	}
`;

export const StyledColArch = styled(Col)`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1;
	min-height: 300px;
	text-align: center;
	color: #ffffff;
`;

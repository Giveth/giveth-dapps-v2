import { Col, H1, H2, mediaQueries } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Flex } from '@/components/styled-components/Flex';

export const BannerContainer = styled.div`
	position: relative;
	padding-top: 100px;
	padding-bottom: 100px;
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
`;

export const Title = styled(H1)`
	margin-top: 32px;
	color: #fff;
`;

export const Name = styled(H2)`
	color: #fff;
`;

export const Desc = styled(Flex)`
	width: fit-content;
	color: #fff;
	border: 2px solid #d640f9;
	border-radius: 20px;
	align-items: center;
	justify-content: center;
	gap: 8px;
	padding: 9px 20px;
	background: #272526;
	margin-top: 12px;
	margin-bottom: 32px;
`;

export const ImgBase = styled.img`
	z-index: 1 !important;
	position: absolute;
`;
export const ImgTopRight = styled(ImgBase)`
	top: 40px;
	right: 0;
	width: 200px;
	${mediaQueries.tablet} {
		width: 300px;
	}
	${mediaQueries.laptopS} {
		width: 450px;
	}
`;
export const ImgBottomRight = styled(ImgBase)`
	right: 10px;
	bottom: 0;
	${mediaQueries.tablet} {
		right: 100px;
	}
`;
export const ImgTopLeft = styled(ImgBase)`
	top: 0;
	left: 10px;
	width: 100px;
	${mediaQueries.tablet} {
		left: 130px;
		width: 180px;
	}
`;

export const ImgBottomLeft = styled(ImgBase)`
	left: 0;
	bottom: 0;
	width: 150px;
	${mediaQueries.laptopS} {
		width: 200px;
	}
`;

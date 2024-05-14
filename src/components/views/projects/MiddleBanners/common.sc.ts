import { H3, Lead, mediaQueries, Flex } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Arc } from '@/components/styled-components/Arc';

export const Box = styled(Flex)`
	position: relative;
	background-color: white;
	/* margin: 20px 0px; */
	/* padding: 95px 190px; */
	padding: 7% 10%;
	overflow: hidden;
	z-index: 1;
	grid-row: 2;
	grid-column: 1;
	grid-column-start: 1;
	grid-column-end: 2;
	${mediaQueries.tablet} {
		grid-column-end: 3;
	}

	${mediaQueries.laptopL} {
		grid-column-end: 4;
	}
`;

interface IColor {
	color: string;
}

export const Title = styled(H3)<IColor>`
	color: ${props => props.color};
	position: relative;
	z-index: 1;
`;

export const BigArc = styled(Arc)<IColor>`
	border-width: 180px;
	border-color: ${props => props.color};
	opacity: 40%;
	top: -550%;
	left: -190%;
	width: 3600px;
	height: 3600px;
	z-index: 0;
	pointer-events: none;
`;

export const Caption = styled(Lead)`
	position: relative;
	z-index: 1;
`;

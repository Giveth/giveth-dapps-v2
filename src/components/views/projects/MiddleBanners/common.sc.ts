import { H3, Lead } from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Arc } from '@/components/styled-components/Arc';
import { Flex } from '@/components/styled-components/Flex';

export const Box = styled(Flex)`
	position: relative;
	background-color: white;
	margin: 20px 0px;
	/* padding: 95px 190px; */
	padding: 7% 10%;
	overflow: hidden;
	z-index: 1;
`;

interface IColor {
	color: string;
}

export const Title = styled(H3)<IColor>`
	color: ${props => props.color};
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
	z-index: 1;
`;

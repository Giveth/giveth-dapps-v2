import styled from 'styled-components';
import { brandColors } from '@giveth/ui-design-system';
import { FC } from 'react';

interface IColor {
	color?: string;
}
interface ISize {
	size?: number;
}

interface ISpinner extends ISize, IColor {}
interface IWrappedSpinner extends ISize, IColor {}

export const Spinner: FC<ISpinner> = ({
	color = brandColors.giv[500],
	size = 80,
}) => {
	return (
		<Ring color={color} size={size}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</Ring>
	);
};

export const WrappedSpinner: FC<IWrappedSpinner> = ({
	size = 700,
	color = brandColors.giv[500],
}) => {
	return (
		<SpinnerContainer size={size}>
			<Spinner color={color} />
		</SpinnerContainer>
	);
};

export const SpinnerContainer = styled.div<ISize>`
	min-height: ${({ size }) => size}px;
	/* min-width: ${({ size }) => size}px; */
`;

const Ring = styled.div<ISpinner>`
	display: inline-block;
	position: relative;
	width: ${props => props.size}px;
	height: ${props => props.size}px;

	& div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: ${props => props.size! - props.size! / 5}px;
		height: ${props => props.size! - props.size! / 5}px;
		margin: ${props => props.size! / 10}px;
		border: ${props => props.size! / 10}px solid ${props => props.color};
		border-radius: 50%;
		animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: ${props => props.color} transparent transparent
			transparent;
	}
	& div:nth-child(1) {
		animation-delay: -0.45s;
	}
	& div:nth-child(2) {
		animation-delay: -0.3s;
	}
	& div:nth-child(3) {
		animation-delay: -0.15s;
	}
	@keyframes ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
`;

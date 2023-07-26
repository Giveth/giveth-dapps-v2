import styled from 'styled-components';
import { brandColors } from '@giveth/ui-design-system';
import { FC } from 'react';

interface IColor {
	color?: string;
}

export const Spinner: FC<IColor> = ({ color = brandColors.giv[500] }) => {
	return (
		<Ring color={color}>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</Ring>
	);
};

interface ISize {
	size?: number;
}

interface IWrappedSpinner extends ISize, IColor {}

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

const Ring = styled.div`
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;

	& div {
		box-sizing: border-box;
		display: block;
		position: absolute;
		width: 64px;
		height: 64px;
		margin: 8px;
		border: 8px solid ${brandColors.giv[500]};
		border-radius: 50%;
		animation: ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
		border-color: ${brandColors.giv[500]} transparent transparent
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

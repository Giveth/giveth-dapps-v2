import styled from 'styled-components';
import { neutralColors, brandColors } from '@giveth/ui-design-system';
import { BaseInput } from './BaseInput';

export const NumericalInput = styled(BaseInput)`
	width: 100%;
	height: 54px;
	padding: 15px 16px;
	margin-top: 10px;
	margin-bottom: 8px;

	background: ${brandColors.giv[700]};
	color: ${neutralColors.gray[100]};

	border: 1px solid ${brandColors.giv[500]};
	border-radius: 8px;

	font-family: Red Hat Text;
	font-style: normal;
	font-weight: normal;
	font-size: 16px;
	line-height: 150%;

	&:focus {
		outline: none;
	}
	&[type='number'] {
		-moz-appearance: textfield;
	}
	&::-webkit-outer-spin-button,
	&::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	${props => (props.disabled ? `color: ${brandColors.giv[300]};` : '')}
`;

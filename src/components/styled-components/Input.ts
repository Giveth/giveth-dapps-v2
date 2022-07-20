import {
	brandColors,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';
import { EInputValidation } from '@/types/inputValidation';
import { InputSize } from '@/components/Input';

interface IInputField {
	inputSize?: InputSize; // Default is 'LARGE'
	hasLeftIcon?: boolean;
	validation?: EInputValidation;
}

const Input = styled.input<IInputField>`
	width: 100%;
	height: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '32px';
			case InputSize.MEDIUM:
				return '54px';
			case InputSize.LARGE:
				return '56px';
			default:
				return '56px';
		}
	}};
	border: 2px solid
		${props => {
			switch (props.validation) {
				case EInputValidation.NORMAL:
					return neutralColors.gray[300];
				case EInputValidation.WARNING:
					return semanticColors.golden[600];
				case EInputValidation.ERROR:
					return semanticColors.punch[500];
				case EInputValidation.SUCCESS:
					return semanticColors.jade[500];
				default:
					return neutralColors.gray[300];
			}
		}};
	border-radius: 8px;
	padding: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '8px';
			case InputSize.MEDIUM:
				return '15px 16px';
			case InputSize.LARGE:
				return '18px 16px';
			default:
				return '18px 16px';
		}
	}};
	padding-left: ${props => props.hasLeftIcon && '60px'};
	padding-right: ${props => props.maxLength && '72px'};
	font-size: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '12px';
			case InputSize.MEDIUM:
				return '16px';
			case InputSize.LARGE:
				return '16px';
			default:
				return '16px';
		}
	}};
	line-height: 150%;
	font-family: 'Red Hat Text', sans-serif;
	caret-color: ${brandColors.giv[300]};
	box-shadow: none;
	:focus {
		border: 2px solid
			${props => {
				switch (props.validation) {
					case EInputValidation.NORMAL:
						return brandColors.giv[600];
					case EInputValidation.WARNING:
						return semanticColors.golden[700];
					case EInputValidation.ERROR:
						return semanticColors.punch[700];
					case EInputValidation.SUCCESS:
						return semanticColors.jade[700];
					default:
						return brandColors.giv[600];
				}
			}};
	}
	:hover {
		box-shadow: ${Shadow.Neutral[400]};
	}
	:disabled {
		background: ${neutralColors.gray[300]};
	}
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

export default Input;

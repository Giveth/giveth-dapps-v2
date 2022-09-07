import {
	brandColors,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { Shadow } from '@/components/styled-components/Shadow';
import { EInputValidation } from '@/types/inputValidation';
import { InputSize } from '@/components/Input';
import {
	inputSizeToFontSize,
	inputSizeToHeight,
	inputSizeToPaddingLeft,
	INPUT_HORIZONTAL_PADDING_LARGE,
	INPUT_HORIZONTAL_PADDING_MEDIUM,
	INPUT_HORIZONTAL_PADDING_SMALL,
	INPUT_VERTICAL_PADDING_LARGE,
	INPUT_VERTICAL_PADDING_MEDIUM,
	INPUT_VERTICAL_PADDING_SMALL,
} from '@/helpers/styledComponents';

interface IInputField {
	inputSize?: InputSize; // Default is 'LARGE'
	hasLeftIcon?: boolean;
	validation?: EInputValidation;
}

const Input = styled.input<IInputField>`
	width: 100%;
	height: ${props => `${inputSizeToHeight(props.inputSize)}px`};
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
				return `${INPUT_VERTICAL_PADDING_SMALL}px ${INPUT_HORIZONTAL_PADDING_SMALL}px`;
			case InputSize.MEDIUM:
				return `${INPUT_VERTICAL_PADDING_MEDIUM}px ${INPUT_HORIZONTAL_PADDING_MEDIUM}px`;
			case InputSize.LARGE:
				return `${INPUT_VERTICAL_PADDING_LARGE}px ${INPUT_HORIZONTAL_PADDING_LARGE}px`;
			default:
				return `${INPUT_VERTICAL_PADDING_LARGE}px ${INPUT_HORIZONTAL_PADDING_LARGE}px`;
		}
	}};
	padding-left: ${props => {
		return `${inputSizeToPaddingLeft(
			props.inputSize,
			props.hasLeftIcon,
		)}px`;
	}};
	padding-right: ${props => props.maxLength && '72px'};
	font-size: ${props => `${inputSizeToFontSize(props.inputSize)}px`};
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
interface IInputSuffixProps {
	inputSize: InputSize;
}

export const InputSuffix = styled.span<IInputSuffixProps>`
	font-size: ${props => `${inputSizeToFontSize(props.inputSize)}px`};
	line-height: 150%;
	padding: 0 4px;
	position: absolute;
	top: 0;
`;

export default Input;

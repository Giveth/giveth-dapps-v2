import {
	brandColors,
	neutralColors,
	GLink,
	semanticColors,
} from '@giveth/ui-design-system';
import { FC, HTMLInputTypeAttribute } from 'react';
import styled from 'styled-components';
import type {
	FieldError,
	UseFormRegister,
	RegisterOptions,
} from 'react-hook-form';

export interface IFormValidations {
	[key: string]: InputValidationType;
}

export enum InputValidationType {
	NORMAL,
	WARNING,
	ERROR,
	SUCCESS,
}

export enum InputSize {
	SMALL,
	MEDIUM,
	LARGE,
}

interface IInput {
	name: string;
	type?: HTMLInputTypeAttribute;
	defaultValue?: string;
	placeholder?: string;
	label?: string;
	caption?: string;
	size?: InputSize;
	register: UseFormRegister<any>;
	error?: FieldError;
	registerOptions?: RegisterOptions;
}

const InputSizeToLinkSize = (size: InputSize) => {
	switch (size) {
		case InputSize.SMALL:
			return 'Tiny';
		case InputSize.MEDIUM:
			return 'Small';
		case InputSize.LARGE:
			return 'Medium';
		default:
			return 'Small';
	}
};

const Input: FC<IInput> = ({
	name,
	type = 'text',
	defaultValue,
	placeholder = '',
	label,
	caption,
	size = InputSize.MEDIUM,
	register,
	registerOptions = { required: false },
	error,
}) => {
	const validationStatus = error
		? InputValidationType.ERROR
		: InputValidationType.NORMAL;

	return (
		<InputContainer>
			{label && (
				<InputLabel
					size={InputSizeToLinkSize(size)}
					required={Boolean(registerOptions.required)}
				>
					{label}
				</InputLabel>
			)}
			<InputField
				defaultValue={defaultValue}
				placeholder={placeholder}
				type={type}
				validation={validationStatus}
				inputSize={size}
				{...register(name, registerOptions)}
			/>
			{error?.message ? (
				<InputValidation
					validation={validationStatus}
					size={InputSizeToLinkSize(size)}
				>
					{error?.message}
				</InputValidation>
			) : (
				<InputDesc size={InputSizeToLinkSize(size)}>
					{caption || '\u200C'}
				</InputDesc> //hidden char
			)}
		</InputContainer>
	);
};

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(GLink)<{ required?: boolean }>`
	text-transform: uppercase;
	padding-bottom: 4px;
	color: ${brandColors.deep[500]};
	::after {
		content: '*';
		display: ${props => (props.required ? 'inline-block' : 'none')};
		padding: 0 4px;
		color: ${semanticColors.punch[500]};
	}
`;

interface IValidation {
	validation: InputValidationType;
}

interface IInputField extends IValidation {
	inputSize: InputSize;
}

const InputField = styled.input<IInputField>`
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
				break;
		}
	}};
	border: 2px solid
		${props => {
			switch (props.validation) {
				case InputValidationType.NORMAL:
					return neutralColors.gray[300];
				case InputValidationType.WARNING:
					return semanticColors.golden[600];
				case InputValidationType.ERROR:
					return semanticColors.punch[500];
				case InputValidationType.SUCCESS:
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
				break;
		}
	}};
	font-size: ${props => {
		switch (props.inputSize) {
			case InputSize.SMALL:
				return '12px';
			case InputSize.MEDIUM:
				return '16px';
			case InputSize.LARGE:
				return '16px';
			default:
				break;
		}
	}};
	line-height: 150%;
	/* font-weight: 500; */
	font-family: 'Red Hat Text';
	caret-color: ${brandColors.giv[300]};
	:focus {
		border: 2px solid
			${props => {
				switch (props.validation) {
					case InputValidationType.NORMAL:
						return neutralColors.gray[500];
					case InputValidationType.WARNING:
						return semanticColors.golden[700];
					case InputValidationType.ERROR:
						return semanticColors.punch[700];
					case InputValidationType.SUCCESS:
						return semanticColors.jade[700];
					default:
						return neutralColors.gray[500];
				}
			}};
	}
	::placeholder {
		color: ${neutralColors.gray[500]};
	}
`;

const InputDesc = styled(GLink)`
	padding-top: 4px;
	color: ${brandColors.deep[500]};
	display: block;
`;

const InputValidation = styled(GLink)<IValidation>`
	padding-top: 4px;
	display: block;
	color: ${props => {
		switch (props.validation) {
			case InputValidationType.NORMAL:
				return neutralColors.gray[900];
			case InputValidationType.WARNING:
				return semanticColors.golden[600];
			case InputValidationType.ERROR:
				return semanticColors.punch[500];
			case InputValidationType.SUCCESS:
				return semanticColors.jade[500];
			default:
				return neutralColors.gray[300];
		}
	}}; ;
`;

export default Input;

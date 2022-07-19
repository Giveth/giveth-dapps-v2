import {
	brandColors,
	GLink,
	neutralColors,
	semanticColors,
} from '@giveth/ui-design-system';
import { InputHTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';
import { IIconProps } from '@giveth/ui-design-system/lib/esm/components/icons/giv-economy/type';
import { Shadow } from '@/components/styled-components/Shadow';
import { EInputValidation, IInputValidation } from '@/types/inputValidation';
import type {
	FieldError,
	RegisterOptions,
	UseFormRegister,
} from 'react-hook-form';

export interface IFormValidations {
	[key: string]: EInputValidation;
}

export enum InputSize {
	SMALL,
	MEDIUM,
	LARGE,
}

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	caption?: string;
	size?: InputSize;
	LeftIcon?: ReactElement<IIconProps>;
}

interface IInputWithRegister extends IInput {
	register: UseFormRegister<any>;
	registerName: string;
	registerOptions?: RegisterOptions;
	error?: FieldError;
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

type InputType =
	| IInputWithRegister
	| ({
			registerName?: never;
			register?: never;
			registerOptions?: never;
			error?: never;
	  } & IInput);

const Input = (props: InputType) => {
	const {
		label,
		caption,
		size = InputSize.MEDIUM,
		disabled,
		LeftIcon,
		register,
		registerName,
		registerOptions = { required: false },
		error,
		...rest
	} = props;

	const validationStatus = error
		? EInputValidation.ERROR
		: EInputValidation.NORMAL;

	return (
		<InputContainer>
			{label && (
				<InputLabel
					disabled={disabled}
					size={InputSizeToLinkSize(size)}
					required={Boolean(registerOptions.required)}
				>
					{label}
				</InputLabel>
			)}
			<InputWrapper>
				{LeftIcon && LeftIcon}
				<InputField
					validation={validationStatus}
					inputSize={size}
					hasLeftIcon={!!LeftIcon}
					disabled={disabled}
					{...(registerName && register
						? register(registerName, registerOptions)
						: {})}
					{...rest}
				/>
			</InputWrapper>
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

const InputLabel = styled(GLink)<{ required?: boolean; disabled?: boolean }>`
	padding-bottom: 4px;
	color: ${props =>
		props.disabled ? neutralColors.gray[600] : brandColors.deep[500]};
	::after {
		content: '*';
		display: ${props => (props.required ? 'inline-block' : 'none')};
		padding: 0 4px;
		color: ${semanticColors.punch[500]};
	}
`;

interface IInputField extends IInputValidation {
	inputSize: InputSize;
	hasLeftIcon?: boolean;
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
				break;
		}
	}};
	padding-left: ${props => props.hasLeftIcon && '60px'};
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

const InputDesc = styled(GLink)`
	padding-top: 4px;
	color: ${brandColors.deep[500]};
	display: block;
`;

const InputValidation = styled(GLink)<IInputValidation>`
	padding-top: 4px;
	display: block;
	color: ${props => {
		switch (props.validation) {
			case EInputValidation.NORMAL:
				return neutralColors.gray[900];
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
`;

const InputWrapper = styled.div`
	position: relative;
	display: flex;
	> svg {
		position: absolute;
		transform: translateY(-50%);
		padding-left: 20px;
		padding-right: 8px;
		border-right: 1px solid ${neutralColors.gray[400]};
		width: 52px;
		height: 23px;
		top: 50%;
		left: 0;
		overflow: hidden;
	}
`;

export default Input;

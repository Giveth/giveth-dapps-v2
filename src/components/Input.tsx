import {
	GLink,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import React, { InputHTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';
import { IIconProps } from '@giveth/ui-design-system/lib/esm/components/icons/giv-economy/type';
import { EInputValidation, IInputValidation } from '@/types/inputValidation';
import InputStyled from './styled-components/Input';
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
		maxLength,
		value,
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
				<InputStyled
					validation={validationStatus}
					inputSize={size}
					hasLeftIcon={!!LeftIcon}
					disabled={disabled}
					maxLength={maxLength}
					{...(registerName && register
						? register(registerName, registerOptions)
						: {})}
					{...rest}
				/>
				{maxLength && (
					<CharLength>
						{value ? String(value)?.length : 0}/{maxLength}
					</CharLength>
				)}
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

const CharLength = styled(SublineBold)`
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 12px;
	background: ${neutralColors.gray[300]};
	color: ${neutralColors.gray[700]};
	font-weight: 500;
	border-radius: 64px;
	width: 52px;
	height: 30px;
	position: absolute;
	right: 16px;
	top: 0;
	bottom: 0;
	margin: auto 0;
`;

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(GLink)<{ required?: boolean; disabled?: boolean }>`
	padding-bottom: 4px;
	color: ${props =>
		props.disabled ? neutralColors.gray[600] : neutralColors.gray[900]};
	::after {
		content: '*';
		display: ${props => (props.required ? 'inline-block' : 'none')};
		padding: 0 4px;
		color: ${semanticColors.punch[500]};
	}
`;

const InputDesc = styled(GLink)`
	padding-top: 4px;
	color: ${neutralColors.gray[900]};
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

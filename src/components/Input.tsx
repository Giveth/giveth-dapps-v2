import {
	GLink,
	IIconProps,
	neutralColors,
	semanticColors,
	SublineBold,
} from '@giveth/ui-design-system';
import React, { FC, InputHTMLAttributes, ReactElement, useId } from 'react';
import styled from 'styled-components';
import { EInputValidation, IInputValidation } from '@/types/inputValidation';
import InputStyled from './styled-components/Input';
import LottieControl from '@/components/animations/lottieControl';
import LoadingAnimation from '@/animations/loading_giv_600.json';
import { FlexCenter } from '@/components/styled-components/Flex';
import type {
	DeepRequired,
	FieldError,
	FieldErrorsImpl,
	Merge,
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

interface IInputLabelProps {
	required?: boolean;
	disabled?: boolean;
}
interface IInput extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	caption?: string;
	isValidating?: boolean;
	size?: InputSize;
	LeftIcon?: ReactElement<IIconProps>;
}

interface IInputWithRegister extends IInput {
	register: UseFormRegister<any>;
	registerName: string;
	registerOptions?: RegisterOptions;
	error?:
		| FieldError
		| undefined
		| Merge<FieldError, FieldErrorsImpl<NonNullable<DeepRequired<any>>>>;
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

const Input: FC<InputType> = props => {
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
		isValidating,
		...rest
	} = props;
	const id = useId();
	const validationStatus =
		!error || isValidating
			? EInputValidation.NORMAL
			: EInputValidation.ERROR;

	return (
		<InputContainer>
			{label && (
				<label htmlFor={id}>
					<InputLabel
						disabled={disabled}
						size={InputSizeToLinkSize(size)}
						required={Boolean(registerOptions.required)}
					>
						{label}
					</InputLabel>
				</label>
			)}
			<InputWrapper>
				{LeftIcon && LeftIcon}
				<InputStyled
					validation={validationStatus}
					inputSize={size}
					hasLeftIcon={!!LeftIcon}
					disabled={disabled}
					maxLength={maxLength}
					value={value}
					id={id}
					{...(registerName && register
						? register(registerName, registerOptions)
						: {})}
					{...rest}
				/>
				<Absolute>
					{isValidating && (
						<LottieControl
							animationData={LoadingAnimation}
							size={22.4}
						/>
					)}
					{maxLength && (
						<CharLength>
							{value ? String(value)?.length : 0}/{maxLength}
						</CharLength>
					)}
				</Absolute>
			</InputWrapper>
			{error?.message ? (
				<InputValidation
					validation={validationStatus}
					size={InputSizeToLinkSize(size)}
				>
					{error.message as string}
				</InputValidation>
			) : (
				<InputDesc size={InputSizeToLinkSize(size)}>
					{caption || '\u200C'}
				</InputDesc> //hidden char
			)}
		</InputContainer>
	);
};

const Absolute = styled(FlexCenter)`
	position: absolute;
	right: 10px;
	top: 0;
	bottom: 0;
`;

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
	margin-right: 6px;
`;

const InputContainer = styled.div`
	flex: 1;
`;

const InputLabel = styled(GLink)<IInputLabelProps>`
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

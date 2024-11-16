import {
	GLink,
	IIconProps,
	neutralColors,
	semanticColors,
	SublineBold,
	FlexCenter,
	brandColors,
	Flex,
	IconEmptyCircle,
	IconCheckCircleFilled,
} from '@giveth/ui-design-system';
import React, {
	forwardRef,
	InputHTMLAttributes,
	ReactElement,
	useCallback,
	useId,
	useRef,
	useState,
} from 'react';
import styled, { css } from 'styled-components';
import { useIntl } from 'react-intl';
import { EInputValidation, IInputValidation } from '@/types/inputValidation';
import InputStyled from './styled-components/Input';
import { getTextWidth } from '@/helpers/text';
import {
	inputSizeToFontSize,
	inputSizeToPaddingLeft,
	inputSizeToVerticalPadding,
} from '@/helpers/styledComponents';
import { Spinner } from './Spinner';
import { useProfileContext } from '@/context/profile.context';
import { SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW } from '@/apollo/gql/gqlUser';
import { client } from '@/apollo/apolloClient';
import type {
	DeepRequired,
	FieldError,
	FieldErrorsImpl,
	Merge,
	RegisterOptions,
	UseFormRegister,
} from 'react-hook-form';
export enum InputSize {
	SMALL,
	MEDIUM,
	LARGE,
}

interface IInputLabelProps {
	$required?: boolean;
	$disabled?: boolean;
}

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	caption?: string;
	isValidating?: boolean;
	size?: InputSize;
	LeftIcon?: ReactElement<IIconProps>;
	error?: ICustomInputError;
	suffix?: ReactElement;
}

interface ICustomInputError {
	message?: string;
}

interface IInputWithRegister extends IInput {
	register: UseFormRegister<any>;
	registerName: string;
	registerOptions?: RegisterOptions;
	error?:
		| FieldError
		| undefined
		| ICustomInputError
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
	  } & IInput);

const InputUserEmailVerify = forwardRef<HTMLInputElement, InputType>(
	(props, inputRef) => {
		const { formatMessage } = useIntl();
		const { user } = useProfileContext();

		const [email, setEmail] = useState(user.email);
		const [verified, setVerified] = useState(user.isEmailVerified);
		const [disableVerifyButton, setDisableVerifyButton] = useState(
			!user.isEmailVerified && !user.email,
		);
		const [isVerificationProcess, setIsVerificationProcess] =
			useState(false);

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
			suffix,
			className,
			...rest
		} = props;
		const id = useId();
		const canvasRef = useRef<HTMLCanvasElement>();

		const [validationStatus, setValidationStatus] = useState(
			!error || isValidating
				? EInputValidation.NORMAL
				: EInputValidation.ERROR,
		);

		// const inputRef = useRef<HTMLInputElement | null>(null);

		const calcLeft = useCallback(() => {
			if (
				suffix &&
				!canvasRef.current &&
				typeof document !== 'undefined'
			) {
				canvasRef.current = document.createElement('canvas');
			}
			if (canvasRef.current) {
				const width = getTextWidth(
					value?.toString() || '',
					`normal ${inputSizeToFontSize(size)}px Red Hat Text`,
					canvasRef.current,
				);
				return inputSizeToPaddingLeft(size, !!LeftIcon) + width;
			}
			return 15;
		}, [suffix, value, size, LeftIcon]);

		const { ref = undefined, ...restRegProps } =
			registerName && register
				? register(registerName, registerOptions)
				: {};

		// Setup label button on condition
		let labelButton = verified
			? formatMessage({
					id: 'label.email_verified',
				})
			: formatMessage({
					id: 'label.email_verify',
				});

		// Enable verification process "button" if email input value was empty and not verified yet
		// and setup email if input value was changed and has more than 3 characters
		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.value.length > 3) {
				setEmail(e.target.value);
				setDisableVerifyButton(false);
			} else {
				setDisableVerifyButton(true);
			}
		};

		const verificationEmailHandler = async () => {
			console.log({ email });
			try {
				const { data } = await client.mutate({
					mutation: SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
					variables: {
						email: 'kkatusic@gmail.com',
					},
				});
				if (data.sendUserEmailConfirmationCodeFlow === 'EMAIL_EXIST') {
					setValidationStatus(EInputValidation.WARNING);
					setDisableVerifyButton(true);
				}
			} catch (error) {
				console.log(error);
			}
		};

		return (
			<InputContainer className={className}>
				{label && (
					<label htmlFor={id}>
						<InputLabel
							$disabled={disabled}
							size={InputSizeToLinkSize(size)}
							$required={Boolean(registerOptions.required)}
						>
							{label}
						</InputLabel>
					</label>
				)}
				<InputWrapper>
					{LeftIcon && (
						<LeftIconWrapper $inputSize={size}>
							{LeftIcon}
						</LeftIconWrapper>
					)}
					<InputStyled
						$validation={validationStatus}
						$inputSize={size}
						$hasLeftIcon={!!LeftIcon}
						disabled={disabled}
						maxLength={maxLength}
						value={value}
						id={id}
						{...restRegProps}
						{...rest}
						ref={e => {
							ref !== undefined && ref(e);
							if (inputRef) (inputRef as any).current = e;
						}}
						data-testid='styled-input'
						onChange={handleInputChange}
					/>
					<SuffixWrapper
						style={{
							left: calcLeft() + 'px',
							top: `${inputSizeToVerticalPadding(size)}px`,
						}}
					>
						{suffix}
					</SuffixWrapper>
					<Absolute>
						<VerifyInputButtonWrapper
							type='button'
							$verified={verified}
							disabled={disableVerifyButton}
							onClick={verificationEmailHandler}
						>
							<Flex $alignItems='center' gap='8px'>
								{!isVerificationProcess && !verified && (
									<IconEmptyCircle />
								)}
								{!isVerificationProcess && verified && (
									<IconCheckCircleFilled />
								)}
								{!!isVerificationProcess && (
									<Spinner size={16} />
								)}
								<span>{labelButton}</span>
							</Flex>
						</VerifyInputButtonWrapper>
					</Absolute>
					<Absolute>
						{isValidating && <Spinner size={40} />}
						{maxLength && (
							<CharLength>
								{value ? String(value)?.length : 0}/{maxLength}
							</CharLength>
						)}
					</Absolute>
				</InputWrapper>
				{error?.message ? (
					<InputValidation
						$validation={validationStatus}
						size={InputSizeToLinkSize(size)}
					>
						{error.message as string}
					</InputValidation>
				) : (
					<InputDesc size={InputSizeToLinkSize(size)}>
						{verified &&
							formatMessage({
								id: 'label.email_already_verified',
							})}
					</InputDesc> //hidden char
				)}
			</InputContainer>
		);
	},
);

InputUserEmailVerify.displayName = 'Input';

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
		props.$disabled ? neutralColors.gray[600] : neutralColors.gray[900]};
	&::after {
		content: '*';
		display: ${props => (props.$required ? 'inline-block' : 'none')};
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
		switch (props.$validation) {
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
`;

interface IInputWrapper {
	$inputSize: InputSize;
}

const LeftIconWrapper = styled.div<IInputWrapper>`
	position: absolute;
	transform: translateY(-50%);

	border-right: 1px solid ${neutralColors.gray[400]};
	top: 50%;
	left: 0;
	overflow: hidden;
	${props => {
		switch (props.$inputSize) {
			case InputSize.SMALL:
				return css`
					width: 28px;
					height: 16px;
					padding-left: 8px;
				`;
			case InputSize.MEDIUM:
				return css`
					width: 36px;
					height: 24px;
					padding-top: 4px;
					padding-left: 16px;
				`;
			case InputSize.LARGE:
				return css`
					width: 36px;
					height: 24px;
					padding-top: 4px;
					padding-left: 16px;
				`;
		}
	}}
	padding-right: 4px;
`;

const SuffixWrapper = styled.span`
	position: absolute;
	/* width: 16px;
	height: 16px; */
`;

type VerifyInputButtonWrapperProps = {
	$verified?: boolean;
};

const VerifyInputButtonWrapper = styled.button<VerifyInputButtonWrapperProps>`
	outline: none;
	cursor: pointer;
	background-color: ${({ $verified }) =>
		$verified ? 'transparent' : brandColors.giv[50]};
	border: 1px solid
		${({ $verified }) =>
			$verified ? semanticColors.jade[500] : brandColors.giv[50]};
	border-radius: 8px;
	padding: 3px 8px;
	span {
		color: ${({ $verified }) =>
			$verified ? semanticColors.jade[500] : brandColors.giv[500]};
		font-size: 10px;
		font-weight: 400;
		line-height: 13.23px;
		text-align: left;
	}
	svg {
		color: ${({ $verified }) =>
			$verified ? semanticColors.jade[500] : brandColors.giv[500]};
	}
	&:disabled {
		opacity: 0.5;
	}
`;

export default InputUserEmailVerify;

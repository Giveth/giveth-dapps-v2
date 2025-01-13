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
	IconAlertCircle,
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
import { FormattedMessage, useIntl } from 'react-intl';
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
import {
	SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
	SEND_USER_CONFIRMATION_CODE_FLOW,
} from '@/apollo/gql/gqlUser';
import { client } from '@/apollo/apolloClient';
import { showToastError } from '@/lib/helpers';
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
	| (IInputWithRegister & {
			verifiedSaveButton?: (verified: boolean) => void;
	  })
	| ({
			registerName?: never;
			register?: never;
			registerOptions?: never;
			verifiedSaveButton?: (verified: boolean) => void;
	  } & IInput);

interface IExtendedInputLabelProps extends IInputLabelProps {
	$validation?: EInputValidation;
}

const InputUserEmailVerify = forwardRef<HTMLInputElement, InputType>(
	(props, inputRef) => {
		const { formatMessage } = useIntl();
		const { user, updateUser } = useProfileContext();

		const [email, setEmail] = useState(user.email);
		const [verified, setVerified] = useState(user.isEmailVerified);
		const [disableVerifyButton, setDisableVerifyButton] = useState(
			!user.isEmailVerified && !user.email,
		);
		const [isVerificationProcess, setIsVerificationProcess] =
			useState(false);
		const [isCooldown, setIsCooldown] = useState(false);
		const [cooldownTime, setCooldownTime] = useState(0);

		const [inputDescription, setInputDescription] = useState(
			verified
				? formatMessage({
						id: 'label.email_already_verified',
					})
				: formatMessage({
						id: 'label.email_used',
					}),
		);
		const codeInputRef = useRef<HTMLInputElement>(null);

		const {
			label,
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

		const [validationCodeStatus, setValidationCodeStatus] = useState(
			EInputValidation.SUCCESS,
		);
		const [disableCodeVerifyButton, setDisableCodeVerifyButton] =
			useState(true);

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

		// Reset cooldown
		const resetCoolDown = () => {
			setIsCooldown(false);
			setCooldownTime(0);
		};

		// Enable verification process "button" if email input value was empty and not verified yet
		// and setup email if input value was changed and has more than 3 characters
		const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (e.target.value.length > 3) {
				setEmail(e.target.value);
				setDisableVerifyButton(false);
			} else {
				setDisableVerifyButton(true);
			}

			// Check if user is changing email address
			if (e.target.value !== user.email) {
				setVerified(false);
				props.verifiedSaveButton && props.verifiedSaveButton(false);
			} else if (e.target.value !== user.email && user.isEmailVerified) {
				setVerified(true);
				props.verifiedSaveButton && props.verifiedSaveButton(true);
			} else if (e.target.value === user.email && user.isEmailVerified) {
				setVerified(true);
				props.verifiedSaveButton && props.verifiedSaveButton(true);
			}
		};

		// Verification email handler, it will be called on button click
		// It will send request to backend to check if email exists and if it's not verified yet
		// or email is already exist on another user account
		// If email isn't verified it will send email with verification code to user
		const verificationEmailHandler = async () => {
			// Prevent the button from being clicked during cooldown
			if (isCooldown) {
				return;
			}

			// Start cooldown timer
			setIsCooldown(true);
			setCooldownTime(180);

			const intervalId = setInterval(() => {
				setCooldownTime(prev => {
					if (prev <= 1) {
						resetCoolDown();
						setDisableVerifyButton(false);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			try {
				const { data } = await client.mutate({
					mutation: SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
					variables: {
						email: email,
					},
				});

				if (data.sendUserEmailConfirmationCodeFlow === 'EMAIL_EXIST') {
					setValidationStatus(EInputValidation.WARNING);
					setDisableVerifyButton(true);
					setInputDescription(
						formatMessage({
							id: 'label.email_used_another',
						}),
					);
				}

				if (
					data.sendUserEmailConfirmationCodeFlow ===
					'VERIFICATION_SENT'
				) {
					setIsVerificationProcess(true);
					setValidationStatus(EInputValidation.NORMAL);
					setInputDescription(
						formatMessage({
							id: 'label.email_used',
						}),
					);
				}

				// Stop the timer when fetch ends
				resetCoolDown();

				// Clear interval when fetch is done
				clearInterval(intervalId);
			} catch (error) {
				if (error instanceof Error) {
					clearInterval(intervalId);
					resetCoolDown();
					showToastError(error.message);
				}
				console.log(error);
			}
		};

		// Verification code handler, it will be called on button click
		const handleInputCodeChange = (
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			const value = e.target.value;
			value.length >= 5
				? setDisableCodeVerifyButton(false)
				: setDisableCodeVerifyButton(true);
		};

		// Sent verification code to backend to check if it's correct
		const handleButtonCodeChange = async () => {
			try {
				const { data } = await client.mutate({
					mutation: SEND_USER_CONFIRMATION_CODE_FLOW,
					variables: {
						verifyCode: codeInputRef.current?.value,
						email: email,
					},
				});

				if (
					data.sendUserConfirmationCodeFlow === 'VERIFICATION_SUCCESS'
				) {
					// Reset states
					setIsVerificationProcess(false);
					setDisableCodeVerifyButton(true);
					setVerified(true);
					props.verifiedSaveButton && props.verifiedSaveButton(true);
					setValidationCodeStatus(EInputValidation.SUCCESS);

					// Update user data
					updateUser({
						email: email,
						isEmailVerified: true,
					});
				}
			} catch (error) {
				if (error instanceof Error) {
					showToastError(error.message);
				}
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
							$validation={
								isVerificationProcess
									? EInputValidation.ERROR
									: undefined
							}
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
						$validation={
							isVerificationProcess
								? EInputValidation.NORMAL
								: undefined
						}
						$inputSize={size}
						maxLength={maxLength}
						value={value}
						id={id}
						disabled={isVerificationProcess}
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
					{!isVerificationProcess && (
						<Absolute>
							<VerifyInputButtonWrapper
								type='button'
								$verified={verified}
								disabled={disableVerifyButton || verified}
								onClick={verificationEmailHandler}
							>
								<Flex $alignItems='center' gap='8px'>
									{!verified && <IconEmptyCircle />}
									{verified && <IconCheckCircleFilled />}
									<span>{labelButton}</span>
								</Flex>
							</VerifyInputButtonWrapper>
						</Absolute>
					)}
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
					<InputDesc
						size={InputSizeToLinkSize(size)}
						$validationstatus={validationStatus}
					>
						{isCooldown && (
							<InputCodeDesc>
								<FormattedMessage
									id='label.email_cooldown'
									values={{
										button: chunks => (
											<button
												type='button'
												onClick={
													verificationEmailHandler
												}
												disabled={isCooldown}
											>
												{chunks}
											</button>
										),
										time: () => (
											<b>
												{Math.floor(cooldownTime / 60)}:
												{(
													'0' +
													(cooldownTime % 60)
												).slice(-2)}
											</b>
										),
									}}
								/>
							</InputCodeDesc>
						)}
						{!isCooldown && inputDescription}
					</InputDesc>
				)}
				{isVerificationProcess && (
					<ValidationCode>
						<EmailSentNotification
							gap='8px'
							$alignItems='center'
							$justifyContent='center'
						>
							<IconAlertCircle />
							{formatMessage(
								{
									id: 'label.email_sent_to',
								},
								{ email },
							)}
						</EmailSentNotification>
						<label htmlFor='code'>
							<InputLabel
								$disabled={disabled}
								size={InputSizeToLinkSize(size)}
							>
								{formatMessage({
									id: 'label.email_please_verify',
								})}
							</InputLabel>
						</label>
						<InputWrapper>
							<InputStyled
								$validation={validationCodeStatus}
								$inputSize={size}
								$hasLeftIcon={!!LeftIcon}
								maxLength={5}
								id='code'
								ref={codeInputRef}
								data-testid='styled-input'
								onChange={handleInputCodeChange}
							/>
							<Absolute>
								<VerifyInputButtonWrapper
									type='button'
									$verified={verified}
									disabled={disableCodeVerifyButton}
									onClick={handleButtonCodeChange}
								>
									<Flex $alignItems='center' gap='8px'>
										{!verified && <IconEmptyCircle />}
										{verified && <IconCheckCircleFilled />}
										<span>
											{formatMessage({
												id: 'label.email_confirm_code',
											})}
										</span>
									</Flex>
								</VerifyInputButtonWrapper>
							</Absolute>
						</InputWrapper>
						<InputCodeDesc>
							<FormattedMessage
								id='label.email_get_resend'
								values={{
									button: chunks => (
										<button
											type='button'
											onClick={verificationEmailHandler}
										>
											{chunks}
										</button>
									),
								}}
							/>
						</InputCodeDesc>
					</ValidationCode>
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

const InputLabel = styled(GLink)<IExtendedInputLabelProps>`
	padding-bottom: 4px;
	color: ${props =>
		props.$validation === EInputValidation.ERROR
			? semanticColors.punch[600]
			: neutralColors.gray[900]};
	&::after {
		content: '*';
		display: ${props => (props.$required ? 'inline-block' : 'none')};
		padding: 0 4px;
		color: ${semanticColors.punch[500]};
	}
`;

const InputDesc = styled(GLink)<{ $validationstatus: EInputValidation }>`
	padding-top: 4px;
	color: ${props => {
		switch (props.$validationstatus) {
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
		opacity: ${({ $verified }) => ($verified ? '1' : '0.5')};
	}
`;

const ValidationCode = styled(Flex)`
	flex-direction: column;
	margin-top: 30px;
	margin-bottom: 25px;
`;

const EmailSentNotification = styled(Flex)`
	width: 100%;
	margin-bottom: 20px;
	border: 1px solid ${brandColors.giv[200]};
	padding: 16px;
	border-radius: 8px;
	font-size: 12px;
	font-weight: 400;
	line-height: 15.88px;
	text-align: left;
	color: ${brandColors.giv[500]};
	svg {
		color: ${brandColors.giv[500]};
	}
`;

const InputCodeDesc = styled(GLink)`
	padding-top: 4px;
	font-size: 0.625rem;
	line-height: 132%;
	& button {
		background: none;
		border: none;
		padding: 0;
		color: ${brandColors.pinky[400]};
		font-size: 0.625rem;
		line-height: 132%;
		cursor: pointer;
	}
`;

export default InputUserEmailVerify;

import { FC, useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import {
	H6,
	neutralColors,
	Col,
	Row,
	brandColors,
	semanticColors,
	IconAlertCircle,
	Flex,
	GLink,
} from '@giveth/ui-design-system';
import styled from 'styled-components';
import { captureException } from '@sentry/nextjs';
import { useForm } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import {
	SEND_USER_CONFIRMATION_CODE_FLOW,
	SEND_USER_EMAIL_CONFIRMATION_CODE_FLOW,
	UPDATE_USER,
} from '@/apollo/gql/gqlUser';
import { SkipOnboardingModal } from '@/components/modals/SkipOnboardingModal';
import { gToast, ToastType } from '@/components/toasts';
import {
	IStep,
	OnboardActionsContainer,
	OnboardStep,
	SaveButton,
	SkipButton,
} from './common';
import { OnboardSteps } from './Onboarding.view';
import Input from '@/components/Input';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { setShowSignWithWallet } from '@/features/modal/modal.slice';
import { fetchUserByAddress } from '@/features/user/user.thunks';
import { requiredOptions, validators } from '@/lib/constants/regex';
import { useGeneralWallet } from '@/providers/generalWalletProvider';
import { client } from '@/apollo/apolloClient';
import InputStyled from '@/components/styled-components/Input';
import { EInputValidation } from '@/types/inputValidation';

export interface IUserInfo {
	email: string;
	firstName: string;
	lastName: string;
	location: string;
	url: string;
}

enum EUserInfo {
	EMAIL = 'email',
	FIRST_NAME = 'firstName',
	LAST_NAME = 'lastName',
	LOCATION = 'location',
	URL = 'url',
}

interface IInputLabelProps {
	$required?: boolean;
	$disabled?: boolean;
}

interface IExtendedInputLabelProps extends IInputLabelProps {
	$validation?: EInputValidation;
}

const InfoStep: FC<IStep> = ({ setStep }) => {
	const { formatMessage } = useIntl();
	const [isLoading, setIsLoading] = useState(false);
	const [updateUser] = useMutation(UPDATE_USER);
	const [showModal, setShowModal] = useState(false);

	const { walletAddress: address } = useGeneralWallet();
	const dispatch = useAppDispatch();
	const { isSignedIn, userData } = useAppSelector(state => state.user);

	// States for email verification
	const { userData: currentDBUser } = useAppSelector(state => state.user);
	const [verified, setVerified] = useState(
		currentDBUser?.isEmailVerified || false,
	);
	const [disableVerifyButton, setDisableVerifyButton] = useState(
		!currentDBUser?.isEmailVerified && !currentDBUser?.email,
	);
	const [disableCodeVerifyButton, setDisableCodeVerifyButton] =
		useState(true);
	const [email, setEmail] = useState(currentDBUser?.email || '');
	const [isVerificationProcess, setIsVerificationProcess] = useState(false);
	const [validationStatus, setValidationStatus] = useState(
		EInputValidation.NORMAL,
	);
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
	const [validationCodeStatus, setValidationCodeStatus] = useState(
		EInputValidation.SUCCESS,
	);

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

		// Check if user is changing email address
		if (e.target.value !== currentDBUser?.email) {
			setVerified(false);
		} else if (
			e.target.value !== currentDBUser.email &&
			currentDBUser.isEmailVerified
		) {
			setVerified(true);
		}
	};

	// Verification email handler, it will be called on button click
	// It will send request to backend to check if email exists and if it's not verified yet
	// or email is already exist on another user account
	// If email isn't verified it will send email with verification code to user
	const verificationEmailHandler = async () => {
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
				gToast(
					formatMessage({
						id: 'label.email_used_another',
					}),
					{
						type: ToastType.DANGER,
						title: formatMessage({
							id: 'label.email_error_verify',
						}),
					},
				);
			}

			if (
				data.sendUserEmailConfirmationCodeFlow === 'VERIFICATION_SENT'
			) {
				setIsVerificationProcess(true);
				setValidationStatus(EInputValidation.NORMAL);
				setInputDescription(
					formatMessage({
						id: 'label.email_used',
					}),
				);
			}
		} catch (error) {
			if (error instanceof Error) {
				gToast(error.message, {
					type: ToastType.DANGER,
					title: formatMessage({
						id: 'label.email_error_verify',
					}),
				});
			}
			console.error(error);
		}
	};

	// Verification code handler, it will be called on button click
	const handleInputCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

			if (data.sendUserConfirmationCodeFlow === 'VERIFICATION_SUCCESS') {
				// Reset states
				setIsVerificationProcess(false);
				setDisableCodeVerifyButton(true);
				setVerified(true);
				setValidationCodeStatus(EInputValidation.SUCCESS);
			}
		} catch (error) {
			if (error instanceof Error) {
				gToast(error.message, {
					type: ToastType.DANGER,
					title: formatMessage({
						id: 'label.email_error_verify',
					}),
				});
			}
			console.log(error);
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IUserInfo>({
		mode: 'onBlur',
		reValidateMode: 'onBlur',
		defaultValues: {
			[EUserInfo.EMAIL]: userData?.email || '',
			[EUserInfo.FIRST_NAME]: userData?.firstName || '',
			[EUserInfo.LAST_NAME]: userData?.lastName || '',
			[EUserInfo.LOCATION]: userData?.location || '',
			[EUserInfo.URL]: userData?.url || '',
		},
	});

	useEffect(() => {
		if (!isSignedIn) {
			dispatch(setShowSignWithWallet(true));
		}
	}, [isSignedIn]);

	const handleLater = () => {
		setShowModal(true);
	};

	const onSave = async (formData: IUserInfo) => {
		setIsLoading(true);
		try {
			const { data: response } = await updateUser({
				variables: {
					...formData,
					newUser: true,
				},
			});
			if (response.updateUser) {
				setStep(OnboardSteps.PHOTO);
				address && dispatch(fetchUserByAddress(address));
				gToast('Profile information updated.', {
					type: ToastType.SUCCESS,
					title: 'Success',
				});
				return true;
			} else {
				throw 'Update User Failed';
			}
		} catch (error: any) {
			gToast('Failed to update your information. Please try again.', {
				type: ToastType.DANGER,
				title: error.message,
			});
			captureException(error, {
				tags: {
					section: 'InfoStepOnSave',
				},
			});
		}
		setIsLoading(false);
		return false;
	};

	return (
		<OnboardStep xs={12} xl={8} sm={12}>
			<form onSubmit={handleSubmit(onSave)} noValidate>
				<SectionHeader>What should we call you?</SectionHeader>
				<Section>
					<Col xs={12} md={6}>
						<Input
							registerName={EUserInfo.FIRST_NAME}
							label='first name'
							placeholder='John'
							autoFocus
							register={register}
							registerOptions={requiredOptions.firstName}
							error={errors.firstName}
						/>
					</Col>
					<Col xs={12} md={6}>
						<Input
							label='last name'
							placeholder='Doe'
							registerName={EUserInfo.LAST_NAME}
							register={register}
							registerOptions={requiredOptions.lastName}
							error={errors.lastName}
						/>
					</Col>
					<Col xs={12} md={6}>
						<Input
							registerName={EUserInfo.EMAIL}
							label='email'
							placeholder='Example@Domain.com'
							register={register}
							type='email'
							registerOptions={requiredOptions.email}
							error={errors.email}
							caption={inputDescription}
							onChange={handleInputChange}
						/>
					</Col>
					{!isVerificationProcess && (
						<Col xs={12} md={6}>
							<VerifyInputButtonWrapper
								type='button'
								$verified={verified}
								disabled={disableVerifyButton}
								onClick={verificationEmailHandler}
							>
								{labelButton}
							</VerifyInputButtonWrapper>
						</Col>
					)}
					{isVerificationProcess && (
						<>
							<Col xs={12} md={12}>
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
							</Col>
							<Col xs={12} md={6}>
								<label htmlFor='code'>
									<InputLabel>
										{formatMessage({
											id: 'label.email_please_verify',
										})}
									</InputLabel>
								</label>
								<InputStyled
									$validation={validationCodeStatus}
									maxLength={5}
									id='code'
									ref={codeInputRef}
									data-testid='styled-input'
									onChange={handleInputCodeChange}
								/>
								<InputCodeDesc>
									<FormattedMessage
										id='label.email_get_resend'
										values={{
											button: chunks => (
												<button
													type='button'
													onClick={
														verificationEmailHandler
													}
												>
													{chunks}
												</button>
											),
										}}
									/>
								</InputCodeDesc>
							</Col>
							<Col xs={12} md={6}>
								<VerifyCodeButtonWrapper
									type='button'
									$verified={verified}
									disabled={disableCodeVerifyButton}
									onClick={handleButtonCodeChange}
								>
									{formatMessage({
										id: 'label.email_confirm_code',
									})}
								</VerifyCodeButtonWrapper>
							</Col>
						</>
					)}
				</Section>
				<SectionHeader>Where are you?</SectionHeader>
				<Section>
					<Col xs={12} md={6}>
						<Input
							label='location (optional)'
							placeholder='Portugal, Turkey,...'
							registerName={EUserInfo.LOCATION}
							register={register}
						/>
					</Col>
				</Section>
				<SectionHeader>
					Personal website or URL to somewhere special?
				</SectionHeader>
				<Section>
					<Col xs={12} md={6}>
						<Input
							label='website or url'
							placeholder='Website'
							registerName={EUserInfo.URL}
							register={register}
							type='url'
							caption='Your home page, blog, or company site.'
							registerOptions={validators.website}
							error={errors.url}
						/>
					</Col>
				</Section>
				<OnboardActionsContainer>
					<Col xs={12} md={7}>
						<SaveButton
							label='SAVE & CONTINUE'
							disabled={isLoading || !verified}
							size='medium'
							type='submit'
						/>
					</Col>
					<Col xs={12} md={2}>
						<SkipButton
							label='Do it later'
							size='medium'
							buttonType='texty'
							onClick={handleLater}
						/>
					</Col>
				</OnboardActionsContainer>
			</form>
			{showModal && <SkipOnboardingModal setShowModal={setShowModal} />}
		</OnboardStep>
	);
};

const Section = styled(Row)`
	margin-top: 32px;
	margin-bottom: 67px;
`;

const SectionHeader = styled(H6)`
	padding-bottom: 16px;
	border-bottom: 1px solid ${neutralColors.gray[400]};
`;

type VerifyInputButtonWrapperProps = {
	$verified?: boolean;
};

const VerifyInputButtonWrapper = styled.button<VerifyInputButtonWrapperProps>`
	outline: none;
	cursor: pointer;
	margin-top: 24px;
	background-color: ${({ $verified }) =>
		$verified ? semanticColors.jade[500] : brandColors.giv[500]};
	border: 1px solid
		${({ $verified }) =>
			$verified ? semanticColors.jade[500] : brandColors.giv[50]};
	border-radius: 8px;
	padding: 20px 20px;
	color: #ffffff;
	font-size: 16px;
	font-weight: 500;
	line-height: 13.23px;
	text-align: left;
	&:hover {
		opacity: 0.85;
	}
	&:disabled {
		opacity: 0.5;
	}
`;

const VerifyCodeButtonWrapper = styled.button<VerifyInputButtonWrapperProps>`
	outline: none;
	cursor: pointer;
	margin-top: 48px;
	background-color: ${({ $verified }) =>
		$verified ? semanticColors.jade[500] : brandColors.giv[500]};
	border: 1px solid
		${({ $verified }) =>
			$verified ? semanticColors.jade[500] : brandColors.giv[50]};
	border-radius: 8px;
	padding: 20px 20px;
	color: #ffffff;
	font-size: 16px;
	font-weight: 500;
	line-height: 13.23px;
	text-align: left;
	&:hover {
		opacity: 0.85;
	}
	&:disabled {
		opacity: 0.5;
	}
`;

const EmailSentNotification = styled(Flex)`
	width: 100%;
	margin-top: 20px;
	margin-bottom: 20px;
	border: 1px solid ${brandColors.giv[200]};
	padding: 16px;
	border-radius: 8px;
	font-size: 1em;
	font-weight: 400;
	line-height: 15.88px;
	text-align: left;
	color: ${brandColors.giv[500]};
	svg {
		color: ${brandColors.giv[500]};
	}
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

const InputCodeDesc = styled(GLink)`
	padding-top: 4px;
	font-size: 0.75rem;
	line-height: 132%;
	& button {
		background: none;
		border: none;
		padding: 0;
		color: ${brandColors.pinky[400]};
		font-size: 0.75rem;
		line-height: 132%;
		cursor: pointer;
	}
`;

export default InfoStep;
